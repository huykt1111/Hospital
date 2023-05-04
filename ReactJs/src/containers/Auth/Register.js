import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../utils';
import * as actions from "../../store/actions";
import './Login.scss';
import { createNewUserService } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import { withRouter } from 'react-router';
import DatePicker from '../../components/Input/DatePicker';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            birthday: '',
            currentDate: '',
            errMessage: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
    }

    handleRegister = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        let formattedDate = new Date(this.state.birthday).getTime();
        let res = await createNewUserService({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            gender: this.state.gender,
            birthday: formattedDate,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
        })
        if (res.errCode === 0) {
            alert('Account successfully created.');
            if (this.props.history) {
                this.props.history.push(`/login`);
            }
        }
        else {
            alert('Account creation failed.');
        }
        this.setState({
            errMessage: res.errMessage,
        })
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleViewLogin = () => {
        if (this.props.history) {
            this.props.history.push(`/login`);
        }
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrChecks = ['email', 'firstName', 'lastName', 'phoneNumber',
            'password', 'confirmPassword', 'phoneNumber', 'address'];
        for (let i = 0; i < arrChecks.length; i++) {
            if (!this.state[arrChecks[i]]) {
                isValid = false;
                alert('This input is required: ' + arrChecks[i])
                break;
            }
        }
        if (!/^[0-9]{10,11}$/.test(this.state.phoneNumber)) {
            isValid = false;
            alert('Please enter a valid phone number.');
            return isValid;
        }
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.state.email)) {
            isValid = false;
            alert('Please enter a valid email.');
            return isValid;
        }
        if (this.state.password !== this.state.confirmPassword) {
            isValid = false;
            alert('Passwords do not match.');
            return isValid;
        }
        return isValid;

    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let { email, password, confirmPassword, firstName, lastName, phoneNumber,
            address, gender } = this.state;
        return (
            <>
                <HomeHeader />
                <div className='login-background' style={{ height: '100vh', }}>
                    <div className='login-background-container'>
                        <div className='login-container' style={{ height: '650px', width: '500px' }}>
                            <div className='login-content row'>
                                <div className='col-12 text-login'>Register</div>
                                {/* <div className="col-6 ">
                                    {isGetGenders === true ? 'Loading genders' : ''}
                                </div> */}
                                <div className="col-12" style={{ color: 'red' }}>
                                    {this.state.errMessage}
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Email:</label>
                                    <input type="email"
                                        className="form-control"
                                        value={email}
                                        placeholder='Enter your email'
                                        onChange={(event) => { this.onChangeInput(event, 'email') }}
                                        pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                                    />
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Phone Number:</label>
                                    <input type="tel"
                                        className="form-control"
                                        value={phoneNumber}
                                        placeholder='Phone Number'
                                        onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                        pattern="[0-9]{10,11}"
                                        required />
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Password:</label>
                                    <div className='custom-input-password'>
                                        <input type={this.state.isShowPassword ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder='Enter your password'
                                            onChange={(event) => { this.onChangeInput(event, 'password') }}
                                            value={password}
                                        />
                                        <span
                                            onClick={() => { this.handleShowHidePassword() }}
                                        >
                                            <i className={this.state.isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Confirm password:</label>
                                    <div className='custom-input-password'>
                                        <input type={this.state.isShowPassword ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder='Confirm password'
                                            onChange={(event) => { this.onChangeInput(event, 'confirmPassword') }}
                                            value={confirmPassword}
                                        />
                                        <span
                                            onClick={() => { this.handleShowHidePassword() }}
                                        >
                                            <i className={this.state.isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Last Name:</label>
                                    <input type="text"
                                        value={lastName}
                                        placeholder='Last Name'
                                        className="form-control"
                                        onChange={(event) => { this.onChangeInput(event, 'lastName') }} />
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>First Name:</label>
                                    <input type="text"
                                        value={firstName}
                                        className="form-control"
                                        placeholder='First Name'
                                        onChange={(event) => { this.onChangeInput(event, 'firstName') }} />
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Gender:</label>
                                    <select id="inputState"
                                        onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                        className="form-control"
                                        value={gender}
                                    >
                                        {genders && genders.length > 0 &&
                                            genders.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-6 form-group login-input'>
                                    <label>Date of Birth:</label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        placeholder='Date of birth'
                                        className="form-control"
                                        value={this.state.birthday}
                                        maxDate={yesterday}
                                    />
                                </div>
                                <div className='col-12 form-group login-input'>
                                    <label>Address:</label>
                                    <input type="text"
                                        className="form-control"
                                        value={address}
                                        placeholder='Address'
                                        onChange={(event) => { this.onChangeInput(event, 'address') }} />
                                </div>
                                <div className='col-12'>
                                    <button className='btn-login'
                                        onClick={() => { this.handleRegister() }}
                                    >
                                        Login
                                    </button>
                                </div>
                                <div className='col-12 register'>
                                    <span className='register-title'>Already have an account:
                                        <span className='register-title-button'
                                            onClick={() => this.handleViewLogin()}
                                        >Login now!</span>
                                    </span>
                                </div>
                                <div className='col-12'>
                                    <span className='forgot-password'>Forgot your password</span>
                                </div>
                                <div className='col-12 text-center mt-3'>
                                    <span className='text-other-login'>Or login with</span>
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
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
