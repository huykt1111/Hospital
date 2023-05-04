import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import UpdateProfileDoctor from '../containers/System/Doctor/UpdateProfileDoctor';
import UpdateProfile from '../containers/System/Doctor/UpdateProfile';
import RegisterClinic from '../containers/System/Doctor/RegisterClinic';
import RegisterSpecialty from '../containers/System/Doctor/RegisterSpecialty';

class Doctor extends Component {
    render() {

        const { isLoggedIn } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container" >
                    <div className="system-list">
                        <Switch>
                            <Route path="/doctor/update-profile-doctor" component={UpdateProfileDoctor} />
                            <Route path="/doctor/update-profile" component={UpdateProfile} />
                            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                            <Route path="/doctor/manage-patient" component={ManagePatient} />
                            <Route path="/doctor/register-clinic" component={RegisterClinic} />
                            <Route path="/doctor/register-specialty" component={RegisterSpecialty} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
