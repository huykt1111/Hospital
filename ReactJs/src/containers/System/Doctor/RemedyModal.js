import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { CommonUtils } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            donThuoc: '',
            ngayTaiKham: '',
        }
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

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
            this.setState({
                imgBase64: base64
            })
        }
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


        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
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
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="patient.booking-modal.select-prescription" />
                            </label>
                            <input type="file" className='form-control-file' onChange={(event) => this.handleOnChangImage(event)} />
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
