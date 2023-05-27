import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import { getAllRegisterDoctors, ratifyDoctor, refuseDoctor } from '../../../../services/userService';
import ModalDoctor from './ModalDoctor';
import { LANGUAGES } from '../../../../utils';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalDoctor: false,
            doctorRegister: {},
            currentPage: 1,
            itemsPerPage: 5
        }
    }

    async componentDidMount() {
        await this.getAllUserFromReact();
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    getCurrentPageData = () => {
        const { arrUsers, currentPage, itemsPerPage } = this.state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return arrUsers.slice(startIndex, endIndex);
    }

    getAllUserFromReact = async () => {
        let response = await getAllRegisterDoctors();
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.data
            })
        }
    }

    handleViewDoctor = (item) => {
        this.setState({
            isOpenModalDoctor: true,
            doctorRegister: item
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalDoctor: !this.state.isOpenModalDoctor,
        })
    }

    handleRatify = async (user) => {
        try {
            let res = await ratifyDoctor({ maTk: user });
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalDoctor: false
                })

                toast.success("Duyệt bác sĩ thành công!")

                this.getAllUserFromReact();
            }
            else {
                alert(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleRefuseDoctor = async (user) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn xóa đăng ký của bác sĩ này không?')) {
                let res = await refuseDoctor({ maTk: user });
                if (res && res.errCode === 0) {
                    this.getAllUserFromReact();
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
        const pageCount = Math.ceil(this.state.arrUsers.length / this.state.itemsPerPage);
        let { language } = this.props;
        return (
            <div className="doctor-register-container">
                {
                    this.state.isOpenModalDoctor &&
                    <ModalDoctor
                        isOpen={this.state.isOpenModalDoctor}
                        toggleFromParent={this.toggleUserModal}
                        doctor={this.state.doctorRegister}
                        handleRatify={this.handleRatify}
                    />
                }
                <div className="title text-center"><FormattedMessage id="menu.admin.doctor-register" /></div>
                <div className="doctor-register mt-4 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormattedMessage id="patient.family.image" /></th>
                                <th><FormattedMessage id="patient.family.email" /></th>
                                <th><FormattedMessage id="patient.family.lastname" /></th>
                                <th><FormattedMessage id="patient.family.firstname" /></th>
                                <th><FormattedMessage id="patient.family.position" /></th>
                                <th><FormattedMessage id="patient.family.address" /></th>
                                <th><FormattedMessage id="admin.manage-account.action" /></th>
                            </tr>
                            {
                                this.getCurrentPageData().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{ width: '100px' }}>
                                                <div className='content-one-image'
                                                    style={{ backgroundImage: `url(${item.TaiKhoan.hinhAnh})` }}
                                                ></div>
                                            </td>
                                            <td>{item.TaiKhoan.email}</td>
                                            <td>{item.TaiKhoan.ho}</td>
                                            <td>{item.TaiKhoan.ten}</td>
                                            <td>
                                                {language === LANGUAGES.VI ?
                                                    <div>{item.positionData.valueVi}</div>
                                                    :
                                                    <div>{item.positionData.valueEn}</div>
                                                }
                                            </td>
                                            <td>{item.TaiKhoan.diaChi}</td>
                                            <td>
                                                <button className="btn-edit"
                                                    onClick={() => this.handleViewDoctor(item)}
                                                >
                                                    <i className="far fa-eye"></i>
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleRefuseDoctor(item.maTk)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
