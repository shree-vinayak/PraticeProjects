export class AcademicStaffUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    mobilePhone: string;
    reportTo: string;
    userRole: string;
    userType: string;

    constructor() {
        this.id = "";
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.telephone = "";
        this.mobilePhone = "";
        this.reportTo = "";
        this.userRole = "";
        this.userType = "";
    }
}
