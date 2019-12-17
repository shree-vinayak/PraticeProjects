import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Login, SocialLogin } from '../shared/global-urls';
import { TableFilterStateService } from './table-fliter-state.service';
import { GlobalConstants } from '../shared/settings';

@Injectable()
export class LoginService {
    constructor(private http: Http,
                private tableFilterStateService: TableFilterStateService) {
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token !== null && token !== '') {
            return token;
        }
    }

    getLoggedInUser() {
        const user = JSON.parse(localStorage.getItem('loginuser'));
        return user ? user : null;
    }

    getLoginUserType() {
        let userTypeName = null;
        const loginUser = this.getLoggedInUser();
        if (loginUser && loginUser.types) {
            loginUser.types.forEach(element => {
                if (element.name) {
                    if (element.name === 'admin') {
                        userTypeName = element.entity;
                    } else if (element.entity === 'academic' && element.name !== 'student') {
                        userTypeName = element.entity;
                    } else {
                        userTypeName = element.name;
                    }
                }
            });
        }
        return userTypeName === null ? userTypeName : userTypeName.toString().toLowerCase();
    }

    loginRegistredUser(email, password) {
        const userJson = {
            'email': email,
            'password': password
        };
        return this.http.post(Login.url, userJson).map(res => {
            if (res.statusText === 'OK') {
                this.tableFilterStateService.resetFiltersStates();
                const response = JSON.parse(res['_body']).data;
                return response;
            } else {
                return null;
            }
        });
    }

    updateFolderPermission() {
        const user = JSON.parse(localStorage.getItem('loginuser'));
        const userFolderPermissions = {
            admissions: {
                'download': false,
                'update': false,
                'view': false
            },
            annalesEpreuves: {
                'download': false,
                'update': false,
                'view': false
            },
            boiteaOutils: {
                'download': false,
                'update': false,
                'view': false
            },
            communication: {
                'download': false,
                'update': false,
                'view': false
            },
            examens: {
                'download': false,
                'update': false,
                'view': false
            },
            organisation: {
                'download': false,
                'update': false,
                'view': false
            },
            programme: {
                'download': false,
                'update': false,
                'view': false
            },
            epreuvesCertification: {
                'download': false,
                'update': false,
                'view': false
            },
            archives: {
                'download': false,
                'update': false,
                'view': false
            },
            studentManagement: false
        }


        /* Check the folder permission - start */
        if (user.types) {
            for (var index = 0; index < user.types.length; index++) {
                var element = user.types[index];
                if (element.FolderPermission && element.FolderPermission[0]) {
                    for (var key in userFolderPermissions) {
                        if (userFolderPermissions.hasOwnProperty(key) && element.FolderPermission[0][key]) {
                            if (element.FolderPermission[0][key].permissions.download && !userFolderPermissions[key].download) {
                                userFolderPermissions[key].download = true;
                            }
                            if (element.FolderPermission[0][key].permissions.update && !userFolderPermissions[key].update) {
                                userFolderPermissions[key].update = true;
                            }
                            if (element.FolderPermission[0][key].permissions.view && !userFolderPermissions[key].view) {
                                userFolderPermissions[key].view = true;
                            }
                        }
                    }
                }
                if (element && element.studentManagement && !userFolderPermissions['studentManagement']) {
                    userFolderPermissions['studentManagement'] = true;
                }
            }
        }
        user.userFolderPermissions = userFolderPermissions;
        localStorage.setItem('loginuser', JSON.stringify(user));
        /* Check the folder permission - end */
    }

    socialLogin(obj) {
      return this.http.post(SocialLogin.socialLogin, obj).map( res => {
        return res.json().data;
      });
    }

    socialRegister(obj, userId, token) {
      return this.http.post(SocialLogin.socialRegister + userId + '?token=' + token, obj).map( res => {
        return res.json();
      });
    }

}
