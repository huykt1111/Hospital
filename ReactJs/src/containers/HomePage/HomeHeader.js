import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/logo.jpg';
import { LANGUAGES } from '../../utils';
import { withRouter } from 'react-router';
import { changeLanguageApp } from '../../store/actions/appActions';
import * as actions from "../../store/actions";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.searchPlaceHolder = ['Tìm kiếm chuyên khoa', 'Tìm kiếm phòng khám', 'Tìm kiếm bác sĩ'];
        this.state = {
            index: 0,
            searchKey: ''
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState((prevState) => ({
                index: (prevState.index + 1) % this.searchPlaceHolder.length
            }));
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }

    handleLogout = (processLogout) => {
        processLogout()
        this.props.history.push("/login");
    }

    handleViewLogin = () => {
        if (this.props.history) {
            this.props.history.push(`/login`);
        }
    }

    handleViewRegisterDoctor = (userInfo) => {
        if (this.props.history) {
            this.props.history.push(`/register-doctor/${userInfo.user.id}`);
        }
    }

    handleFamily = (userInfo) => {
        if (this.props.history) {
            this.props.history.push(`/family-profile/${userInfo.user.id}`);
        }
    }

    handleDetailBooking = (userInfo) => {
        if (this.props.history) {
            this.props.history.push(`/booking/${userInfo.user.id}`);
        }
    }

    handleViewRegister = () => {
        if (this.props.history) {
            this.props.history.push(`/register`);
        }
    }

    handleSearch = () => {
        if (this.props.history) {
            this.props.history.push(`/search`, {
                key: this.state.searchKey
            });
        }
    }

    render() {
        let language = this.props.language;
        const { isLoggedIn, userInfo, processLogout } = this.props;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <img className='header-logo' src={logo} onClick={() => this.returnToHome()} />
                        </div>
                        <div className='center-content'>
                            <div className='child-center-content'>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-center-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-center-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.choose-doctor" /></div>
                            </div>
                            {userInfo && userInfo.user &&
                                <div className='child-center-content' onClick={() => this.handleViewRegisterDoctor(userInfo)}>
                                    <div><b><FormattedMessage id="homeheader.registration-doctor" /></b></div>
                                    <div className='subs-title'><FormattedMessage id="homeheader.registration-doctor-title" /></div>
                                </div>
                            }
                        </div>
                        <div className='right-content'>
                            {isLoggedIn ?
                                <div className="dropdown account">
                                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {userInfo && userInfo.user && language === LANGUAGES.VI ?
                                            <span>{userInfo.user.ho} {userInfo.user.ten}</span> :
                                            <span>{userInfo.user.ten + " "} {userInfo.user.ho}</span>
                                        }
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#"><FormattedMessage id="homeheader.profile" /></a>
                                        <a className="dropdown-item" onClick={() => this.handleFamily(userInfo)}><FormattedMessage id="homeheader.family" /></a>
                                        <a className="dropdown-item" onClick={() => this.handleDetailBooking(userInfo)}><FormattedMessage id="homeheader.booking" /></a>
                                        <a className="dropdown-item" onClick={() => this.handleLogout(processLogout)}><FormattedMessage id="homeheader.logout" /></a>
                                    </div>
                                </div>
                                :
                                <div className="dropdown account">
                                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <FormattedMessage id="homeheader.login" />
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" onClick={() => this.handleViewLogin()}><FormattedMessage id="homeheader.login" /></a>
                                        <a className="dropdown-item" onClick={() => this.handleViewRegister()}><FormattedMessage id="homeheader.register" /></a>
                                    </div>
                                </div>
                            }
                            <div className='support'>
                                <i className="far fa-question-circle"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vn active' : 'language-vn'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title-1'>
                                <FormattedMessage id="banner.title-1" />
                            </div>
                            <div className='title-2'>
                                <FormattedMessage id="banner.title-2" />
                            </div>
                            <div className='search'>
                                <i className="fas fa-search"></i>
                                <input type='text'
                                    placeholder={this.searchPlaceHolder[this.state.index]}
                                    onChange={(event) => { this.onChangeInput(event, 'searchKey') }}
                                    value={this.state.searchKey}
                                />
                                <span onClick={() => this.handleSearch()}>Tìm kiếm</span>
                                {/* <datalist id='search-home'>
                                    <option value='Chuyên khoa Nội tiết' />
                                    <option value='Chuyên khoa Tim mạch' />
                                    <option value='Chuyên khoa Tiêu hóa' />
                                    <option value='Chuyên khoa Nhi khoa' />
                                </datalist> */}
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-hospital-alt"></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id="banner.child-1" />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-mobile-alt"></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id="banner.child-2" />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-hospital"></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id="banner.child-3" />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-flask"></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id="banner.child-4" />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id="banner.child-5" />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-stethoscope"></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id="banner.child-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment >

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
