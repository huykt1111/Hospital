import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

class Speciality extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecially: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecially: res.data ? res.data : []
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecially } = this.state;
        return (
            <div className='section-share section-speciality'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homepage.specialty-popular' /></span>
                        <button className='btn-section'><FormattedMessage id='homepage.more-info' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecially && dataSpecially.length > 0 && dataSpecially.map((item, index) => {
                                return (
                                    <div className='section-customize specialty-child'
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div className='bg-image section-speciality'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        />
                                        <div className='specialty-name'>{item.name}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Speciality));
