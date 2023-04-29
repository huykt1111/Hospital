import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagerBooking.scss';
import ScheduleBook from './ScheduleBook';
import ScheduleBooked from './ScheduleBooked';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';

class ManagerBooking extends Component {

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
                <div className="booking-container">
                    <div className="booking-body">
                        <div>
                            <div className='booking-body-title'>Lịch đang đặt</div>
                            <ScheduleBook />
                        </div>
                        <div>
                            <div className='booking-body-title'>
                                Lịch đã đặt
                            </div>
                            <ScheduleBooked />
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBooking);
