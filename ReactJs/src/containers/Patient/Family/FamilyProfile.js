import React, { Component } from 'react';
import { connect } from "react-redux";
import './FamilyProfile.scss';
import { LANGUAGES } from '../../../utils';
import ProfileFamily from './ProfileFamily';
import { FormattedMessage } from 'react-intl';

class FamilyProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {

    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }
    }

    handleCreateMember = () => {
        if (this.props.history) {
            this.props.history.push(`/add-member/`);
        }
    }

    render() {
        let { language } = this.props;
        return (
            <React.Fragment>
                <div className="family-profile-container">
                    <div className="button-member">
                        <div className='button-member-add' onClick={() => this.handleCreateMember()}>
                            Thêm thành viên
                        </div>
                    </div>
                    <div className="family-profile-body">

                        <ProfileFamily />
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FamilyProfile);
