import React, { Component } from 'react';
import { connect } from "react-redux";
import { getExtraInforDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
require('dotenv').config();

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    initFacebookSDK() {
        if (window.FB) {
            window.FB.XFBML.parse();
        }

        let { language } = this.props;
        let locale = language === LANGUAGES.VI ? 'vi_VN' : 'en_US'

        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v8.0'
            });

            // auto authenticate with the api if already logged in with facebook
            // window.FB.getLoginStatus(({ authResponse }) => {
            //     if (authResponse) {
            //         accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
            //     } else {
            //         resolve();
            //     }
            // });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = `https://connect.facebook.net/${locale}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }

    async componentDidMount() {
        this.initFacebookSDK();
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    render() {
        let { dataHref, width, numPost } = this.props;


        return (
            <>
                <div className="fb-comments"
                    data-href={"https://developers.facebook.com/docs/plugins/comments#configurator"}
                    data-width={width ? width : ""}
                    data-numposts={numPost ? numPost : 5}
                >

                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
