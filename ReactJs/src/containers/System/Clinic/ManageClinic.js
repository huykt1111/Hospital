import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss';
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

import { createNewClinic, getAllClinic, deleteClinic, updateClinic } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt();

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHtml: '',
            descriptionMarkdown: '',
            idClinic: '',
            arrClinic: [],
            currentPage: 1,
            itemsPerPage: 5,
            action: ''
        }
    }

    async componentDidMount() {
        await this.getAllClinic();
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

    getAllClinic = async () => {
        let response = await getAllClinic();
        if (response && response.errCode === 0) {
            this.setState({
                arrClinic: response.data,
                action: CRUD_ACTIONS.CREATE
            })
        }
    }

    handleDeleteClinic = async (user) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn xóa đăng ký của bác sĩ này không?')) {
                let res = await deleteClinic({ id: user });
                console.log(res);
                if (res && res.errCode === 0) {

                    toast.success("Xóa phòng khám thành công!")

                    this.getAllClinic();
                }
                else {
                    alert(res.errMessage)
                }
            }

        } catch (e) {
            console.log(e);
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language != prevProps.language) {

        }

    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHtml: html,
        })
    }

    handleOnChangImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }
    }

    handleEditClinic = async (data) => {
        this.setState({
            idClinic: data.id,
            name: data.tenPhongKham,
            address: data.diaChi,
            imageBase64: data.hinhAnh,
            descriptionHtml: data.mieuTaHtml,
            descriptionMarkdown: data.mieuTaMarkDown,
            action: CRUD_ACTIONS.EDIT
        })
    }

    handleSaveNewClinic = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success("Add new clinic succeed!")
                this.getAllClinic();
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHtml: '',
                    descriptionMarkdown: ''
                })
            } else {
                toast.error("Something wrongs....")
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await updateClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success("Update clinic succeed!")
                this.getAllClinic();
                this.setState({
                    idClinic: '',
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHtml: '',
                    descriptionMarkdown: ''
                })
            } else {
                toast.error("Something wrongs....")
            }
        }
    }

    render() {
        const pageCount = Math.ceil(this.state.arrClinic.length / this.state.itemsPerPage);
        let { language } = this.props;
        return (
            <div className="manage-specialty-container">
                <div className="title text-center">Manage Clinic</div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên phòng khám</label>
                        <input className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Địa chỉ phòng khám</label>
                        <input className="form-control"
                            type="text"
                            value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>
                    <div className="col-12 form-group">
                        <label>Ảnh phòng khám</label>
                        <input className="form-control-file"
                            type="file"
                            onChange={(event) => this.handleOnChangImage(event)}
                        />
                        <td style={{ width: '100px' }}>
                            <div className='content-one-image'
                                style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                            ></div>
                        </td>
                    </div>

                    <div className="col-12">
                        <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12 my-3">
                        <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                            onClick={() => this.handleSaveNewClinic()}
                        >
                            {this.state.action === CRUD_ACTIONS.EDIT ?
                                <FormattedMessage id="admin.manage-clinic.edit" /> :
                                <FormattedMessage id="admin.manage-clinic.create" />
                            }
                        </button>
                    </div>

                </div>

                <div className="manager-specialty mt-4 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Action</th>
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
                                                    onClick={() => this.handleEditClinic(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
