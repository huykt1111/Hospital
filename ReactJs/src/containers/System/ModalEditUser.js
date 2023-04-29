import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';
import { LANGUAGES } from '../../utils';
import * as actions from "../../store/actions";
import DatePicker from '../../components/Input/DatePicker';

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            birthday: '',
            currentDate: ''
        }

    }

    componentDidMount() {
        this.props.getGenderStart();
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            const timestamp = parseInt(user.ngaySinh);
            const dateObj = new Date(timestamp);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            const formattedDate = `${day}/${month}/${year}`;
            let genders = this.props.language === LANGUAGES.VI ? user.genderData.valueVi : user.genderData.valueEn;
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hashcode',
                firstName: user.ten,
                lastName: user.ho,
                address: user.diaChi,
                phoneNumber: user.soDienThoai,
                gender: user.gioiTinh,
                birthday: formattedDate
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            // Call API create modal
            this.props.editUser(this.state);
        }
    }


    render() {
        let genders = this.state.genderArr;
        console.log("genders", genders)
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let { gender } = this.state;
        console.log("genders", gender)
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size="lg"
            >
                <ModalHeader toggle={() => { this.toggle() }}>Edit a user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className='input-container'>
                            <label>Email</label>
                            <input type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                value={this.state.email}
                                disabled
                            />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type='password'
                                onChange={(event) => { this.handleOnChangeInput(event, "password") }}
                                value={this.state.password}
                                disabled
                            />
                        </div>
                        <div className='input-container'>
                            <label>First name</label>
                            <input type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "firstName") }}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Last name</label>
                            <input type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "lastName") }}
                                value={this.state.lastName}
                            />
                        </div>
                        <div className="col-12 ">
                            {isGetGenders === true ? 'Loading genders' : ''}
                        </div>
                        <div className='input-container'>
                            <label><FormattedMessage id="patient.family.gender" /></label>
                            <select id="inputState"
                                onChange={(event) => { this.handleOnChangeInput(event, 'gender') }}
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
                        <div className='input-container'>
                            <label>Date of Birth:</label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                placeholder='Date of birth'
                                className="form-control"
                                value={this.state.birthday}
                                maxDate={yesterday}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Phone number</label>
                            <input type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "phoneNumber") }}
                                value={this.state.phoneNumber}
                            />
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Address</label>
                            <input type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, "address") }}
                                value={this.state.address}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        className="px-3"
                        onClick={() => { this.handleSaveUser() }}
                    >
                        Save changes
                    </Button>{' '}
                    <Button color="secondary" className="px-3" onClick={() => { this.toggle() }}>Close</Button>
                </ModalFooter>
            </Modal>
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
        getGenderStart: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);




