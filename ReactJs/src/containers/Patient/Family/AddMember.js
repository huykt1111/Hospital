import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import { createNewMember, getMemberByUser, updateMemberData } from '../../../services/userService';
import * as actions from '../../../store/actions';
import './AddMember.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import DatePicker from '../../../components/Input/DatePicker';

class AddMember extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // dataMember: [],
            genderArr: [],
            positionArr: [],
            previewImgURL: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            avatar: '',
            birthday: '',
            currentDate: '',
            action: '',
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getFamilyPositionStart();
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let data = await getMemberByUser({ id });
            let member = data.data;
            const timestamp = parseInt(member.ngaySinh);
            const dateObj = new Date(timestamp);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // Lưu ý: getMonth() trả về giá trị từ 0 đến 11
            const day = dateObj.getDate();
            const formattedDate = `${day}/${month}/${year}`;
            this.setState({
                action: CRUD_ACTIONS.EDIT,
                email: member.email,
                firstName: member.ten,
                lastName: member.ho,
                phoneNumber: member.soDienThoai,
                address: member.diaChi,
                gender: member.gioiTinh,
                position: member.vaiTro,
                previewImgURL: member.hinhAnh,
                birthday: formattedDate,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (prevProps.familyPositionRedux !== this.props.familyPositionRedux) {
            let arrPositions = this.props.familyPositionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
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

    handleCreateNewMember = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        const { userInfo } = this.props;
        let idUser = userInfo.user.id;
        if (this.state.action === CRUD_ACTIONS.CREATE) {
            let formattedDate = new Date(this.state.birthday).getTime();
            let res = await createNewMember({
                id: idUser,
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                gender: this.state.gender,
                birthday: formattedDate,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                positionId: this.state.position,
                avatar: this.state.avatar,
            })
            if (res.errCode === 0) {
                alert('Successfully added members.');
                if (this.props.history) {
                    this.props.history.push(`/family-profile/${idUser}`);
                }
            }
            else {
                alert('Add member failed.');
            }
        }
        else {
            console.log(this.state);
            let formattedDate = this.state.birthday;
            console.log(formattedDate);
            if (isNaN(parseInt(formattedDate))) {
                formattedDate = new Date(this.state.birthday).getTime();
                console.log(formattedDate);

            }
            else {
                formattedDate = "";
                console.log(formattedDate);
            }
            if (this.state.action === CRUD_ACTIONS.EDIT) {
                let res = await updateMemberData({
                    id: this.props.match.params.id,
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    gender: this.state.gender,
                    birthday: formattedDate,
                    address: this.state.address,
                    phoneNumber: this.state.phoneNumber,
                    positionId: this.state.position,
                    avatar: this.state.avatar,
                })
                console.log(res)
                if (res.errCode === 0) {
                    alert('Member update successful.');
                    if (this.props.history) {
                        this.props.history.push(`/family-profile/${idUser}`);
                    }
                }
                else {
                    alert('Update member failed.');
                }
            }
        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }



    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

        let { email, firstName, lastName, phoneNumber,
            address, gender, position, action } = this.state;

        return (
            <div className="user-redux-container">
                <div className="title" >
                    Add New Member
                </div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 form-group">
                                {isGetGenders === true ? 'Loading genders' : ''}
                            </div>
                            <div className="col-3 form-group">
                                <label><FormattedMessage id="patient.family.position" /></label>
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
                            <div className="col-3 form-group">
                                <label><FormattedMessage id="patient.family.email" /></label>
                                <input type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                                />
                            </div>
                            <div className="col-3 form-group">
                                <label><FormattedMessage id="patient.family.lastname" /></label>
                                <input type="text"
                                    value={lastName}
                                    className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                            </div>
                            <div className="col-3 form-group">
                                <label><FormattedMessage id="patient.family.firstname" /></label>
                                <input type="text"
                                    value={firstName}
                                    className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                            </div>

                            <div className="col-12 form-group">
                                <div className="row">
                                    <div className="col-9 form-group">
                                        <div className="row">
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
                                                    value={this.state.birthday}
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
                                <button style={{ color: '#fff' }} className={action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                    onClick={() => this.handleCreateNewMember()}
                                >
                                    {action === CRUD_ACTIONS.EDIT ?
                                        <FormattedMessage id="patient.family.edit" /> :
                                        <FormattedMessage id="patient.family.create" />
                                    }
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
        getFamilyPositionStart: () => dispatch(actions.fetchPositionFamilyStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMember);
