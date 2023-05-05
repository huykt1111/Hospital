import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    <FormattedMessage id='homepage.media-talk-hospital' />
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400"
                            src="https://www.youtube.com/embed/JIdm23gzOH8"
                            title="Bệnh viện Hoàn Mỹ Đà Nẵng | Giới thiệu"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen>
                        </iframe>
                    </div>
                    <div className='content-right'>
                        <p>
                            <FormattedMessage id='homepage.media-talk-hospital-content' />
                        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
