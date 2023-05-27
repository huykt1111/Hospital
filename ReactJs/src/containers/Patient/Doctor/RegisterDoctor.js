import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './RegisterDoctor.scss';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import Select from 'react-select';
import { getDetailInforDoctor, getAllUsers } from "../../../services/userService";

const mdParser = new MarkdownIt();

class RegisterDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentHtml: '',
            contentMarkdown: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            positionArr: [],
            user: [],
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            name: '',
            previewImgURL: '',
            avatar: '',
            position: ''
        }
    }

    async componentDidMount() {
        this.props.getRequiredDoctorInfor();
        this.props.getPositionStart();
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let response = await getAllUsers(id);
            if (response && response.errCode === 0) {
                let user = response.users;
                let fullname = user.ho + ' ' + user.ten;
                this.setState({
                    name: fullname,
                    previewImgURL: user.hinhAnh
                })
            }

        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.tenChuyenKhoa;
                    object.value = item.id;
                    result.push(object);
                })
            }

            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.tenPhongKham;
                    object.value = item.id;
                    result.push(object);
                })
            }

        };
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHtml: html,
        })
    }

    handleOnChangImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    handleSaveContentMarkdown = () => {
        this.props.saveDetailDoctors({
            id: parseInt(this.props.match.params.id),
            selectedSpecialty: this.state.selectedSpecialty.value,
            selectedClinic: this.state.selectedClinic.value,
            position: this.state.position,
            selectedPrice: this.state.selectedPrice.value,
            selectedProvince: this.state.selectedProvince.value,
            selectedPayment: this.state.selectedPayment.value,
            addressClinic: this.state.addressClinic,
            nameClinic: this.state.nameClinic,
            note: this.state.note,
            description: this.state.description,
            contentHtml: this.state.contentHtml,
            contentMarkdown: this.state.contentMarkdown,
            avatar: this.state.avatar
        })

        this.setState({
            contentHtml: '',
            contentMarkdown: '',
            description: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            name: '',
            previewImgURL: '',
            avatar: '',
            position: ''
        })
    }

    handleChangeSelectDoctorInfor = async (selectedDoctor, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedDoctor;
        this.setState({
            ...stateCopy
        })
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };

        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        });

    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    };


    render() {
        let { position } = this.state;
        let positions = this.state.positionArr;
        let { language } = this.props;
        return (
            <div div className="manage-doctor-register-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.register-doctor" />
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.name" />
                        </label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'name')}
                            value={this.state.name}
                        />
                    </div>
                    <div className="col-3">
                        <label><FormattedMessage id="manage-user.position" /></label>
                        <select id="inputState"
                            onChange={(event) => { this.onChangeInput(event, 'position') }}
                            className="form-control"
                            value={position}
                        >
                            {positions && positions.length > 0 &&
                                positions.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="content-right">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.intro" />
                        </label>
                        <textarea className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className="more-info-extra row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            name={"selectedPrice"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.payment" />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                            name={"selectedPayment"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                            name={"selectedProvince"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.name-clinic" />
                        </label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.address-clinic" />
                        </label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input className="form-control"
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-4 form-group">
                        <label>{<FormattedMessage id="admin.manage-doctor.specialty" />}</label>
                        <Select
                            value={this.state.selectedSpecialty}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                            onChange={this.handleChangeSelectDoctorInfor}
                            name={"selectedSpecialty"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>{<FormattedMessage id="admin.manage-doctor.clinic" />}</label>
                        <Select
                            value={this.state.selectedClinic}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.clinic" />}
                            onChange={this.handleChangeSelectDoctorInfor}
                            name={"selectedClinic"}
                        />
                    </div>
                    <div className="col-3">
                        <label><FormattedMessage id="patient.family.image" /></label>
                        <div className="preview-img-container">
                            <input id="previewImg" type="file" hidden
                                onChange={(event) => this.handleOnChangImage(event)}
                            />
                            <label htmlFor="previewImg"
                                className="label-upload">
                                Tải ảnh
                                <i className="fas fa-upload"></i>
                            </label>
                            <div className="preview-image"
                                style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                onClick={() => this.openPreviewImage()}
                            >
                            </div>
                        </div>
                    </div>
                </div>

                <div className="manage-doctor-editor" style={{ marginTop: "30px" }}>
                    <label>
                        Chi tiết hồ sơ làm việc
                    </label>
                    <MdEditor style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button className={"create-content-doctor"}
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    <span>
                        <FormattedMessage id="admin.manage-doctor.create-infor" />
                    </span>
                </button>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        positionRedux: state.admin.positions,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveDetailDoctors: (data) => dispatch(actions.saveDetailDoctors(data)),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDoctor);
