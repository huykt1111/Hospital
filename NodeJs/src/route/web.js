import express from "express";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import handBookController from "../controllers/handBookController";
import clinicController from "../controllers/clinicController";
import familyController from "../controllers/familyController";

let router = express.Router();

let initWebRouters = (app) => {
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.post('/api/search-all', userController.getSearchAll);
    router.put('/api/edit-user', userController.handleEditUser);
    router.post('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    router.post('/api/chat-doctor', userController.sendChatBox);
    router.get('/api/get-chat-by-user', userController.getChatDoctorByUser);
    router.get('/api/get-chat-by-doctor', userController.getChatDoctorByDoctor);

    router.post('/api/create-new-member-family', familyController.createNewMember);
    router.get('/api/get-all-member', familyController.getAllMember);
    router.get('/api/get-member', familyController.getMember);
    router.post('/api/update-member-family', familyController.updateMemberData);
    router.post('/api/delete-member-family', familyController.deleteMemberData);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/ratify-register-doctors', doctorController.ratifyDoctor);
    router.post('/api/refuse-register-doctors', doctorController.refuseDoctor);
    router.get('/api/get-register-doctors', doctorController.getAllRegisterDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInfoDoctor);
    router.post('/api/update-infor-doctor', doctorController.updateDetailInfomationDoctor);
    router.get('/api/get-detail-doctor', doctorController.getDetailDoctor);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/cancel-book-appointment', patientController.cancelBook);
    router.post('/api/racing-book-appointment', patientController.racingBook);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    router.get('/api/get-all-book-appointment', patientController.getAllBookedByUser);
    router.get('/api/get-all-booked-appointment', patientController.getAllBookByUser);
    router.get('/api/get-all-patient-book-month', patientController.getAllPatientBookSchedule);
    router.get('/api/get-all-patient-book-cancel', patientController.getAllPatientBookAndCancel);
    router.get('/api/get-all-patient-book-succeed', patientController.getPatientBookSucceed);
    router.get('/api/cancel-book-overdue', patientController.cancelBookOverdue);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.post('/api/register-new-specialty', specialtyController.registerSpecialty);
    router.post('/api/delete-specialty', specialtyController.deleteSpecialty);
    router.post('/api/delete-register-specialty', specialtyController.deleteRatifySpecialty);
    router.post('/api/ratify-specialty', specialtyController.ratifySpecialty);
    router.post('/api/update-specialty', specialtyController.updateSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-register-specialty', specialtyController.getRegisterSpecialty);
    router.get('/api/get-top-specialty', specialtyController.getTopSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.post('/api/register-new-clinic', clinicController.registerClinic);
    router.post('/api/delete-clinic', clinicController.deleteClinic);
    router.post('/api/delete-register-clinic', clinicController.deleteRegisterClinic);
    router.post('/api/update-clinic', clinicController.updateClinic);
    router.post('/api/click-clinic', clinicController.onClickClinic);
    router.post('/api/ratify-clinic', clinicController.ratifyRegisterClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-register-clinic', clinicController.getRegisterClinic);
    router.get('/api/get-top-clinic', clinicController.getTopClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    router.post('/api/create-new-handbook', handBookController.createHandBook);
    router.post('/api/delete-handbook', handBookController.deleteHandBook);
    router.post('/api/update-handbook', handBookController.updateHandBook);
    router.get('/api/get-all-handbook', handBookController.getAllHandBook);
    router.get('/api/get-detail-handbook-by-id', handBookController.getDetailHandBookById);

    return app.use("/", router);
}

module.exports = initWebRouters;