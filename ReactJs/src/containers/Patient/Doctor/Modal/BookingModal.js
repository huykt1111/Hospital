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
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from "moment";
import vi from "moment/locale/vi";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            genders: '',
            doctorId: '',
            selectedGender: '',
            timeType: '',
            language: this.props.language,
            isShowLoading: false,
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
    }

    buildDataGenders(data) {
        let result = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }

        return result;
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {
            this.setState({
                genders: this.buildDataGenders(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGenders(this.props.genders)
            })
        }
        if (this.props.dataTime != prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }

    }

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

    handleChangeGender = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
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
            doctorId: this.state.doctorId,
            selectedGender: this.state.selectedGender.value,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
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
                moment.unix(+dataTime.date / 1000).locale("vi", vi).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale("en").format('ddd - MM/DD/YYYY')

            return `${time} - ${date}`

        }
        return ''

    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`


            return name;

        }
        return ''
    }

    render() {


        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
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
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.gender" />
                                    </label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeGender}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
