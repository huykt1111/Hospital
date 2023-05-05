import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { getAllHandBook } from '../../../services/userService';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

class HandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbook: []
        }
    }

    async componentDidMount() {
        let res = await getAllHandBook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbook: res.data ? res.data : []
            })
        }
    }

    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`);
        }
    }

    render() {
        let { dataHandbook } = this.state;
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='patient.handbook.handbook' />
                        </span>
                        <button className='btn-section'>
                            <FormattedMessage id='homepage.more-info-hand-book' />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataHandbook && dataHandbook.length > 0 && dataHandbook.map((item, index) => {
                                return (
                                    <div className='section-customize specialty-child'
                                        key={index}
                                        onClick={() => this.handleViewDetailHandbook(item)}
                                    >
                                        <div className='bg-image section-speciality'
                                            style={{ backgroundImage: `url(${item.hinhAnh})` }}
                                        />
                                        <div className='specialty-name'>{item.tenCamNang}</div>
                                    </div>
                                )
                            })}

                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
