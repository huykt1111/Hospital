import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { CommonUtils } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { getDetailInforDoctor } from '../../../services/userService';
import html2pdf from 'html2pdf.js';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            previewImgURL: '',
            donThuoc: '',
            ngayTaiKham: '',
            dataDoctor: [],
        }
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
            this.getDoctorDetail();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
            this.getDoctorDetail();
        }
    }

    getDoctorDetail = async () => {
        let res = await getDetailInforDoctor(this.props.dataModal.doctorId);
        if (res && res.errCode == 0) {
            this.setState({
                dataDoctor: res.data,
            })
        }
    }

    handleDownload = () => {
        const element = document.getElementById('pdf-content');
        const opt = {
            filename: 'ute-hospital.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            ngayTaiKham: date[0]
        })
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
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
                imgBase64: base64
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

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {


        let { isOpenModal, closeRemedyModal, dataModal } = this.props;
        console.log(dataModal)

        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        const timestamp = parseInt(dataModal.date);
        const dateObj = new Date(timestamp);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1; // Lưu ý: getMonth() trả về giá trị từ 0 đến 11
        const day = dateObj.getDate();
        const formattedDate = `${day}/${month}/${year}`;
        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="lg"
                centered
            >
                <div className="modal-header"><h5 className="modal-title">
                    <FormattedMessage id="patient.booking-modal.send-medical" />
                </h5>
                    <button type="button" className="close" aria-label="Close" onClick={closeRemedyModal}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">

                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="patient.booking-modal.email-patient" />
                            </label>
                            <input className='form-control'
                                type="email"
                                onChange={(event) => this.handleOnChangeEmail(event)}
                                value={this.state.email} />

                        </div>
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="patient.booking-modal.prescription" />
                            </label>
                            <input className='form-control'
                                type="email"
                                onChange={(event) => { this.onChangeInput(event, 'donThuoc') }}
                                value={this.state.donThuoc} />

                        </div>
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="patient.booking-modal.re-examination-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.ngayTaiKham}
                                minDate={yesterday}
                            />
                        </div>
                        {/* <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="patient.booking-modal.select-prescription" />
                            </label>
                            <input type="file" className='form-control-file' onChange={(event) => this.handleOnChangImage(event)} />
                        </div> */}
                        <div className="col-6 form-group">
                            <div className="row">
                                <div className="col-12">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.select-prescription" />
                                    </label>
                                    <div className="preview-img-container">
                                        <input id="previewImg" type="file" hidden
                                            onChange={(event) => this.handleOnChangImage(event)}
                                        />
                                        <label htmlFor="previewImg"
                                            className="label-upload">
                                            <FormattedMessage id="patient.family.upload" />
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
                        <div className="col-12 form-group pdf-container">
                            <div>Tải đơn thuốc của bệnh nhân tại đây</div>
                            <button onClick={this.handleDownload}>Tải xuống tệp PDF</button>
                            <div style={{ display: 'none' }}>
                                <div id="pdf-content" style={{ textAlign: "center", margin: "20px" }}>
                                    <h2 style={{ color: 'red', fontSize: "24px" }}>ĐƠN THUỐC KHÁM BỆNH</h2>
                                    <div className="pdf-content-name-patient"
                                        style={{ marginTop: "10px", fontSize: "18px", textAlign: "left" }}>
                                        Tên bệnh nhân: {this.props.dataModal.patientName}
                                    </div>
                                    {this.state.dataDoctor && this.state.dataDoctor.TaiKhoan &&
                                        <div className="pdf-content-name-patient"
                                            style={{ marginTop: "10px", fontSize: "18px", textAlign: "left" }}>
                                            Bác sĩ khám: {this.state.dataDoctor.TaiKhoan.ho + " " + this.state.dataDoctor.TaiKhoan.ten}
                                        </div>
                                    }
                                    <div className="pdf-content-prescription"
                                        style={{ marginTop: "10px", fontSize: "18px", textAlign: "left" }}>
                                        Ngày khám: {formattedDate}
                                    </div>
                                    <div className="pdf-content-prescription"
                                        style={{ marginTop: "10px", fontSize: "18px", textAlign: "left" }}>
                                        Đơn thuốc: {this.state.donThuoc}
                                    </div>
                                    <div style={{ marginTop: "20px", fontSize: "18px", color: "blue" }}>Hình ảnh đơn thuốc</div>
                                    <div className="preview-image-pdf"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgURL})`,
                                            height: '600px',
                                            width: '100%',
                                            background: 'no-repeat center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={() => this.openPreviewImage()}

                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSendRemedy()}><FormattedMessage id="patient.booking-modal.send" /></Button>{' '}
                    <Button color="secondary" onClick={closeRemedyModal}><FormattedMessage id="patient.booking-modal.exit" /></Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
