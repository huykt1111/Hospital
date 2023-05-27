import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import { getDetailInforDoctor, sendChatBox, getChatDoctorByUser } from '../../../services/userService'
import './DetailDoctor.scss';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
// import Comment from '../SocialPlugin/Comment';
import { FormattedMessage } from 'react-intl';

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            chatbox: [],
            inputValue: '',
            isOpen: false,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailInforDoctor(id);
            this.setState({
                currentDoctorId: id
            })
            if (res && res.errCode == 0) {
                this.setState({
                    detailDoctor: res.data,
                })
            }

            this.handleGetChatBox();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleGetChatBox = async () => {
        if (this.props.userInfo && this.props.userInfo.user && this.state.detailDoctor) {
            let res = await getChatDoctorByUser({
                maND: this.props.userInfo.user.id,
                maBS: this.state.detailDoctor.maTk,
            });
            if (res && res.errCode == 0) {
                this.setState({
                    chatbox: res.chatbox,
                })
            }

        }
    }

    handleMessageSubmit = async (e) => {
        e.preventDefault();
        const { inputValue } = this.state;
        if (inputValue.trim() !== '') {
            if (this.props.userInfo && this.props.userInfo.user && this.state.detailDoctor) {
                await sendChatBox({
                    maND: this.props.userInfo.user.id,
                    maBS: this.state.detailDoctor.maTk,
                    maNN: this.props.userInfo.user.id,
                    noiDung: inputValue
                });
            }
            this.handleGetChatBox();
            this.setState({
                inputValue: ''
            })
        }
    };

    toggleChatbox = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };


    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData && detailDoctor.TaiKhoan) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.TaiKhoan.ho} ${detailDoctor.TaiKhoan.ten}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.TaiKhoan.ten} ${detailDoctor.TaiKhoan.ho}`;
        }

        let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ?
            "https://developers.facebook.com/docs/plugins/" : window.location.href;
        let currentURLCMD = +process.env.REACT_APP_IS_LOCALHOST === 1 ?
            "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href;
        let { inputValue, isOpen, chatbox } = this.state;
        console.log("chatbox", chatbox)
        return (
            <React.Fragment >
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div className='content-left'>
                            <div className='content-left-image'
                                style={{ backgroundImage: `url(${detailDoctor && detailDoctor.TaiKhoan && detailDoctor.TaiKhoan.hinhAnh ? detailDoctor.TaiKhoan.hinhAnh : ''})` }}
                            />
                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className="down">
                                {detailDoctor && detailDoctor.mieuTa &&

                                    <span>{detailDoctor.mieuTa}</span>

                                }
                                <div className="like-share-plugin">
                                    <LikeAndShare
                                        data-href={currentURL}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfor doctorIdFromParent={this.state.currentDoctorId} showMap={true} />
                        </div>
                    </div>
                    <div className="detail-doctor">
                        {detailDoctor && detailDoctor.noiDungHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.noiDungHTML }}>

                            </div>
                        }

                    </div>
                    <div className="comment-patient">
                        {/* <Comment
                            data-href={currentURLCMD}
                        /> */}
                        <div className='comment-patient-title'>
                            <FormattedMessage id="patient.detail-doctor.comment-patient" />
                        </div>
                        {
                            detailDoctor && detailDoctor.dataDoctorLK &&
                            detailDoctor.dataDoctorLK.length > 0 &&
                            detailDoctor.dataDoctorLK.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div>{
                                            item.schedulePatientData && item.schedulePatientData.length > 0 &&
                                            item.schedulePatientData.map((itemchild, indexchild) => {
                                                const timestamp = parseInt(item.ngayKham);
                                                const dateObj = new Date(timestamp);
                                                const year = dateObj.getFullYear();
                                                const month = dateObj.getMonth() + 1;
                                                const day = dateObj.getDate();
                                                const formattedDate = `${day}/${month}/${year}`;
                                                return (
                                                    itemchild.danhGia !== null ? (
                                                        <div className='comment-patient-content' key={indexchild}>
                                                            <div className="comment-patient-name">
                                                                {itemchild.hoTen}
                                                                <span><i className="fas fa-check-circle"></i> <FormattedMessage id="patient.detail-doctor.checked-today" /> {formattedDate}</span>
                                                            </div>
                                                            <div className='comment-patient-comment'>
                                                                {itemchild.danhGia}
                                                            </div>
                                                        </div>
                                                    ) : null
                                                )
                                            })
                                        }</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {this.props.userInfo && this.props.userInfo.user &&
                        <div className={`chatbox-container ${isOpen ? 'open' : ''}`}>
                            <div className="chatbox-toggle" onClick={this.toggleChatbox}>
                                Nhắn tin với bác sĩ
                            </div>
                            <div className="chatbox">
                                <div className="chatbox-profile-doctor">
                                    <div className='content-image'
                                        style={{ backgroundImage: `url(${detailDoctor && detailDoctor.TaiKhoan && detailDoctor.TaiKhoan.hinhAnh ? detailDoctor.TaiKhoan.hinhAnh : ''})` }}
                                    />
                                    <div className="content-right">
                                        <div className="up">
                                            {detailDoctor && detailDoctor.positionData && detailDoctor.TaiKhoan &&
                                                detailDoctor.positionData.valueVi + ", " + detailDoctor.TaiKhoan.ho + " " + detailDoctor.TaiKhoan.ten}
                                        </div>
                                        <div className="down">
                                            {detailDoctor && detailDoctor.mieuTa &&
                                                <span>{detailDoctor.mieuTa.slice(0, 100) + '...'}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {chatbox && chatbox.length > 0 &&
                                    chatbox.map((message, index) => (
                                        <div key={index} className="message">
                                            {message.maND === message.maNN ?
                                                <>
                                                    <div className="message-text">
                                                        <span>{message.noiDung}</span>
                                                    </div>
                                                    <div className="message-timestamp">
                                                        {new Date(message.createdAt).toLocaleString()}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="message-doctor">
                                                        <div className="message-text-reply">
                                                            <span>{message.noiDung}</span>
                                                        </div>
                                                        <div className="message-timestamp-reply">
                                                            {new Date(message.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            {isOpen && (
                                <form onSubmit={this.handleMessageSubmit} className="chatbox-input">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => this.setState({ inputValue: e.target.value })}
                                        placeholder="Nhập nội dung tin nhắn..."
                                    />
                                    <button type="submit">Gửi</button>
                                </form>
                            )}
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
