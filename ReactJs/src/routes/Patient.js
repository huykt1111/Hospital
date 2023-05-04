import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import HomeHeader from '../containers/HomePage/HomeHeader';
import FamilyProfile from '../containers/Patient/Family/FamilyProfile';
import AddMember from '../containers/Patient/Family/AddMember';
import ManagerBooking from '../containers/Patient/Booking/ManagerBooking';
import RegisterDoctor from '../containers/Patient/Doctor/RegisterDoctor';
import ProfileUser from '../containers/Patient/Account/ProfileUser';
class Doctor extends Component {
    render() {

        const { isLoggedIn } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn && <HomeHeader />}
                <div className="system-container" >
                    <div className="system-list">
                        <Switch>
                            <Route path="/family-profile/:id" component={FamilyProfile} />
                            <Route path="/booking/:id" component={ManagerBooking} />
                            <Route path="/update-member/:id" component={AddMember} />
                            <Route path="/add-member/" component={AddMember} />
                            <Route path="/register-doctor/:id" component={RegisterDoctor} />
                            <Route path="/update-profile-patient/:id" component={ProfileUser} />

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
