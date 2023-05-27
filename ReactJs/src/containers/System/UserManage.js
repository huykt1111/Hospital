import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
import ReactPaginate from 'react-paginate';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
            currentPage: 1,
            itemsPerPage: 10,
        }
    }

    async componentDidMount() {
        await this.getAllUserFromReact();
    }

    getAllUserFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
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

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let formattedDate = new Date(data.birthday).getTime();
            let response = await createNewUserService({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                birthday: formattedDate,
                address: data.address,
                phoneNumber: data.phoneNumber,
            });
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            }
            else {
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModalUser: false
                });
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUserFromReact();
            }
            else {
                alert(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    doEditUser = async (data) => {
        try {
            let formattedDate = new Date(data.birthday).getTime();
            let res = await editUserService({
                id: data.id,
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                birthday: formattedDate,
                address: data.address,
                phoneNumber: data.phoneNumber,
            });
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })

                this.getAllUserFromReact();
            }
            else {
                alert(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        let arrUsers = this.state.arrUsers;
        const pageCount = Math.ceil(this.state.arrUsers.length / this.state.itemsPerPage);
        console.log(arrUsers);
        return (
            <div className="user-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className="title text-center"><FormattedMessage id="menu.admin.user-account" /></div>
                <div className='mx-1'>
                    <button className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}>
                        <i className="fas fa-plus"></i>
                        <FormattedMessage id="admin.manage-account.add" />
                    </button>
                </div>
                <div className="user-table mt-4 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormattedMessage id="patient.family.id" /></th>
                                <th><FormattedMessage id="patient.family.email" /></th>
                                <th><FormattedMessage id="patient.family.lastname" /></th>
                                <th><FormattedMessage id="patient.family.firstname" /></th>
                                <th><FormattedMessage id="patient.family.address" /></th>
                                <th><FormattedMessage id="admin.manage-account.action" /></th>
                            </tr>
                            {
                                this.getCurrentPageData().map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.email}</td>
                                            <td>{item.ho}</td>
                                            <td>{item.ten}</td>
                                            <td>{item.diaChi}</td>
                                            <td>
                                                <button className="btn-edit"
                                                    onClick={() => this.handleEditUser(item)}
                                                >
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDeleteUser(item)}>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
