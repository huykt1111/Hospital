import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageHandbook.scss';
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { createHandBook, getAllHandBook, deleteHandBook, updateHandBook } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt();

class ManageHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHtml: '',
            descriptionMarkdown: '',
            idHandbook: '',
            arrSpecialty: [],
            currentPage: 1,
            itemsPerPage: 5,
            action: ''
        }
    }

    async componentDidMount() {
        await this.getAllHandBook();
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

    getAllHandBook = async () => {
        let response = await getAllHandBook();
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

    handleEditHandBook = async (data) => {
        this.setState({
            idHandbook: data.id,
            name: data.tenCamNang,
            imageBase64: data.hinhAnh,
            descriptionHtml: data.mieuTaHtml,
            descriptionMarkdown: data.mieuTaMarkDown,
            action: CRUD_ACTIONS.EDIT
        })
    }

    handleSaveNewHandBook = async () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createHandBook(this.state);
            if (res && res.errCode === 0) {
                toast.success("Add new handbook succeed!")
                this.getAllHandBook();
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
            let res = await updateHandBook(this.state);
            if (res && res.errCode === 0) {
                toast.success("Update handbook succeed!")
                this.getAllHandBook();
                this.setState({
                    idHandbook: '',
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

    handleDeleteHandBook = async (handBook) => {
        try {
            if (window.confirm('Bạn có chắc chắn muốn chuyên khoa này không?')) {
                let res = await deleteHandBook({ id: handBook });
                if (res && res.errCode === 0) {

                    toast.success("Xóa phòng khám thành công!")

                    this.getAllHandBook();
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
                    <FormattedMessage id="menu.admin.manage-handbook" />
                </div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.name-handbook" /></label>
                        <input className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-handbook.handbook-photo" /></label>
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
                            onClick={() => this.handleSaveNewHandBook()}
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
                                <th><FormattedMessage id="admin.manage-handbook.id" /></th>
                                <th><FormattedMessage id="admin.manage-handbook.handbook-photo" /></th>
                                <th><FormattedMessage id="admin.manage-handbook.name-handbook" /></th>
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
                                            <td>{item.tenCamNang}</td>
                                            <td>
                                                <button className="btn-edit"
                                                    onClick={() => this.handleEditHandBook(item)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn-delete"
                                                    onClick={() => this.handleDeleteHandBook(item.id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
