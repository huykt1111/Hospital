import React, { Component } from 'react';
import './ChatBoxPatient.scss';
import { connect } from "react-redux";
import { getChatDoctorByDoctor, sendChatBox } from '../../../services/userService';

class MessageList extends Component {
    render() {
        const { messages, selectedMessageIndex, onSelectMessage } = this.props;
        let numMessage = 0;
        return (
            <div className="message-list">
                {messages.map((message, index) => {
                    if (message && message.chatboxes) {
                        numMessage = message.chatboxes.length - 1;
                    }
                    return (
                        <div
                            className={`message ${selectedMessageIndex === index ? 'selected' : ''}`}
                            key={index}
                            onClick={() => onSelectMessage(index)}
                        >
                            <div className="sender">
                                {message && message.chatboxes && message.chatboxes[numMessage].patientChatData &&
                                    message.chatboxes[numMessage].patientChatData.ho + " " + message.chatboxes[numMessage].patientChatData.ten}
                            </div>
                            <div className="content-message">{message && message.chatboxes && message.chatboxes[numMessage].noiDung}</div>
                        </div>
                    )
                })}
            </div>
        );
    }
}

class MessageDisplay extends Component {

    async componentDidMount() {
        if (this.props.message && this.props.message.chatboxes) {
            this.props.handleSelectMaBN(this.props.message.chatboxes[0].maND);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.message !== this.props.message) {
            if (this.props.message && this.props.message.chatboxes) {
                this.props.handleSelectMaBN(this.props.message.chatboxes[0].maND);
            }
        }
    }

    render() {
        const { message } = this.props;
        return (
            <>
                {message && message.chatboxes && message.chatboxes.map((message, index) => (
                    <div key={index}>
                        {message.maND === message.maNN ?
                            <div className="message-display" key={index}>
                                <div className="sender">
                                    {message && message.patientChatData &&
                                        message.patientChatData.ho + " " + message.patientChatData.ten}
                                </div>
                                <div className="content-message">
                                    {message && message.noiDung && message.noiDung}
                                </div>
                                <div className="message-timestamp">
                                    {new Date(message.createdAt).toLocaleString()}
                                </div>
                            </div>
                            :
                            <div className="message-display-doctor" key={index}>
                                <div className="sender">
                                    {this.props.user && this.props.user.user &&
                                        this.props.user.user.ho + " " + this.props.user.user.ten}
                                </div>
                                <div className="content-message">
                                    {message && message.noiDung && message.noiDung}
                                </div>
                                <div className="message-timestamp">
                                    {new Date(message.createdAt).toLocaleString()}
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </>
        );
    }
}

class MessageReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            replyMessage: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({ replyMessage: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // Xử lý logic trả lời tin nhắn ở đây
        this.props.handleSendMessagePatient(this.state.replyMessage)
        console.log('Đã trả lời tin nhắn:', this.state.replyMessage);
        this.setState({ replyMessage: '' }); // Xóa nội dung tin nhắn sau khi trả lời
    };

    render() {
        const { replyMessage } = this.state;
        return (
            <div className="message-reply-container">
                <div className="message-reply-header">
                    <h1>Tin nhắn</h1>
                </div>
                <div className="message-reply-content">
                    <div className="sidebar">
                        <MessageList
                            messages={this.props.messages}
                            selectedMessageIndex={this.props.selectedMessageIndex}
                            onSelectMessage={this.props.onSelectMessage}
                        />
                    </div>
                    <div className="main">
                        {this.props.selectedMessageIndex !== null && (
                            <MessageDisplay
                                message={this.props.messages[this.props.selectedMessageIndex]}
                                user={this.props.user}
                                handleSelectMaBN={this.props.handleSelectMaBN}
                            />
                        )}
                        <form onSubmit={this.handleSubmit} className="message-reply-form">
                            <textarea
                                value={replyMessage}
                                onChange={this.handleInputChange}
                                className="message-reply-textarea"
                                placeholder="Nhập tin nhắn..."
                            />
                            <button type="submit" className="message-reply-button">Gửi</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

class ChatBoxPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            maBN: -1,
            selectedMessageIndex: null,
        }
    }

    async componentDidMount() {
        this.getMessagesByDoctor();
    }

    getMessagesByDoctor = async () => {
        const res = await getChatDoctorByDoctor({ maBS: this.props.user.user.id });
        if (res && res.errCode === 0) {
            this.setState({
                messages: res.chatbox
            })
        }
    }

    handleSelectMaBN = (maBN) => {
        this.setState({
            maBN: maBN
        })
    }

    handleSelectMessage = (index) => {
        this.setState({ selectedMessageIndex: index });
    };

    handleSendMessagePatient = async (message) => {
        if (this.props.user && this.props.user.user && message) {
            await sendChatBox({
                maND: this.state.maBN,
                maBS: this.props.user.user.id,
                maNN: this.props.user.user.id,
                noiDung: message
            });
        }
        this.getMessagesByDoctor();
    }

    render() {

        const messages = this.state.messages;
        return (
            <div className="chat-box-patient">
                <MessageReply
                    messages={messages}
                    user={this.props.user}
                    selectedMessageIndex={this.state.selectedMessageIndex}
                    handleSendMessagePatient={this.handleSendMessagePatient}
                    onSelectMessage={this.handleSelectMessage}
                    handleSelectMaBN={this.handleSelectMaBN}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxPatient);