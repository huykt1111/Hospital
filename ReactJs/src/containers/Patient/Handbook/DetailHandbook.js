import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailHandbook.scss';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailHandBookById } from '../../../services/userService';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

class DetailHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandBook: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailHandBookById({
                id: id
            });

            this.setState({
                dataDetailHandBook: res.data,
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    render() {
        let { dataDetailHandBook } = this.state;
        let { language } = this.props;
        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className='description-specialty'>
                        <div className='description-specialty-img'
                            style={{ backgroundImage: `url(${dataDetailHandBook.hinhAnh})` }}
                        />
                        {dataDetailHandBook && !_.isEmpty(dataDetailHandBook) &&
                            <div>
                                <div className='title-specialty'>
                                    {dataDetailHandBook.tenCamNang}
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: dataDetailHandBook.mieuTaHtml }}>

                                </div>

                            </div>
                        }
                    </div>

                    <div className='special-bottom'>

                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailHandbook));
