import { Location } from './location.model';

export class Company {
    id: string;
    companyName: string;
    brand: string;
    typeOfCompany: string;
    noRC: string;
    capital: string;
    activity: string;
    payroll: string;
    taxLearning: string;
    capitalType: string;
    noOfEmployeeInFrance: string;
    location: Location[];


    constructor() {
        this.companyName = "";
        this.brand = "";
        this.typeOfCompany = "";
        this.noRC = "";
        this.capital = "";
        this.activity = "";
        this.payroll = "";
        this.taxLearning = "";
        this.noOfEmployeeInFrance = "";
        this.location = [];
        this.capitalType = "";
    }
}
