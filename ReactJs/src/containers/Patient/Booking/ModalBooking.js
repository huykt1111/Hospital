import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import './ModalBooking.scss';

class ModalBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctor: []
        }
    }

    componentDidMount() {

    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleCancel = () => {
        this.props.handleCancel(this.props.bookSchedule.id);
    }

    render() {
        let { language } = this.props;
        let doctor = this.props.bookSchedule;
        const USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const VND = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        const timestamp = parseInt(doctor.schedulePatientData.ngayKham);
        const dateObj = new Date(timestamp);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const formattedDate = `${day}/${month}/${year}`;
        let price = language === LANGUAGES.VI
            && doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK
            && doctor.schedulePatientData.dataDoctorLK.priceIdData && doctor.schedulePatientData.dataDoctorLK.priceIdData.valueVi
            ? VND.format(doctor.schedulePatientData.dataDoctorLK.priceIdData.valueVi) : USDollar.format(doctor.schedulePatientData.dataDoctorLK.priceIdData.valueEn);

        let province = language === LANGUAGES.VI
            && doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK
            && doctor.schedulePatientData.dataDoctorLK.provinceIdData
            && doctor.schedulePatientData.dataDoctorLK.provinceIdData.valueVi
            ? doctor.schedulePatientData.dataDoctorLK.provinceIdData.valueVi : doctor.schedulePatientData.dataDoctorLK.provinceIdData.valueEn;
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size="lg"
            >
                <ModalHeader toggle={() => { this.toggle() }}>Detail Book</ModalHeader>
                <ModalBody>
                    <div className="register-doctor-detail-container">
                        <div className="intro-doctor">
                            <div className='content-left'>
                                <div className='content-left-image'
                                    style={{
                                        backgroundImage: `url(${doctor && doctor.schedulePatientData && doctor.schedulePatientData.doctorData
                                            && doctor.schedulePatientData.doctorData.hinhAnh ? doctor.schedulePatientData.doctorData.hinhAnh : ''})`
                                    }}
                                />
                            </div>
                            <div className="content-right">
                                <div className="up">
                                    {doctor && doctor.schedulePatientData && doctor.schedulePatientData.doctorData &&
                                        doctor.schedulePatientData.doctorData.ho + " " + doctor.schedulePatientData.doctorData.ten}
                                </div>
                                <div className="down">
                                    {doctor && doctor.schedulePatientData.dataDoctorLK && doctor.schedulePatientData.dataDoctorLK &&
                                        doctor.schedulePatientData.dataDoctorLK.mieuTa &&
                                        <span>{doctor.schedulePatientData.dataDoctorLK.mieuTa}</span>
                                    }
                                    <div style={{ color: 'blue', marginTop: '10px' }}>CHI TIẾT HÓA ĐƠN ĐẶT</div>
                                    <div>Người đặt: <span style={{ color: 'blue' }}>{doctor.patientData.ho + ' ' + doctor.patientData.ten} </span></div>
                                    <div>Người khám: <span style={{ color: 'blue' }}>{doctor.hoTen}</span></div>
                                    <div>Thời gian khám: <span style={{ color: 'red' }}>{doctor.schedulePatientData.timeTypeData.valueVi} - {formattedDate}</span></div>
                                    <div>Lý do khám: <span style={{ color: 'blue' }}>{doctor.lyDoKham}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="detail-doctor">
                            {doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK &&
                                <div dangerouslySetInnerHTML={{ __html: doctor.schedulePatientData.dataDoctorLK.noiDungHTML }}>

                                </div>
                            }
                            <div><b>Khu vực làm việc: </b>{province}</div>
                            <br />
                            <div><b>Phòng khám: </b>{
                                doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK
                                    && doctor.schedulePatientData.dataDoctorLK.userClinicData ? doctor.schedulePatientData.dataDoctorLK.userClinicData.tenPhongKham : ''
                            }</div>
                            <br />
                            <div><b>Tên phòng khám: </b>{
                                doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK
                                    && doctor.schedulePatientData.dataDoctorLK ? doctor.schedulePatientData.dataDoctorLK.tenPhongKham : ''}</div>
                            <br />
                            <div><b>Địa chỉ phòng khám: </b>{
                                doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK
                                    && doctor.schedulePatientData.dataDoctorLK ? doctor.schedulePatientData.dataDoctorLK.diaChiPhongKham : ''}</div>
                            <br />
                            <div><b>Giá khám: </b>{price}</div>
                            <br />
                            <div><b>Phương thức thanh toán: </b>{
                                doctor && doctor.schedulePatientData && doctor.schedulePatientData.dataDoctorLK
                                    && doctor.schedulePatientData.dataDoctorLK.paymentIdData
                                    && doctor.schedulePatientData.dataDoctorLK.paymentIdData.valueVi
                                    ? doctor.schedulePatientData.dataDoctorLK.paymentIdData.valueVi : doctor.schedulePatientData.dataDoctorLK.paymentIdData.valueEn
                            }</div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {this.props.handleCancel &&
                        <Button color="primary"
                            className="px-3"
                            onClick={() => { this.handleCancel() }}
                        >
                            Cancel booking
                        </Button>
                    }
                    <Button color="secondary" className="px-3" onClick={() => { this.toggle() }}>Close</Button>
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalBooking);




