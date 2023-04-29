import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import familyController from "../controllers/familyController";

let router = express.Router();

let initWebRouters = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.post('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    router.post('/api/create-new-member-family', familyController.createNewMember);
    router.get('/api/get-all-member', familyController.getAllMember);
    router.get('/api/get-member', familyController.getMember);
    router.post('/api/update-member-family', familyController.updateMemberData);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/ratify-register-doctors', doctorController.ratifyDoctor);
    router.post('/api/refuse-register-doctors', doctorController.refuseDoctor);
    router.get('/api/get-register-doctors', doctorController.getAllRegisterDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInfoDoctor);
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

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.post('/api/delete-specialty', specialtyController.deleteSpecialty);
    router.post('/api/update-specialty', specialtyController.updateSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.post('/api/delete-clinic', clinicController.deleteClinic);
    router.post('/api/update-clinic', clinicController.updateClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    return app.use("/", router);
}

module.exports = initWebRouters;