import React, { Component } from 'react';
import { connect } from "react-redux";
import './RatifyClinic.scss';
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import { getRegisterClinic, deleteRegisterClinic, ratifyRegisterClinic } from '../../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt();

class RatifyClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrClinic: [],
            currentPage: 1,
            itemsPerPage: 5,
            action: ''
        }
    }

    async componentDidMount() {
        await this.getRegisterClinic();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    getCurrentPageData = () => {
        const { arrClinic, currentPage, itemsPerPage } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return arrClinic.slice(startIndex, endIndex);
    }

    getRegisterClinic = async () => {
        let response = await getRegisterClinic();
        if (response && response.errCode === 0) {
            this.setState({
                arrClinic: response.data,
            })
        }
    }

    handleDeleteClinic = async (id) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn xóa đăng ký của bác sĩ này không?')) {
                let res = await deleteRegisterClinic({ id: id });
                if (res && res.errCode === 0) {
                    toast.success("Xóa phòng khám thành công!")
                    this.getRegisterClinic();
                }
                else {
                    alert(res.errMessage)
                }
            }

        } catch (e) {
            console.log(e);
        }
    }

    handleRatifyClinic = async (id) => {
        let res = await ratifyRegisterClinic({ id: id });
        if (res && res.errCode === 0) {
            toast.success("Ratify clinic succeed!")
            this.getRegisterClinic();
        } else {
            toast.error("Something wrongs....")
        }
    }

    render() {
        const pageCount = Math.ceil(this.state.arrClinic.length / this.state.itemsPerPage);
        let { language } = this.props;
        return (
            <div className="manage-specialty-container">
                <div className="title text-center">
                    <FormattedMessage id="menu.admin.ratify-clinic" />
                </div>
                <div className="manager-specialty mt-4 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormattedMessage id="admin.manage-clinic.id" /></th>
                                <th><FormattedMessage id="admin.manage-clinic.clinic-photo" /></th>
                                <th><FormattedMessage id="admin.manage-clinic.name-clinic" /></th>
                                <th><FormattedMessage id="admin.manage-clinic.address-clinic" /></th>
                                <th><FormattedMessage id="admin.manage-account.action" /></th>
                            </tr>
                            {
                                this.getCurrentPageData().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td style={{ width: '100px' }}>
                                                <div className='content-one-image'
                                                    style={{ backgroundImage: `url(${item.hinhAnh})` }}
                                                ></div>
                                            </td>
                                            <td>{item.tenPhongKham}</td>
                                            <td>{item.diaChi}</td>
                                            <td>
                                                <button className="btn-edit"
                                                    onClick={() => this.handleRatifyClinic(item.id)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDeleteClinic(item.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={({ selected }) => this.handlePageChange(selected + 1)}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        nextClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                    />
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RatifyClinic);
