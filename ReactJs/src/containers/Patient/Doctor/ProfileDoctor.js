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
            dataProfile: {}
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
        console.log(language)
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).locale("vi", vi).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale("en").format('ddd - MM/DD/YYYY')

            console.log(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
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
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        console.log("Check props", dataTime)
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className='content-left'>
                        <div className='content-left-image'
                            style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                        />
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className="down">
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <span>{dataProfile.Markdown.description}</span>
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
                        {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI ?
                            <NumericFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceIdData.valueVi}
                                displayType="text"
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                            : ''
                        }
                        {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN ?
                            <NumericFormat
                                className='currency'
                                value={dataProfile.Doctor_Infor.priceIdData.valueEn}
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
