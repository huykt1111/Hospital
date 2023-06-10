import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import './CommentModal.scss';


class StarRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: props.defaultValue || 0,
        };
    }

    handleRatingChange = (newRating) => {
        this.setState({
            rating: newRating,
        });
        if (this.props.onChange) {
            this.props.onChange(newRating);
        }
    };

    render() {
        const { rating } = this.state;

        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                        key={value}
                        value={value}
                        filled={value <= rating}
                        onClick={this.handleRatingChange}
                    />
                ))}
            </div>
        );
    }
}

class Star extends Component {
    handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.value);
        }
    };

    render() {
        const { filled } = this.props;

        return (
            <span
                className={`star ${filled ? 'filled' : ''}`}
                onClick={this.handleClick}
            >
                ★
            </span>
        );
    }
}

class CommentModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctor: [],
            rating: 5,
            comment: ''
        }
    }

    componentDidMount() {

    }

    handleRatingChange = (rating) => {
        this.setState({
            rating: rating
        })
    };

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleComment = () => {
        this.props.handleComment({
            start: this.state.rating,
            comment: this.state.comment,
            id: this.props.bookSchedule.id
        });
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    render() {
        let { language } = this.props;
        let doctor = this.props.bookSchedule;
        const timestamp = parseInt(doctor.schedulePatientData.ngayKham);
        const dateObj = new Date(timestamp);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const formattedDate = `${day}/${month}/${year}`;
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-comment-container'}
                size="lg"
            >
                <ModalHeader toggle={() => { this.toggle() }}>Đánh giá</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="register-doctor-detail-container" style={{ height: '350px' }}>
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
                                        <div>Người khám: <span style={{ color: 'blue' }}>{doctor.hoTen}</span></div>
                                        <div>Thời gian khám: <span style={{ color: 'red' }}>{doctor.schedulePatientData.timeTypeData.valueVi} - {formattedDate}</span></div>
                                        <div>Lý do khám: <span style={{ color: 'blue' }}>{doctor.lyDoKham}</span></div>
                                        <div>Đơn thuốc: <span style={{ color: 'blue' }}>{doctor.keDonThuoc}</span></div>
                                    </div>
                                    <div>
                                        <StarRating defaultValue={3} onChange={this.handleRatingChange} />
                                    </div>
                                    <div className='col-12 form-group login-input'>
                                        <label>Nội dung đánh giá:</label>
                                        <input type="text"
                                            className="form-control"
                                            value={this.state.comment}
                                            placeholder='Comment'
                                            onChange={(event) => { this.onChangeInput(event, 'comment') }} />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        className="px-3"
                        onClick={() => { this.handleComment() }}
                    >
                        Đánh giá
                    </Button>
                    <Button color="secondary" className="px-3" onClick={() => { this.toggle() }}>Thoát</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal);




