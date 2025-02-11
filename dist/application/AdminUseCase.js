"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AdminUseCase {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    getAdminPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.adminLoginSession) {
                res.redirect('/adminDashBoard');
            }
            else {
                res.render('adminPages/adminLoginPage', { notValid: req.session.invalidAdminCreds });
            }
        });
    }
    adminLogSubmit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const credentials = {
                    email: process.env.ADMINEMAIL,
                    password: process.env.ADMINPASSWORD,
                };
                if (credentials.email === req.body.username &&
                    req.body.password === credentials.password) {
                    req.session.adminLoginSession = true;
                    res.redirect('/adminDashBoard');
                }
                else {
                    req.session.invalidAdminCreds = true;
                    res.redirect('/adminLogin');
                }
            }
            catch (err) {
                console.log('Error Occur in Admin Log In' + err);
            }
        });
    }
    adminDashBoard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.adminLoginSession) {
                const usersData = yield this.adminRepository.getUsers();
                res.render('adminPages/adminDashBoard', { users: usersData });
            }
            else {
                res.redirect('/adminLogin');
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.adminRepository.deleteUser(id);
                res.redirect('/adminDashBoard');
            }
            catch (error) {
                console.log('error in deleting data', error);
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone } = req.body;
                const { id } = req.params;
                yield this.adminRepository.editUser(id, name, email, phone);
                // res.send({ success: true })
                res.redirect('/adminDashBoard');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addUserPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.adminLoginSession) {
                try {
                    res.render('adminPages/createUser', {
                        userExist: req.session.addUserExist,
                    });
                    req.session.addUserExist = false;
                    req.session.save();
                }
                catch (error) {
                    console.log('error in getting add user page ', error);
                }
            }
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                const result = yield this.adminRepository.addUser(name, email, phone, password, req.session);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    res.redirect('/adminDashBoard');
                }
                else {
                    req.session.addUserExist = result.message;
                    res.redirect("/addUserPage");
                }
            }
            catch (error) {
                console.log('error in adding user', error);
            }
        });
    }
    searchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.body;
                const users = yield this.adminRepository.searchUser(search);
                res.render('adminPages/adminDashBoard', { users });
            }
            catch (error) {
                console.log('error in searching ', error);
            }
        });
    }
    adminLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.adminLoginSession = false;
            res.redirect('/adminLogin');
        });
    }
}
exports.default = AdminUseCase;
