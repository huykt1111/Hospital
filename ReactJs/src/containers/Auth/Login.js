import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { handleLoginApi } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                });
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('Login Success')
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    handleViewRegister = () => {
        if (this.props.history) {
            this.props.history.push(`/register`);
        }
    }

    render() {
        return (
            <>
                <HomeHeader />
                <div className='login-background'>
                    <div className='login-background-container'>
                        <div className='login-container'>
                            <div className='login-content row'>
                                <div className='col-12 text-login'>
                                    <FormattedMessage id="homeheader.login" />
                                </div>
                                <div className='col-12 form-group login-input'>
                                    <label><FormattedMessage id="homeheader.account" />:</label>
                                    <input type='text'
                                        className='form-control'
                                        placeholder="Nhập tài khoản của bạn"
                                        value={this.state.username}
                                        onChange={(event) => this.handleOnChangeUsername(event)}
                                    />
                                </div>
                                <div className='col-12 form-group login-input'>
                                    <label><FormattedMessage id="homeheader.password" />:</label>
                                    <div className='custom-input-password'>
                                        <input type={this.state.isShowPassword ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder="Nhập mật khẩu của bạn"
                                            onChange={(event) => { this.handleOnChangePassword(event) }}
                                            onKeyDown={(event) => this.handleKeyDown(event)}
                                        />
                                        <span
                                            onClick={() => { this.handleShowHidePassword() }}
                                        >
                                            <i className={this.state.isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12" style={{ color: 'red' }}>
                                    {this.state.errMessage}
                                </div>
                                <div className='col-12'>
                                    <button className='btn-login'
                                        onClick={() => { this.handleLogin() }}
                                    >
                                        <FormattedMessage id="homeheader.login" />
                                    </button>
                                </div>
                                <div className='col-12 register'>
                                    <span className='register-title'><FormattedMessage id="homeheader.no-account" />:
                                        <span className='register-title-button'
                                            onClick={() => this.handleViewRegister()}
                                        ><FormattedMessage id="homeheader.register-now" />!</span>
                                    </span>
                                </div>
                                <div className='col-12'>
                                    <span className='forgot-password'><FormattedMessage id="homeheader.forgot-password" /></span>
                                </div>
                                <div className='col-12 text-center mt-3'>
                                    <span className='text-other-login'><FormattedMessage id="homeheader.login-with" /></span>
                                </div>
                                <div className='col-12 social-login'>
                                    <i className="fab fa-google-plus-g google"></i>
                                    <i className="fab fa-facebook-f facebook"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
