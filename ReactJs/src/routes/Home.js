import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_ROLE } from '../utils';
import _ from 'lodash';

class Home extends Component {

    render() {
        const { isLoggedIn, userInfo } = this.props;
        let linkToRedirect = '';
        if (isLoggedIn) {
            if (userInfo.user && !_.isEmpty(userInfo.user)) {
                let role = userInfo.user.roleId;
                if (role === USER_ROLE.ADMIN || role === USER_ROLE.DOCTOR) {
                    linkToRedirect = '/system/user-manage';
                }
                else if (role === USER_ROLE.PATIENT) {
                    linkToRedirect = '/home';
                } else {
                    linkToRedirect = '/home';
                }
            }

        } else {
            linkToRedirect = '/home';
        }



        return (
            <Redirect to={linkToRedirect} />
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
