import React, { Component } from 'react';
import { connect } from "react-redux";
import './RegisterSpecialty.scss';
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { registerNewSpecialty } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt();

class RegisterSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHtml: '',
            descriptionMarkdown: '',
            idSpecialty: '',
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHtml: html,
        })
    }

    handleOnChangImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }
    }

    handleRegisterSpecialty = async () => {
        let res = await registerNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success("Register new specialty succeed!")
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHtml: '',
                descriptionMarkdown: ''
            })
        } else {
            toast.error("Something wrongs....")
        }

    }

    render() {
        let { language } = this.props;
        return (
            <div className="register-specialty-container">
                <div className="title">
                    <FormattedMessage id="menu.doctor.specialty-register" />
                </div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.name-specialty" /></label>
                        <input className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.specialty-photo" /></label>
                        <input className="form-control-file"
                            type="file"
                            onChange={(event) => this.handleOnChangImage(event)}
                        />
                        {this.state.imageBase64 !== '' &&
                            <td style={{ width: '100px' }}>
                                <div className='content-one-image'
                                    style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                                ></div>
                            </td>
                        }
                    </div>
                    <div className="col-12">
                        <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12 my-3">
                        <button className="btn btn-primary"
                            onClick={() => this.handleRegisterSpecialty()}
                        >
                            <FormattedMessage id="admin.manage-clinic.register" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterSpecialty);
