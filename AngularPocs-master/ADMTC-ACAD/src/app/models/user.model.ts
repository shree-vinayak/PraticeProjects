import { Entity } from '../models/entity.model';
import { UserTypesModel } from '../models/userTypes.model';
export class User {

    _id: string;
    entity: Entity;
    groupOfSchools?: string[];
    types: UserTypesModel[] | string[];
    // user types references array based on entity selected, multiple types allowed, but in only one entity
    lastName: string;
    firstName: string;
    sex: string; // 'M' or 'F'
    email: string;
    position: string;
    officePhone: string;      // phone number
    directLine: string;       // phone number
    portablePhone: string;    // phone number
    password: string;         // only once sent from front end at the time of user creation, not stored in database
    hashed_password: string;   // hash generated for the password
    salt: string;             // salt for password
    recovery_code: string;    // password recovery code
    assignedRncpTitles: string[];
    operationRoleType: string;
    createdBy: string;
    civility: string;
    school: string | string[];
    status: string;
    lang: string;
    authToken?: string;

    constructor() {
        this._id = '';
        this.entity = new Entity();
        this.types = [];       // user types references array based on entity selected, multiple types allowed, but in only one entity
        this.lastName = '';
        this.firstName = '';
        this.sex = '';
        this.email = '';
        this.position = '';
        this.officePhone = '';      // phone number
        this.directLine = '';       // phone number
        this.portablePhone = '';    // phone number
        this.password = '';         // only once sent from front end at the time of user creation, not stored in database
        this.hashed_password = '';   // hash generated for the password
        this.salt = '';             // salt for password
        this.recovery_code = '';    // password recovery code
        this.assignedRncpTitles = [];
        this.operationRoleType = '';
        this.createdBy = '';
        this.civility = '';
        this.school = '';
        this.status = 'active';
        this.lang = '';
    }
}
