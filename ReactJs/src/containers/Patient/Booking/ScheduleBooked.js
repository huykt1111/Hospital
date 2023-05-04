import React, { Component } from 'react';
import { connect } from "react-redux";
import { getAllBookByUser, racingBook } from '../../../services/userService'
import './ScheduleBook.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import ModalBooking from './ModalBooking';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import CommentModal from './CommentModal';
import { toast } from "react-toastify";

class ScheduleBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataBook: [],
            isOpenModalDoctor: false,
            isOpenModalComment: false,
            bookSchedule: []
        }
    }

    async componentDidMount() {
        await this.getAllBookFromReact()
    }

    getAllBookFromReact = async () => {
        const { userInfo } = this.props;
        let id = userInfo.user.id;
        let data = await getAllBookByUser({ id });
        this.setState({
            dataBook: data.data
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalDoctor: !this.state.isOpenModalDoctor,
        })
    }

    toggleCommentModal = () => {
        this.setState({
            isOpenModalComment: !this.state.isOpenModalComment,
        })
    }

    handleViewDoctor = (item) => {
        this.setState({
            isOpenModalDoctor: true,
            bookSchedule: item
        })
    }

    handleViewCommnent = (item) => {
        this.setState({
            isOpenModalComment: true,
            bookSchedule: item
        })
    }

    handleComment = async (Comment) => {
        console.log(Comment)
        let res = await racingBook(Comment);
        if (res && res.errCode === 0) {
            this.setState({
                isOpenModalComment: false
            })

            toast.success("Đánh giá thành công!")

            this.getAllBookFromReact();
        } else {
            toast.error("Something wrongs...");
        }
    }

    render() {
        let { dataBook } = this.state;
        let { language } = this.props;
        return (
            <>
                {dataBook && dataBook.length > 0 &&
                    <div className='booking-body-title'>
                        Lịch đã đặt
                    </div>
                }
                {dataBook && dataBook.length > 0 &&
                    dataBook.map((item, index) => {
                        const timestamp = parseInt(item.schedulePatientData.ngayKham);
                        const dateObj = new Date(timestamp);
                        const year = dateObj.getFullYear();
                        const month = dateObj.getMonth() + 1;
                        const day = dateObj.getDate();
                        const formattedDate = `${day}/${month}/${year}`;

                        return (
                            <div className="booked-container" key={index}>
                                {
                                    this.state.isOpenModalDoctor &&
                                    <ModalBooking
                                        isOpen={this.state.isOpenModalDoctor}
                                        toggleFromParent={this.toggleUserModal}
                                        bookSchedule={this.state.bookSchedule}
                                    />
                                }

                                {
                                    this.state.isOpenModalComment &&
                                    <CommentModal
                                        isOpen={this.state.isOpenModalComment}
                                        toggleFromParent={this.toggleCommentModal}
                                        bookSchedule={this.state.bookSchedule}
                                        handleComment={this.handleComment}
                                    />
                                }

                                <div className='content-one'>
                                    <div className='content-one-image'
                                        style={{ backgroundImage: `url(${item.schedulePatientData.doctorData.hinhAnh})` }}
                                    ></div>
                                </div>
                                <div className="content-two">
                                    <div>{language === LANGUAGES.VI ?
                                        <span>{item.schedulePatientData.doctorData.ho} {item.schedulePatientData.doctorData.ten}</span> :
                                        <span>{item.schedulePatientData.doctorData.ten} {item.schedulePatientData.doctorData.ho}</span>
                                    }</div>
                                </div>
                                <div className="content-three">

                                    {language === LANGUAGES.VI ?
                                        <div style={{ fontWeight: '600' }}>Lịch đặt: <div style={{ color: 'red' }}>{item.schedulePatientData.timeTypeData.valueVi} - {formattedDate}</div></div>
                                        :
                                        <div style={{ fontWeight: '600' }}>Lịch đặt: <div style={{ color: 'red' }}>{item.schedulePatientData.timeTypeData.valueEn}- {formattedDate}</div></div>
                                    }
                                </div>
                                <div className="content-five">
                                    <div>Địa chỉ phòng khám: <span style={{ fontWeight: '400' }}>{item.schedulePatientData.dataDoctorLK.diaChiPhongKham}</span></div>
                                </div>
                                <div className="content-four">
                                    <div style={{ fontWeight: '600' }}>Lý do khám: <span style={{ fontWeight: '400' }}>{item.lyDoKham}</span></div>
                                </div>
                                <div className="button-detail-book">
                                    <div onClick={() => this.handleViewDoctor(item)}>Chi tiết</div>
                                    {item.danhGia === null &&
                                        <div style={{ color: 'red' }} onClick={() => this.handleViewCommnent(item)}>Đánh giá</div>
                                    }
                                </div>
                            </div >
                        );
                    })
                }

            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScheduleBook));
