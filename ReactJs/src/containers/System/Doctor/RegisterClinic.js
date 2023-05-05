import React, { Component } from 'react';
import { connect } from "react-redux";
import './RegisterClinic.scss';
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { registerNewClinic } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt();

class RegisterClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHtml: '',
            descriptionMarkdown: '',
            idClinic: '',
            arrClinic: [],
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

    handleRegisterClinic = async () => {
        let res = await registerNewClinic(this.state);
        if (res && res.errCode === 0) {
            toast.success("Register new clinic succeed!")
            this.setState({
                name: '',
                address: '',
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
            <div className="manage-specialty-container">
                <div className="title text-center">
                    <FormattedMessage id="menu.doctor.clinic-register" />
                </div>
                <div className="add-new-specialty row">
                    <div className="col-12 form-group">
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-12 form-group">
                                        <label><FormattedMessage id="admin.manage-clinic.name-clinic" /></label>
                                        <input className="form-control"
                                            type="text"
                                            value={this.state.name}
                                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                        />
                                    </div>
                                    <div className="col-12 form-group">
                                        <label><FormattedMessage id="admin.manage-clinic.address-clinic" /></label>
                                        <input className="form-control"
                                            type="text"
                                            value={this.state.address}
                                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-12 form-group">
                                        <label><FormattedMessage id="admin.manage-clinic.clinic-photo" /></label>
                                        <input className="form-control-file"
                                            type="file"
                                            onChange={(event) => this.handleOnChangImage(event)}
                                        />
                                        <td style={{ width: '100px' }}>
                                            <div className='content-one-image'
                                                style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                                            ></div>
                                        </td>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            onClick={() => this.handleRegisterClinic()}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterClinic);
