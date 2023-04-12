import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from '../routes/Home';
import { path, USER_ROLE } from '../utils'
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import Header from '../containers/Header/Header';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import _ from 'lodash';

class System extends Component {
    render() {


        const { systemMenuPath, isLoggedIn, userInfo } = this.props;

        return (

            <React.Fragment>
                {isLoggedIn && userInfo.user.roleId === USER_ROLE.PATIENT ?
                    <div className="system-container" >
                        <div className="system-list">
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                            </Switch>
                        </div>
                    </div>
                    :
                    <>
                        {isLoggedIn && <Header />}
                        <div className="system-container" >
                            <div className="system-list">
                                <Switch>
                                    <Route path="/system/user-manage" component={UserManage} />
                                    <Route path="/system/user-redux" component={UserRedux} />
                                    <Route path="/system/manage-doctor" component={ManageDoctor} />
                                    <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                    <Route path="/system/manage-clinic" component={ManageClinic} />
                                    <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                                </Switch>
                            </div>
                        </div>
                    </>

                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
