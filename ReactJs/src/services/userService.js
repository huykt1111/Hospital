import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const createNewMember = (data) => {
    return axios.post('/api/create-new-member-family', data);
}

const getAllMember = (data) => {
    return axios.get(`/api/get-all-member?id_user=${data.id}`);
}

const getMemberByUser = (data) => {
    return axios.get(`/api/get-member?id_user=${data.id}`);
}

const updateMemberData = (data) => {
    return axios.post(`/api/update-member-family`, data);
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
}

const deleteUserService = (userId) => {
    return axios.post('/api/delete-user', {
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
}

const refuseDoctor = (data) => {
    return axios.post(`/api/refuse-register-doctors`, data);
}

const ratifyDoctor = (data) => {
    return axios.post(`/api/ratify-register-doctors`, data);
}

const getAllRegisterDoctors = () => {
    return axios.get(`/api/get-register-doctors`);
}

const saveDetailDoctorsService = (data) => {
    return axios.post(`/api/save-infor-doctor`, data);
}

const updateDetailDoctorsService = (data) => {
    return axios.post(`/api/update-infor-doctor`, data);
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor?id=${inputId}`);
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
}

const postPatientBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data);
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data);
}

const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
}

const registerNewSpecialty = (data) => {
    return axios.post(`/api/register-new-specialty`, data);
}

const updateSpecialty = (data) => {
    return axios.post(`/api/update-specialty`, data);
}

const deleteSpecialty = (data) => {
    return axios.post(`/api/delete-specialty`, data);
}

const deleteRatifySpecialty = (data) => {
    return axios.post(`/api/delete-register-specialty`, data);
}

const ratifySpecialty = (data) => {
    return axios.post(`/api/ratify-specialty`, data);
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`);
}

const getRegisterSpecialty = () => {
    return axios.get(`/api/get-register-specialty`);
}

const getTopSpecialty = () => {
    return axios.get(`/api/get-top-specialty`);

}

const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
}

const registerNewClinic = (data) => {
    return axios.post(`/api/register-new-clinic`, data);
}

const updateClinic = (data) => {
    return axios.post(`/api/update-clinic`, data);
}

const deleteClinic = (data) => {
    return axios.post(`/api/delete-clinic`, data);
}

const getAllClinic = () => {
    return axios.get(`/api/get-all-clinic`);
}

const getRegisterClinic = () => {
    return axios.get(`/api/get-register-clinic`);
}

const ratifyRegisterClinic = (data) => {
    return axios.post(`/api/ratify-clinic`, data);
}

const deleteRegisterClinic = (data) => {
    return axios.post(`/api/delete-register-clinic`, data);
}

const getTopClinic = () => {
    return axios.get(`/api/get-top-clinic`);
}

const getAllDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post(`/api/send-remedy`, data);
}

const cancelBook = (data) => {
    return axios.post(`/api/cancel-book-appointment`, data);
}

const racingBook = (data) => {
    return axios.post(`/api/racing-book-appointment`, data);
}

const getAllBookedByUser = (data) => {
    return axios.get(`/api/get-all-book-appointment?id_user=${data.id}`);
}

const getAllBookByUser = (data) => {
    return axios.get(`/api/get-all-booked-appointment?id_user=${data.id}`);
}

const getSearchAll = (data) => {
    return axios.post(`/api/search-all`, data);
}

const createHandBook = (data) => {
    return axios.post(`/api/create-new-handbook`, data);
}

const updateHandBook = (data) => {
    return axios.post(`/api/update-handbook`, data);
}

const deleteHandBook = (data) => {
    return axios.post(`/api/delete-handbook`, data);
}

const getAllHandBook = () => {
    return axios.get(`/api/get-all-handbook`);
}

const getDetailHandBookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`)
}

export {
    handleLoginApi,
    createNewMember,
    getAllMember,
    updateMemberData,
    getAllUsers,
    getMemberByUser,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctorsService,
    saveDetailDoctorsService,
    updateDetailDoctorsService,
    getDetailInforDoctor,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    createNewSpecialty,
    getAllSpecialty,
    getAllDetailSpecialtyById,
    createNewClinic,
    registerNewClinic,
    getAllClinic,
    getAllDetailClinicById,
    getAllPatientForDoctor,
    postSendRemedy,
    getAllRegisterDoctors,
    ratifyDoctor,
    refuseDoctor,
    deleteClinic,
    updateClinic,
    deleteSpecialty,
    updateSpecialty,
    registerNewSpecialty,
    getAllBookedByUser,
    getAllBookByUser,
    cancelBook,
    racingBook,
    getTopSpecialty,
    getTopClinic,
    getSearchAll,
    getRegisterClinic,
    deleteRegisterClinic,
    ratifyRegisterClinic,
    getRegisterSpecialty,
    deleteRatifySpecialty,
    ratifySpecialty,
    createHandBook,
    getAllHandBook,
    getDetailHandBookById,
    deleteHandBook,
    updateHandBook,
}