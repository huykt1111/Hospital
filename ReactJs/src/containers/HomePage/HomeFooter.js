import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer'>
                <p>&copy; 2023 Nguyễn Quang Huy. More Information, please visit my email.<a target='_blank' href='https://github.com/huykt1111/Hospital-ReactJs'>&#8594; Click here! &#8592;</a></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
