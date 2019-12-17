export class StudentModel {
    civility: string;
    firstName: string;
    lastName: string;
    rncpTitle: string;
    photo: string;
    sex: string;

    constructor(civility: string, firstName: string, lastName: string,
            rncpTitle: string, photo: string,
            sex: string){

    this.civility = civility;
    this.firstName = firstName;
    this.lastName = lastName;
    this.rncpTitle = rncpTitle;
    this.photo = photo;
    this.sex = sex;
    }


}
