export class UserFilter {
  userName: string;
  rncpTitle: string;
  userType: string;
  schoolId: string;
  searchBy: string;
  userStatus?: string;

  constructor() {
    this.userName = '';
    this.rncpTitle = '';
    this.userType = '';
    this.schoolId = '';
    this.searchBy = '';
    this.userStatus = '';
  }
}
