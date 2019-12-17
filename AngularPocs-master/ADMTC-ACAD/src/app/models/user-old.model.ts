export class OldUser {

  _id: string;
  userType: any;
  rncptitle: string;
  class: string;
  firstname: string;
  secondname: string;
  thirdname: string;
  familyname: string;
  sex: string;
  email: string;
  dateofbirth: string;
  placeofbirth: string;
  nationality: string;
  studentRefID: string;

  // Hr Tutor
  title: string;
  company: string;
  telephone: string;
  mobilePhone: string;

  // Corrector & Cross Corrector
  preparationCenter: string;
  lastname: string;
  acadmicTitle: string;
  resume: string;
  correctorType: string;

  //  Academis staff && Academic Administator staff
  reportTo: string;
  userRole: string;

  CRPCType: string;
  password: string;

  status: string = 'active';
  constructor() {

    this._id = "";
    this.userType = "";
    this.rncptitle = "";
    this.class = "";
    this.firstname = "";
    this.secondname = "";
    this.thirdname = "";
    this.familyname = "";
    this.sex = "";
    this.email = "";
    this.dateofbirth = "";
    this.placeofbirth = "";
    this.nationality = "";
    this.studentRefID = "";

    // hr & tutor
    this.title = "";
    this.company = "";
    this.telephone = "";
    this.mobilePhone = "";

    // Corrector & Corss Corrector
    this.preparationCenter = "";
    this.lastname = "";
    this.acadmicTitle = "";
    this.resume = "";
    this.correctorType = "";

    // Academic staff && Academic Administator staff
    this.userRole = "";
    this.userType = "";

    this.CRPCType = "";
    this.resume = "";
    this.password = "";
    this.status = 'active';
  }
}
