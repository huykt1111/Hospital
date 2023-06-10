import React, { Component } from 'react';
import { connect } from "react-redux";
import './RatifySpecialty.scss';
import { LANGUAGES } from '../../../../utils';
import { getRegisterSpecialty, deleteRatifySpecialty, ratifySpecialty } from '../../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';
import { FormattedMessage } from 'react-intl';

class RatifySpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSpecialty: [],
            currentPage: 1,
            itemsPerPage: 5,
        }
    }

    async componentDidMount() {
        await this.getRegisterSpecialty();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    getCurrentPageData = () => {
        const { arrSpecialty, currentPage, itemsPerPage } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return arrSpecialty.slice(startIndex, endIndex);
    }

    getRegisterSpecialty = async () => {
        let response = await getRegisterSpecialty();
        if (response && response.errCode === 0) {
            this.setState({
                arrSpecialty: response.data
            })
        }
    }

    handleRatifySpecialty = async (id) => {

        let res = await ratifySpecialty({ id: id });
        if (res && res.errCode === 0) {
            toast.success("Xác nhận chuyên khoa thành công!")
            this.getRegisterSpecialty();

        } else {
            toast.error("Something wrongs....")
        }
    }

    handleDeleteSpecialty = async (specialty) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn chuyên khoa này không?')) {
                let res = await deleteRatifySpecialty({ id: specialty });
                if (res && res.errCode === 0) {

                    toast.success("Xóa phòng khám thành công!")

                    this.getRegisterSpecialty();
                }
                else {
                    alert(res.errMessage)
                }
            }

        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const pageCount = Math.ceil(this.state.arrSpecialty.length / this.state.itemsPerPage);
        let { language } = this.props;
        return (
            <div className="manage-specialty-container">
                <div className="title">
                    <FormattedMessage id="menu.admin.ratify-specialty" />
                </div>

                <div className="manager-specialty mt-4 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormattedMessage id="admin.manage-specialty.id" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.specialty-photo" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.name-specialty" /></th>
                                <th><FormattedMessage id="admin.manage-account.action" /></th>
                            </tr>
                            {
                                this.getCurrentPageData().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td style={{ width: '100px' }}>
                                                <div className='content-one-image'
                                                    style={{ backgroundImage: `url(${item.hinhAnh})` }}
                                                ></div>
                                            </td>
                                            <td>{item.tenChuyenKhoa}</td>
                                            <td>
                                                <button className="btn-edit"
                                                    onClick={() => this.handleRatifySpecialty(item.id)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDeleteSpecialty(item.id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(RatifySpecialty);
