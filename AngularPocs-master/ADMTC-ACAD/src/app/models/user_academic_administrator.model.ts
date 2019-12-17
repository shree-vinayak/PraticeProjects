export class AcademicAdministratorUser {
    id: string;
    preparationCenter: string;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    acadmicTitle: string;
    userType: string;

    constructor() {
        this.id = "";
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.telephone = "";
        this.userType = "";
        this.preparationCenter = "";
        this.acadmicTitle = "";
    }
}
