import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import { getScheduleDoctorByDate } from '../../../services/userService'
import './DoctorSchedule.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            time: new Date()
        }
        this.timerID = null;
        this.tick = this.tick.bind(this);
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getAllDays(language);
        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }

        if (allDays && allDays.length > 0) {
            this.setState({
                allDays: allDays,
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({ time: new Date() });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getAllDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM')
                    object.label = this.capitalizeFirstLetter(labelVi);
                }
            }
            else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();

            allDays.push(object);
        }


        return allDays;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {
            let allDays = this.getAllDays(this.props.language);
            this.setState({ allDays: allDays });
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getAllDays(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent != -1) {
            let id = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(id, date);

            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                })
            }
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal, time } = this.state;
        let { language } = this.props;
        let timeen = this.state.time.toLocaleTimeString();
        let timevi = new Date("2000-01-01 " + timeen);
        let currentTime = timevi.getHours();
        let numberTime = 0;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedules">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length > 0 && allDays.map((item, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fa fa-calendar-alt">
                                <span>
                                    <FormattedMessage id="patient.detail-doctor.schedule" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length > 0 ?
                                <React.Fragment>
                                    <div className="time-content-btn">
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGES.VI ?
                                                item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                            let timestamp = parseInt(item.ngayKham); // Giá trị thời gian từ chuỗi
                                            let bookingDate = new Date(timestamp); // Tạo đối tượng Date từ giá trị thời gian
                                            let currentDate = new Date();
                                            if (bookingDate.getFullYear() === currentDate.getFullYear() &&
                                                bookingDate.getMonth() === currentDate.getMonth() &&
                                                bookingDate.getDate() === currentDate.getDate()) {

                                                if (item.thoiGianKham === "T1" && currentTime < 9) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T2" && currentTime < 10) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T3" && currentTime < 11) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T4" && currentTime < 13) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T5" && currentTime < 14) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T6" && currentTime < 15) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T7" && currentTime < 16) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                                if (item.thoiGianKham === "T8" && currentTime < 17) {
                                                    numberTime = 1;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                }
                                            }
                                            else {
                                                numberTime = 1;
                                                return (
                                                    <button
                                                        key={index}
                                                        className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                        onClick={() => this.handleClickScheduleTime(item)}
                                                    >
                                                        {timeDisplay}
                                                    </button>
                                                )
                                            }
                                        })}
                                    </div>
                                    {numberTime !== 0 ?
                                        <div className="book-free">
                                            <span>
                                                <FormattedMessage id="patient.detail-doctor.choose" />
                                                <i className='far fa-hand-point-up'></i>
                                                <FormattedMessage id="patient.detail-doctor.book-free" />
                                            </span>
                                        </div>
                                        :
                                        <div className="no-schedule"><FormattedMessage id="patient.detail-doctor.no-schedule" /></div>
                                    }
                                </React.Fragment>
                                :

                                <div className="no-schedule"><FormattedMessage id="patient.detail-doctor.no-schedule" /></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime={dataScheduleTimeModal}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
