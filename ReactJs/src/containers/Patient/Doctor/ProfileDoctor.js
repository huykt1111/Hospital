import React, { Component } from 'react';
import { connect } from "react-redux";
import { getProfileDoctorById } from '../../../services/userService'
import './ProfileDoctor.scss';
import { LANGUAGES } from '../../../utils';
import { NumericFormat } from 'react-number-format';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from "moment";
import vi from "moment/locale/vi";
import { Link } from 'react-router-dom';


class ProfileDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile: []
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        })
    }

    getInforDoctor = async (id) => {

        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }
        if (this.props.doctorId !== prevProps.doctorId) {
            // this.getInforDoctor(this.props.doctorId)
        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.ngayKham / 1000).locale("vi", vi).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.ngayKham / 1000).locale("en").format('ddd - MM/DD/YYYY')

            console.log(moment.unix(+dataTime.ngayKham / 1000).format('dddd - DD/MM/YYYY'))
            return (
                <>
                    <div>{time} - {date}</div>
                    <div>
                        <FormattedMessage id="patient.booking-modal.free-booking" />
                    </div>
                </>
            )
        }
        return <></>

    }

    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime, isShowLinkDetails, isShowPrice, doctorId } = this.props;

        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.TaiKhoan.ho} ${dataProfile.TaiKhoan.ten}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.TaiKhoan.ten} ${dataProfile.TaiKhoan.ho}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className='content-left'>
                        <div className='content-left-image'
                            style={{ backgroundImage: `url(${dataProfile && dataProfile.TaiKhoan && dataProfile.TaiKhoan.hinhAnh ? dataProfile.TaiKhoan.hinhAnh : ''})` }}
                        />
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className="down">
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.mieuTa &&
                                        <span>{dataProfile.mieuTa}</span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>

                </div>
                {isShowLinkDetails === true &&
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
                    </div>
                }
                {isShowPrice === true &&
                    <div className="price">
                        <FormattedMessage id="patient.booking-modal.price" />
                        {dataProfile && dataProfile.priceIdData && language === LANGUAGES.VI ?
                            <NumericFormat
                                className='currency'
                                value={dataProfile.priceIdData.valueVi}
                                displayType="text"
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                            : ''
                        }
                        {dataProfile && dataProfile.priceIdData && language === LANGUAGES.EN ?
                            <NumericFormat
                                className='currency'
                                value={dataProfile.priceIdData.valueEn}
                                displayType="text"
                                thousandSeparator={true}
                                suffix={'$'}
                            />
                            : ''}
                    </div>
                }
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
