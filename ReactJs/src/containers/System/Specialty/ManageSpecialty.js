import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss';
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { createNewSpecialty, getAllSpecialty, deleteSpecialty, updateSpecialty } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHtml: '',
            descriptionMarkdown: '',
            idSpecialty: '',
            arrSpecialty: [],
            currentPage: 1,
            itemsPerPage: 5,
            action: ''
        }
    }

    async componentDidMount() {
        await this.getAllSpecialty();
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

    getAllSpecialty = async () => {
        let response = await getAllSpecialty();
        if (response && response.errCode === 0) {
            this.setState({
                arrSpecialty: response.data,
                action: CRUD_ACTIONS.CREATE
            })
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

    handleEditSpecialty = async (data) => {
        this.setState({
            idSpecialty: data.id,
            name: data.tenChuyenKhoa,
            imageBase64: data.hinhAnh,
            descriptionHtml: data.mieuTaHtml,
            descriptionMarkdown: data.mieuTaMarkDown,
            action: CRUD_ACTIONS.EDIT
        })
    }

    handleSaveNewSpecialty = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success("Add new specialty succeed!")
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHtml: '',
                    descriptionMarkdown: ''
                })
            } else {
                toast.error("Something wrongs....")
            }
        }
        if (action === CRUD_ACTIONS.EDIT) {
            let res = await updateSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success("Update specialty succeed!")
                this.getAllSpecialty();
                this.setState({
                    idSpecialty: '',
                    name: '',
                    imageBase64: '',
                    descriptionHtml: '',
                    descriptionMarkdown: ''
                })
            } else {
                toast.error("Something wrongs....")
            }
        }
    }

    handleDeleteSpecialty = async (specialty) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn chuyên khoa này không?')) {
                let res = await deleteSpecialty({ id: specialty });
                if (res && res.errCode === 0) {

                    toast.success("Xóa phòng khám thành công!")

                    this.getAllSpecialty();
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
                <div className="title"><FormattedMessage id="menu.admin.manage-specialty" /></div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.name-specialty" /></label>
                        <input className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.specialty-photo" /></label>
                        <input className="form-control-file"
                            type="file"
                            onChange={(event) => this.handleOnChangImage(event)}
                        />
                        {this.state.imageBase64 !== '' &&
                            <td style={{ width: '100px' }}>
                                <div className='content-one-image'
                                    style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                                ></div>
                            </td>
                        }
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
                            onClick={() => this.handleSaveNewSpecialty()}
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
                                <th><FormattedMessage id="admin.manage-specialty.id" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.specialty-photo" /></th>
                                <th><FormattedMessage id="admin.manage-specialty.name-specialty" /></th>
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
                                            <td>{item.tenChuyenKhoa}</td>
                                            <td>
                                                <button className="btn-edit"
                                                    onClick={() => this.handleEditSpecialty(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
