import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { LANGUAGES } from '../../../../utils';
import { Modal } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import _ from 'lodash';
import * as actions from '../../../../store/actions';
import Select from 'react-select';
import { postPatientBookAppointment, getAllUsers, getAllMember, getMemberByUser } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from "moment";
import vi from "moment/locale/vi";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            dataMember: [],
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            gender: '',
            doctorId: '',
            timeType: '',
            position: '',
            language: this.props.language,
            isShowLoading: false,
            isPersonal: true,
            isUser: true
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        if (this.props.userInfo && this.props.userInfo.user && this.props.userInfo.user.id) {
            let res = await getAllUsers(this.props.userInfo.user.id);
            const timestamp = parseInt(res.users.ngaySinh);
            const dateObj = new Date(timestamp);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // Lưu ý: getMonth() trả về giá trị từ 0 đến 11
            const day = dateObj.getDate();
            const formattedDate = `${day}/${month}/${year}`;
            this.setState({
                fullName: res.users.ho + ' ' + res.users.ten,
                phoneNumber: res.users.soDienThoai,
                email: res.users.email,
                address: res.users.diaChi,
                birthday: formattedDate,
                gender: res.users.gioiTinh,
                isPersonal: true
            })
            let data = await getAllMember({ id: this.props.userInfo.user.id });
            this.setState({
                dataMember: data.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (this.props.dataTime != prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.maTk;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }

        if (this.state.isPersonal !== prevState.isPersonal) {
            if (this.state.isPersonal) {
                if (
                    this.props.userInfo &&
                    this.props.userInfo.user &&
                    this.props.userInfo.user.id
                ) {
                    const res = await getAllUsers(this.props.userInfo.user.id);
                    const timestamp = parseInt(res.users.ngaySinh);
                    const dateObj = new Date(timestamp);
                    const year = dateObj.getFullYear();
                    const month = dateObj.getMonth() + 1;
                    const day = dateObj.getDate();
                    const formattedDate = `${day}/${month}/${year}`;
                    this.setState({
                        fullName: res.users.ho + ' ' + res.users.ten,
                        phoneNumber: res.users.soDienThoai,
                        email: res.users.email,
                        address: res.users.diaChi,
                        birthday: formattedDate,
                        gender: res.users.gioiTinh,
                        isUser: true,
                    });
                    let data = await getAllMember({ id: this.props.userInfo.user.id });
                    this.setState({
                        dataMember: data.data
                    })
                }

            }
            if (!this.state.isPersonal) {
                this.setState({
                    fullName: '',
                    phoneNumber: '',
                    email: '',
                    address: '',
                    birthday: '',
                    gender: '',
                });
            }
        }
    }


    handleRadioChange = (event) => {
        this.setState({
            isPersonal: event.target.value === 'personal',
        });
    };

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = valueInput;
        this.setState({
            ...copyState
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleInputFamily = async (id) => {
        if (id) {
            this.setState({
                isSelectFamily: true
            })
            let data = await getMemberByUser({ id });
            let member = data.data;
            const timestamp = parseInt(member.ngaySinh);
            const dateObj = new Date(timestamp);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            const formattedDate = `${day}/${month}/${year}`;
            this.setState({
                fullName: member.ho + ' ' + member.ten,
                phoneNumber: member.soDienThoai,
                email: member.email,
                address: member.diaChi,
                birthday: formattedDate,
                gender: member.gioiTinh,
            })
        }

    }

    handleConfirmBooking = async () => {
        // validate input
        this.setState({
            isShowLoading: true
        })
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            doctorId: this.props.dataTime.maTk,
            selectedGender: this.state.gender,
            timeType: this.props.dataTime.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName,
            idSchedule: this.props.dataTime.id,
            idUser: this.props.userInfo.user.id
        })

        this.setState({
            isShowLoading: false
        })

        if (res && res.errCode === 0) {
            toast.success('Booking a new appointment succeed!')
            this.props.closeBookingModal()
        } else {
            toast.error('Booking a new appointment error!')
        }
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.ngayKham / 1000).locale("vi", vi).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.ngayKham / 1000).locale("en").format('ddd - MM/DD/YYYY')

            return `${time} - ${date}`

        }
        return ''

    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.ho} ${dataTime.doctorData.ten}`
                :
                `${dataTime.doctorData.ten} ${dataTime.doctorData.ho}`


            return name;

        }
        return ''
    }

    render() {

        let language = this.props.language;
        let genders = this.state.genderArr;
        let { isOpenModal, closeBookingModal, dataTime, userInfo } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.maTk;
        }
        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            >
                <Modal
                    isOpen={isOpenModal}
                    className={'booking-modal-container'}
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className='left'>
                                <FormattedMessage id="patient.booking-modal.title" />
                            </span>
                            <span className='right' onClick={closeBookingModal}>
                                <i className="fa fa-times"></i>
                            </span>
                        </div>
                        <div className="booking-modal-body">
                            {/* {JSON.stringify(dataTime)} */}
                            <div className="doctor-infor">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetails={false}
                                    isShowPrice={true}
                                />
                            </div>
                            {userInfo && userInfo.user && userInfo.user.id ?
                                <div className="row" style={{ padding: '20px' }}>
                                    <div>
                                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                            <div>
                                                <input type="radio" id="personal" name="bookingType" value="personal" checked={this.state.isPersonal} onChange={this.handleRadioChange} />
                                                <label htmlFor="personal">Đặt cho cá nhân</label>
                                            </div>
                                            <div>
                                                <input type="radio" id="family" name="bookingType" value="family" checked={!this.state.isPersonal} onChange={this.handleRadioChange} />
                                                <label htmlFor="family">Đặt cho gia đình</label>
                                            </div>
                                        </div>
                                        {this.state.isPersonal ?

                                            <div className="row">
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.name" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.fullName}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.phone-number" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.phoneNumber}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.email" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.email}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.address" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.address}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                                    />
                                                </div>

                                                <div className="col-12 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.reason" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.reason}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.birthday" />
                                                    </label>
                                                    <DatePicker
                                                        onChange={this.handleOnChangeDatePicker}
                                                        className="form-control"
                                                        selected={this.state.birthday}
                                                        value={this.state.birthday}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                                    <select id="inputState"
                                                        onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                                        className="form-control"
                                                        value={this.state.gender}
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
                                            </div>

                                            :

                                            <div className="row">
                                                <div className="col-12 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.name" />
                                                    </label>
                                                    <div className="col-3 form-group">
                                                        <select
                                                            style={{ marginLeft: "-14px" }}
                                                            className='form-control'
                                                            onChange={(event) =>
                                                                this.handleInputFamily(event.target.value)}
                                                        >
                                                            {this.state.dataMember.map((member, index) => (
                                                                <option key={index} value={member.id}>
                                                                    {language === LANGUAGES.VI ? member.famRoleData.valueVi : member.famRoleData.valueEn}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.name" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.fullName}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.phone-number" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.phoneNumber}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.email" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.email}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.address" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.address}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                                    />
                                                </div>

                                                <div className="col-12 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.reason" />
                                                    </label>
                                                    <input className='form-control'
                                                        value={this.state.reason}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label>
                                                        <FormattedMessage id="patient.booking-modal.birthday" />
                                                    </label>
                                                    <DatePicker
                                                        onChange={this.handleOnChangeDatePicker}
                                                        className="form-control"
                                                        selected={this.state.birthday}
                                                        value={this.state.birthday}
                                                    />
                                                </div>
                                                <div className="col-6 form-group">
                                                    <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                                    <select id="inputState"
                                                        onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                                        className="form-control"
                                                        value={this.state.gender}
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
                                            </div>

                                        }
                                    </div>

                                </div>
                                :
                                <div>Vui lòng đăng nhập</div>
                            }
                        </div>
                        <div className='booking-modal-footer'>
                            <button className="btn-booking-confirm"
                                onClick={() => this.handleConfirmBooking()}

                            >
                                <FormattedMessage id="patient.booking-modal.btn-confirm" />
                            </button>
                            <button className="btn-booking-cancel"
                                onClick={closeBookingModal}
                            >
                                <FormattedMessage id="patient.booking-modal.exit" />
                            </button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        userInfo: state.user.userInfo,
        genderRedux: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
