import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import { editUserService, getAllUsers } from '../../../services/userService';
import * as actions from '../../../store/actions';
import './UpdateProfile.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from "react-toastify";

class UpdateProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            previewImgURL: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            avatar: '',
            birthday: '',
            currentDate: '',
            maTk: 0
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.handleLoadUser();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
    }

    handleLoadUser = async () => {
        if (this.props.userInfo && this.props.userInfo.user && this.props.userInfo.user.id) {
            let id = this.props.userInfo.user.id;
            let data = await getAllUsers(id);
            let user = data.users;
            this.setState({
                maTk: user.id,
                email: user.email,
                firstName: user.ten,
                lastName: user.ho,
                phoneNumber: user.soDienThoai,
                address: user.diaChi,
                gender: user.gioiTinh,
                previewImgURL: user.hinhAnh,
                birthday: user.ngaySinh,
            })
        }
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

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrChecks = ['email', 'firstName', 'lastName', 'phoneNumber',
            'address'];
        for (let i = 0; i < arrChecks.length; i++) {
            if (!this.state[arrChecks[i]]) {
                isValid = false;
                alert('This input is required: ' + arrChecks[i])
                break;
            }
        }
        if (!/^[0-9]{10,11}$/.test(this.state.phoneNumber)) {
            isValid = false;
            alert('Please enter a valid phone number.');
            return isValid;
        }
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.state.email)) {
            isValid = false;
            alert('Please enter a valid email.');
            return isValid;
        }
        return isValid;


    }

    handleUpdateUser = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let formattedDate = this.state.birthday;
        if (isNaN(parseInt(formattedDate))) {
            formattedDate = new Date(this.state.birthday).getTime();
        }
        else {
            formattedDate = this.state.birthday;
        }

        let res = await editUserService({
            id: this.state.maTk,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            gender: this.state.gender,
            birthday: formattedDate,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            avatar: this.state.avatar,
        })
        if (res && res.errCode === 0) {
            toast.success("Update profile succeed!");
            this.handleLoadUser();
        }
        else {
            toast.error("Update infor detail doctor error!");
        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        const timestamp = parseInt(this.state.birthday);
        const dateObj = new Date(timestamp);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // Lưu ý: getMonth() trả về giá trị từ 0 đến 11
        const day = dateObj.getDate();
        const formattedDate = `${day}/${month}/${year}`;

        let { email, firstName, lastName, phoneNumber,
            address, gender } = this.state;

        return (
            <div className="doctor-redux-container">
                <div className="title" >
                    <FormattedMessage id="menu.doctor.update-profile" />
                </div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 form-group">
                                {isGetGenders === true ? 'Loading genders' : ''}
                            </div>


                            <div className="col-12 form-group">
                                <div className="row">
                                    <div className="col-9 form-group">
                                        <div className="row">
                                            <div className="col-4 form-group">
                                                <label><FormattedMessage id="patient.family.email" /></label>
                                                <input type="email"
                                                    className="form-control"
                                                    value={email}
                                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                                    pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-4 form-group">
                                                <label><FormattedMessage id="patient.family.lastname" /></label>
                                                <input type="text"
                                                    value={lastName}
                                                    className="form-control"
                                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                                            </div>
                                            <div className="col-4 form-group">
                                                <label><FormattedMessage id="patient.family.firstname" /></label>
                                                <input type="text"
                                                    value={firstName}
                                                    className="form-control"
                                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                                            </div>
                                            <div className="col-4 form-group">
                                                <label><FormattedMessage id="patient.family.gender" /></label>
                                                <select id="inputState"
                                                    onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                                    className="form-control"
                                                    value={gender}
                                                >
                                                    {genders && genders.length > 0 &&
                                                        genders.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.keyMap}>
                                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-4 form-group">
                                                <label><FormattedMessage id="patient.family.birthday" /></label>
                                                <DatePicker
                                                    onChange={this.handleOnChangeDatePicker}
                                                    className="form-control"
                                                    value={formattedDate}
                                                    maxDate={yesterday}
                                                />
                                            </div>
                                            <div className="col-4 form-group">
                                                <label><FormattedMessage id="patient.family.phonenumber" /></label>
                                                <input type="tel"
                                                    className="form-control"
                                                    value={phoneNumber}
                                                    onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                                    pattern="[0-9]{10,11}"
                                                    required />
                                            </div>
                                            <div className="col-12 form-group">
                                                <label><FormattedMessage id="patient.family.address" /></label>
                                                <input type="text"
                                                    className="form-control"
                                                    value={address}
                                                    onChange={(event) => { this.onChangeInput(event, 'address') }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3 form-group">
                                        <div className="row">
                                            <div className="col-12">
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
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 my-3 button-create-family">
                                <button style={{ color: '#fff' }} className="btn btn-primary"
                                    onClick={() => this.handleUpdateUser()}
                                >
                                    <FormattedMessage id="admin.manage-doctor.update" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div >
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        familyPositionRedux: state.admin.familyPositions,
        isLoadingGender: state.admin.isLoadingGender,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
