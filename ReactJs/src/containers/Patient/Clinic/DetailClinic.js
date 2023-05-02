import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailClinic.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailClinicById } from '../../../services/userService';
import GoogleMapReact from 'google-map-react';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import _ from 'lodash';

class DetailClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            center: {
                lat: 16.047079,
                lng: 108.206230
            },
            zoom: 11,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailClinicById({
                id: id
            });

            if (res && res.errCode == 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.maTk);
                        })
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                })

                const address = this.state.dataDetailClinic.diaChi;
                try {
                    const result = await geocodeByAddress(address);
                    if (result.length > 0) {
                        const lnglat = await getLatLng(result[0]);
                        console.log(lnglat);
                        this.setState({
                            center: lnglat
                        });
                    } else {
                        console.error('No results found');
                    }
                } catch (error) {
                    console.error('Error getting geolocation', error);
                }
            }

        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    render() {
        let { arrDoctorId, dataDetailClinic } = this.state;
        let { language } = this.props;

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className='description-specialty'>
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                            <div>
                                <div className='title-specialty'>
                                    {dataDetailClinic.tenPhongKham}
                                </div>
                                <div style={{ height: '50vh', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_JS_API }}
                                        center={this.state.center}
                                        defaultCenter={this.state.center}
                                        defaultZoom={this.state.zoom}
                                    >
                                        <Marker lat={this.state.center.lat} lng={this.state.center.lng} />
                                    </GoogleMapReact>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.mieuTaHtml }}>

                                </div>

                            </div>
                        }
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={index}>
                                    <div className="dt-content-left">
                                        <div className="profile-doctor">
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetails={true}
                                                isShowPrice={true}

                                            // dataTime={dataTime}
                                            />
                                        </div>
                                    </div>
                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule
                                                doctorIdFromParent={item}
                                            />
                                        </div>
                                        <div className='doctor-extra-info'>
                                            <DoctorExtraInfor doctorIdFromParent={item} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        );
    }
}

const Marker = () => <div style={{ color: 'red' }}>Hospital <i className="fa fa-map-marker-alt"></i></div>;

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
