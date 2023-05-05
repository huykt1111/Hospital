import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LANGUAGES } from '../../../../utils';
import _ from 'lodash';
import './ModalDoctor.scss';

class ModalDoctor extends Component {

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

    handleRatify = () => {
        this.props.handleRatify(this.props.doctor.maTk);
    }

    render() {
        let { language } = this.props;
        let doctor = this.props.doctor;
        const USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const VND = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        let price = language === LANGUAGES.VI
            && doctor && doctor.priceIdData && doctor.priceIdData.valueVi ? VND.format(doctor.priceIdData.valueVi) : USDollar.format(doctor.priceIdData.valueEn);

        let province = language === LANGUAGES.VI
            && doctor && doctor.provinceIdData && doctor.provinceIdData.valueVi ? doctor.provinceIdData.valueVi : doctor.provinceIdData.valueEn;
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size="lg"
            >
                <ModalHeader toggle={() => { this.toggle() }}>Chi tiết thông tin bác sĩ đăng ký</ModalHeader>
                <ModalBody>
                    <div className="register-doctor-detail-container">
                        <div className="intro-doctor">
                            <div className='content-left'>
                                <div className='content-left-image'
                                    style={{ backgroundImage: `url(${doctor && doctor.TaiKhoan.hinhAnh ? doctor.TaiKhoan.hinhAnh : ''})` }}
                                />
                            </div>
                            <div className="content-right">
                                <div className="up">
                                    {doctor && doctor.TaiKhoan && doctor.TaiKhoan.ho + " " + doctor.TaiKhoan.ten}
                                </div>
                                <div className="down">
                                    {doctor && doctor.mieuTa &&
                                        <span>{doctor.mieuTa}</span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="detail-doctor">
                            {doctor && doctor.noiDungHTML &&
                                <div dangerouslySetInnerHTML={{ __html: doctor.noiDungHTML }}>

                                </div>
                            }
                            <div><b>Khu vực làm việc: </b>{province}</div>
                            <br />
                            <div><b>Phòng khám: </b>{doctor && doctor.userClinicData && doctor.userClinicData.tenPhongKham ? doctor.userClinicData.tenPhongKham : ''}</div>
                            <br />
                            <div><b>Tên phòng khám: </b>{doctor && doctor.tenPhongKham ? doctor.tenPhongKham : ''}</div>
                            <br />
                            <div><b>Địa chỉ phòng khám: </b>{doctor && doctor.diaChiPhongKham ? doctor.diaChiPhongKham : ''}</div>
                            <br />
                            <div><b>Giá khám: </b>{price}</div>
                            <br />
                            <div><b>Phương thức thanh toán: </b>{doctor && doctor.paymentIdData ? doctor.paymentIdData.valueVi : ''}</div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        className="px-3"
                        onClick={() => { this.handleRatify() }}
                    >
                        Ratify
                    </Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalDoctor);




