import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Statistical.scss';
import { getAllPatientBookSchedule, getAllPatientBookAndCancel, getPatientBookSucceed, getTopDoctorHomeService } from '../../services/userService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import moment from 'moment';

class Statistical extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientMonth: [],
            patientBook: [],
            patientBookSucceed: [],
            titleBookOrCancel: '',
            topDoctor: []
        };
    }

    async componentDidMount() {
        let res = await getAllPatientBookSchedule();
        if (res && res.errCode === 0) {
            this.setState({
                patientMonth: res.data
            })
        }

        let res1 = await getAllPatientBookAndCancel();
        if (res1 && res1.errCode === 0) {
            this.setState({
                patientBook: res1.data
            })
        }


        let res3 = await getTopDoctorHomeService(1);
        if (res3 && res3.errCode === 0) {
            this.setState({
                topDoctor: res3.data
            })
        }

        this.getPatientBookAndCancel({
            tthai: "ALL",
            title: "Danh sách bệnh nhân đặt lịch trên hệ thống"
        });
    }

    getPatientBookAndCancel = async (data) => {
        let res2 = await getPatientBookSucceed({
            trangThai: data.tthai
        });
        if (res2 && res2.errCode === 0) {
            this.setState({
                patientBookSucceed: res2.data,
                titleBookOrCancel: data.title
            })
        }
    }

    handleOnClickPie = async (data) => {
        if (data && data.name === 'Tổng số đặt lịch') {
            this.getPatientBookAndCancel({
                tthai: "DL",
                title: "Danh sách bệnh nhân đặt lịch"
            });
        } else if (data && data.name === 'Tổng số hủy lịch') {
            this.getPatientBookAndCancel({
                tthai: "HL",
                title: "Danh sách bệnh nhân đã hủy lịch"
            });
        }
    }

    render() {
        const patientMonthArray = Object.entries(this.state.patientMonth).map(([month, patient]) => ({
            month,
            patient
        }));

        const formattedData = patientMonthArray.map(({ month, patient }) => ({
            name: `Tháng ${moment(month, "MM/YYYY").format("MM")}`,
            patient: Math.floor(patient)
        }));

        const patientValues = formattedData.map(({ patient }) => patient);

        const minPatientValue = Math.min(...patientValues);
        const maxPatientValue = Math.max(...patientValues);

        const evenTicks = [];
        for (let i = Math.ceil(minPatientValue); i <= Math.floor(maxPatientValue); i += 2) {
            evenTicks.push(i);
        }

        let patientBook = 0;
        let patientCancel = 0;
        if (this.state.patientBook && Object.keys(this.state.patientBook).length > 0) {
            const { S1, S2 } = this.state.patientBook;
            patientBook = S1 || 0;
            patientCancel = S2 || 0;
        }

        // statistical 2
        const data = [
            { name: 'Tổng số đặt lịch', value: patientBook },
            { name: 'Tổng số hủy lịch', value: patientCancel },
        ];

        const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
        console.log(this.state.topDoctor)

        return (
            <div className="statistical-container">
                <div className='statistical-left'>
                    <p>Tổng số bệnh nhân đặt lịch theo từng tháng</p>
                    <div className='statistical-month'>
                        <LineChart width={500} height={300} data={formattedData}>
                            <XAxis dataKey="name" />
                            <YAxis
                                domain={[minPatientValue, maxPatientValue]}
                                ticks={evenTicks}
                            />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="patient" stroke="#8884d8" />
                        </LineChart>
                    </div>
                    {this.state.topDoctor && this.state.topDoctor.length > 0 && this.state.topDoctor.map((item, index) => {
                        return (
                            <div className="intro-doctor" key={index}>
                                <div style={{ color: "red", fontSize: "18px", marginTop: "20px" }}>Bác sĩ nổi bậc nhất</div>
                                <div className='content-left-image'
                                    style={{ backgroundImage: `url(${item && item.TaiKhoan && item.TaiKhoan.hinhAnh ? item.TaiKhoan.hinhAnh : ''})` }}
                                />
                                <div className='content-left-name'>{item && item.TaiKhoan && item.TaiKhoan.ho + " " + item.TaiKhoan.ten}</div>
                            </div>
                        )
                    })

                    }
                </div>
                <div className='statistical-right'>
                    <p>Tổng số bệnh nhân đặt và hủy lịch</p>
                    <div className='statistical-book'>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={data}
                                dataKey="value"
                                cx={200}
                                cy={150}
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                                        onClick={() => this.handleOnClickPie(entry)}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </div>
                    <div className="manager-specialty mt-4 mx-1">
                        <div style={{ color: "blue", fontSize: "18px" }}>{this.state.titleBookOrCancel}</div>
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th>Mã người đặt</th>
                                    <th>Họ tên người khám</th>
                                    <th>Địa chỉ</th>
                                    <th>Bác sĩ đặt</th>
                                    <th>Ngày đặt</th>
                                </tr>
                                {
                                    this.state.patientBookSucceed && this.state.patientBookSucceed.length > 0 &&
                                    this.state.patientBookSucceed.map((item, index) => {
                                        const timestamp = parseInt(item.schedulePatientData.ngayKham);
                                        const dateObj = new Date(timestamp);
                                        const year = dateObj.getFullYear();
                                        const month = dateObj.getMonth() + 1;
                                        const day = dateObj.getDate();
                                        const formattedDate = `${day}/${month}/${year}`;
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {item.maND}
                                                </td>
                                                <td>
                                                    {item.hoTen}
                                                </td>
                                                <td>{item.diaChi}</td>
                                                <td>{item.schedulePatientData && item.schedulePatientData.doctorData &&
                                                    item.schedulePatientData.doctorData.ho + " " + item.schedulePatientData.doctorData.ten
                                                }</td>
                                                <td>
                                                    {formattedDate}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistical);
