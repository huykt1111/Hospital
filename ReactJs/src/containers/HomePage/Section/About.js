import React, { Component } from 'react';
import { connect } from 'react-redux';

class About extends Component {

    render() {

        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Truyền thông nói về BookingCare
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400"
                            src="https://www.youtube.com/embed/FyDQljKtWnI"
                            title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Trong lĩnh vực chăm sóc sức khỏe đã có nhiều giải pháp để hỗ trợ người bệnh theo các hướng khác nhau. Có ứng dụng cung cấp thông tin để người bệnh tham khảo; có nơi tập trung vào mảng bác sĩ gia đình; đưa ra giải pháp về xét nghiệm tại nhà; và có cả nền tảng giúp người bệnh hỏi đáp bác sĩ. Tuy nhiên, đó chưa phải là những giải pháp giúp người bệnh dễ dàng tiếp cận với việc đi khám và giải quyết được vấn đề quá tải tại các bệnh viện.</p>
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
