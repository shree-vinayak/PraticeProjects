export class NewStudentUser {
  _id: string;
  assignedRncpTitles:  Array<string>;
  entity: {
    type: string;
    school: string;
    company: null;
  };
  types: Array<string>;
  lastName: string;
  firstName: string;
  sex: string;
  operationRoleType: string;
  email: string;
  position: string;
  officePhone: string;
  directLine: string;
  portablePhone: string;
  password: string;
  hashed_password: string;
  salt: string;
  recovery_code: string;
  entityValue: string;
  createdBy: string
  civility:string;
  school: string;
  lang: string;

  constructor() {
    this._id = '';
    this.assignedRncpTitles = [];
    this.entity = {
      type: 'academic',
      school: '',
      company: null
    };
    this.types = [];
    this.lastName = '';
    this.firstName = '';
    this.sex = '';
    this.operationRoleType = 'preparation-center';
    this.email = '';
    this.position = 'student';
    this.officePhone = '';
    this.directLine = '';
    this.portablePhone = '';
    this.password = '';
    this.hashed_password = '';
    this.salt = '';
    this.recovery_code = '';
    this.entityValue = 'academic';
    this.createdBy = '';
    this.civility = '';
    this.school = '';
    this.lang = '';
  }
}
