import React, { Component } from 'react';
import { connect } from "react-redux";
import { getAllCodeService, getSearchAll } from '../../../services/userService'
import './Search.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import * as actions from "../../../store/actions";
import Select from 'react-select';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';

class Search extends Component {

    constructor(props) {
        super(props);
        this.searchPlaceHolder = ['Tìm kiếm chuyên khoa', 'Tìm kiếm phòng khám', 'Tìm kiếm bác sĩ'];
        this.state = {
            index: 0,
            arrDoctorId: [],
            arrClinic: [],
            arrSpecialty: [],
            listProvince: [],
            listPrice: [],
            listClinic: [],
            listSpecialty: [],
            selectedClinic: '',
            selectedSpecialty: '',
            selectedLocation: '',
            searchText: '',
            selectedPrice: ''
        };
    }

    async componentDidMount() {
        this.props.getRequiredDoctorInfor();
        if (this.props.location && this.props.location.state && this.props.location.state.key) {
            let res = await getSearchAll({
                keyword: this.props.location.state.key
            });
            this.setState({
                searchText: this.props.location.state.key,
                arrDoctorId: res.doctor,
                arrClinic: res.clinic,
                arrSpecialty: res.specialty
            })
        }
        else {
            let res = await getSearchAll({
                keyword: ''
            });
            this.setState({
                arrDoctorId: res.doctor,
                arrClinic: res.clinic,
                arrSpecialty: res.specialty
            })
        }
        this.interval = setInterval(() => {
            this.setState((prevState) => ({
                index: (prevState.index + 1) % this.searchPlaceHolder.length
            }));
        }, 3000);
        let resProvince = await getAllCodeService('PROVINCE');
        let resPrice = await getAllCodeService('PRICE');
        if (resProvince && resProvince.errCode === 0) {
            let dataProvince = resProvince.data;
            let dataPrice = resPrice.data;
            if (dataProvince && dataProvince.length > 0 && dataPrice && dataPrice.length > 0) {
                dataProvince.unshift({
                    createdAt: null,
                    keyMap: "ALL",
                    type: "PROVINCE",
                    valueEn: "Province",
                    valueVi: "Khu vực",
                });
                dataPrice.unshift({
                    createdAt: null,
                    keyMap: "ALL",
                    type: "PRICE",
                    valueEn: "Price",
                    valueVi: "Giá tiền",
                })
            }

            this.setState({
                listProvince: dataProvince ? dataProvince : [],
                listPrice: dataPrice ? dataPrice : [],
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            dataSelectSpecialty.unshift({
                label: "Tất cả",
                value: "ALL",
            })
            dataSelectClinic.unshift({
                label: "Tất cả",
                value: "ALL",
            })
            this.setState({
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }

        if (prevProps.language !== this.props.language) {
            let { resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            dataSelectSpecialty.unshift({
                label: "Tất cả",
                value: "ALL",
            })
            dataSelectClinic.unshift({
                label: "Tất cả",
                value: "ALL",
            })
            this.setState({
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.tenChuyenKhoa;
                    object.value = item.id;
                    result.push(object);
                })
            }

            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.tenPhongKham;
                    object.value = item.id;
                    result.push(object);
                })
            }

        };
        return result;
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleSearch = async () => {
        console.log(this.state);
        this.setState({
            arrDoctorId: [],
            arrClinic: [],
            arrSpecialty: [],
        })
        let res = await getSearchAll({
            keyword: this.state.searchText
        });
        this.setState({
            arrDoctorId: res.doctor,
            arrClinic: res.clinic,
            arrSpecialty: res.specialty
        })
    }

    handleViewClinicDetail = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    handleOnChangeSelectProvince = async (event) => {
        this.setState({
            arrDoctorId: [],
            arrClinic: [],
            arrSpecialty: [],
        })
        let location = event.target.value;
        console.log(location)
        let res = await getSearchAll({
            keyword: this.state.searchText,
            location: location,
            price: this.state.selectedPrice,
            specialty: this.state.selectedSpecialty.value,
            clinic: this.state.selectedClinic.value
        });
        this.setState({
            arrDoctorId: res.doctor,
            selectedLocation: location
        })
    }

    handleOnChangeSelectPrice = async (event) => {
        this.setState({
            arrDoctorId: [],
            arrClinic: [],
            arrSpecialty: [],
        })
        let price = event.target.value;
        let res = await getSearchAll({
            keyword: this.state.searchText,
            price: price,
            location: this.state.selectedLocation,
            specialty: this.state.selectedSpecialty.value,
            clinic: this.state.selectedClinic.value
        });
        this.setState({
            arrDoctorId: res.doctor,
            selectedPrice: price
        })
    }

    handleChangeSelectDoctorInfor = async (selectedDoctor, name) => {
        if (name.name === 'selectedSpecialty') {
            let specialty = selectedDoctor;
            this.setState({
                arrDoctorId: [],
                arrClinic: [],
                arrSpecialty: [],
            })
            let res = await getSearchAll({
                keyword: this.state.searchText,
                specialty: specialty.value,
                location: this.state.selectedLocation,
                price: this.state.selectedPrice,
                clinic: this.state.selectedClinic.value
            });
            this.setState({
                arrDoctorId: res.doctor,
                selectedSpecialty: specialty
            })
        }
        if (name.name === 'selectedClinic') {
            let clinic = selectedDoctor;
            this.setState({
                arrDoctorId: [],
                arrClinic: [],
                arrSpecialty: [],
            })
            let res = await getSearchAll({
                keyword: this.state.searchText,
                clinic: clinic.value,
                location: this.state.selectedLocation,
                price: this.state.selectedPrice,
                specialty: this.state.selectedSpecialty.value
            });
            this.setState({
                arrDoctorId: res.doctor,
                selectedClinic: clinic
            })
        }
    }

    render() {
        let { language } = this.props;
        let { listProvince, listPrice, arrDoctorId, arrClinic, arrSpecialty } = this.state;
        const USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const VND = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        return (
            <div>
                <HomeHeader />
                <div className='search-container'>
                    <div className='search-header-content'>

                    </div>
                    <div className='search-header'>
                        <div className='search-box'>
                            <i className="fas fa-search"></i>
                            <input type='text'
                                placeholder={this.searchPlaceHolder[this.state.index]}
                                onChange={(event) => { this.onChangeInput(event, 'searchText') }}
                                value={this.state.searchText}
                            />
                            <span onClick={() => this.handleSearch()}>Tìm kiếm</span>
                        </div>
                        <div className="search-filter">
                            <div className="search-specialty-doctor">
                                <select
                                    onChange={(event) => this.handleOnChangeSelectProvince(event)}
                                >
                                    {listProvince && listProvince.length > 0 &&
                                        listProvince.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <Select
                                    value={this.state.selectedSpecialty}
                                    options={this.state.listSpecialty}
                                    placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                                    onChange={this.handleChangeSelectDoctorInfor}
                                    name={"selectedSpecialty"}
                                />
                                <Select
                                    value={this.state.selectedClinic}
                                    options={this.state.listClinic}
                                    placeholder={<FormattedMessage id="admin.manage-doctor.clinic" />}
                                    onChange={this.handleChangeSelectDoctorInfor}
                                    name={"selectedClinic"}
                                />
                                <select
                                    onChange={(event) => this.handleOnChangeSelectPrice(event)}
                                >
                                    {listPrice && listPrice.length > 0 &&
                                        listPrice.map((item, index) => {
                                            if (index === 0) {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            } else {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? VND.format(item.valueVi) : USDollar.format(item.valueEn)}
                                                    </option>
                                                )
                                            }
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        {arrDoctorId && arrDoctorId.length > 0 &&
                            arrDoctorId.map((item, index) => {
                                return (
                                    <div className="each-doctor" key={index}>
                                        <div className="dt-content-left">
                                            <div className="profile-doctor">
                                                <ProfileDoctor
                                                    doctorId={item.maTk}
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
                                                    doctorIdFromParent={item.maTk}
                                                />
                                            </div>
                                            <div className='doctor-extra-info'>
                                                <DoctorExtraInfor doctorIdFromParent={item.maTk} isNotShowMap={true} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        {arrClinic && arrClinic.length > 0 &&
                            arrClinic.map((item, index) => {
                                return (
                                    <div className="each-clinic" key={index}>
                                        <div className="cl-content-left">
                                            <div className='cl-content-left-img'
                                                style={{ backgroundImage: `url(${item.hinhAnh})` }}
                                            />
                                            <div className='cl-content-left-content'>
                                                <div className='cl-content-left-more' onClick={() => this.handleViewClinicDetail(item)}>
                                                    Xem thêm
                                                </div>
                                                <div className='cl-content-left-address'>
                                                    <i className="fas fa-map-marker-alt"></i> {item.diaChi}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cl-content-right">
                                            <div className="cl-content-right-name">
                                                {item.tenPhongKham}
                                            </div>
                                            <div style={{ display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: item.mieuTaHtml.slice(0, 900) + '...' }}></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        {arrSpecialty && arrSpecialty.length > 0 &&
                            arrSpecialty.map((item, index) => {
                                return (
                                    <div className="each-clinic" key={index}>
                                        <div className="cl-content-left">
                                            <div className='cl-content-left-img'
                                                style={{ backgroundImage: `url(${item.hinhAnh})` }}
                                            />
                                            <div className='cl-content-left-content' style={{ marginLeft: '30px' }}>
                                                <div className='cl-content-left-more' onClick={() => this.handleViewDetailSpecialty(item)}>
                                                    Xem thêm
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cl-content-right">
                                            <div className="cl-content-right-name">
                                                {item.tenChuyenKhoa}
                                            </div>
                                            <div style={{ display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: item.mieuTaHtml.slice(0, 900) + '...' }}></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
