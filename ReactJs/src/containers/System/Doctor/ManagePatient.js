import React, { Component } from 'react';
import { connect } from "react-redux";
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService'
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import RemedyModal from './RemedyModal';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {

        this.getDataPatient()
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.user.id,
            date: formatedDate,
        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnConfirm = (item) => {
        console.log(item)
        let data = {
            doctorId: item.maBS,
            patientId: item.maND,
            email: item.email,
            timeType: item.schedulePatientData.thoiGianKham,
            date: item.schedulePatientData.ngayKham,
            patientName: item.hoTen,
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let formattedDate = new Date(dataChild.ngayTaiKham).getTime();
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            date: dataModal.date,
            language: this.props.language,
            patientName: dataModal.patientName,
            donThuoc: dataChild.donThuoc,
            ngayTaiKham: formattedDate

        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success("Send remedy succeed!");
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            toast.error("Something wrongs...");
        }
    }


    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isShowLoading } = this.state;
        let { language } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className="manage-patient-container" >
                        <div className="title">
                            <FormattedMessage id='manage-patient.title' />
                        </div>
                        <div className="manage-patient-body row">
                            <div className="col-4 form-group">
                                <label><FormattedMessage id="patient.booking-modal.choose-date" /></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className="col-12 table-manage-patient">
                                <table style={{ width: '100%' }} id='customers'>
                                    <tbody>
                                        <tr>
                                            <th><FormattedMessage id="patient.booking-modal.id" /></th>
                                            <th><FormattedMessage id="patient.booking-modal.examination-time" /></th>
                                            <th><FormattedMessage id="patient.booking-modal.name" /></th>
                                            <th><FormattedMessage id="patient.booking-modal.gender" /></th>
                                            <th><FormattedMessage id="patient.booking-modal.birthday" /></th>
                                            <th><FormattedMessage id="patient.booking-modal.reason" /></th>
                                            <th><FormattedMessage id="admin.manage-account.action" /></th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((item, index) => {
                                                let time = language === LANGUAGES.VI
                                                    ? item.schedulePatientData.timeTypeData.valueVi : item.schedulePatientData.timeTypeData.valueEn;
                                                let gender = language === LANGUAGES.VI
                                                    ? item.genderDataDLK.valueVi : item.genderDataDLK.valueEn;
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.hoTen}</td>
                                                        <td>{gender}</td>
                                                        <td>{item.diaChi}</td>
                                                        <td>{item.lyDoKham}</td>
                                                        <td>
                                                            <button
                                                                className="mp-btn-confirm"
                                                                onClick={() => this.handleBtnConfirm(item)}
                                                            >
                                                                <FormattedMessage id="patient.booking-modal.confirm" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center' }}><FormattedMessage id="patient.booking-modal.no-data" /></td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />

                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
