import { Season } from './scholerseason.model';
import { Company } from './company.model';
import { ClassModel } from './class.model';
import { Test } from './test.model';
import { TestCorrection } from './correction.model';
import { User } from './user.model';


export class Student {
  _id ?: string;
  school: string; // id
  season: Season;
  scholarSeason: any;
  rncpTitle: string; // id
  firstName: string;
  lastName: string;
  sex: string; // F/M
  email: string;
  country: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  studentRefId: string; // auto generated
  handicapped: Boolean;
  studiesFinancedBy: string;
  photo: string; // path to photo file
  telePhone: string;
  cellPhone: string;
  address: {
    line1: string,
    line2: string,
    postalCode: string,
    city: string,
    country: string
  };

  companies: [{
    company: Company, // reference to Company collection
    mentors: User; // password recovery code
    startDate: Date,
    endDate: Date,
    isActive: Boolean;
  }];

  currentClass: ClassModel; // Reference to one Class
  previousClasses: [ClassModel]; // Referene Array to Class Collection
  parents: [{
    relation: string,
    familyName: string,
    name: string,
    sex: string, // F/M
    profession: string,
    telePhone: string,
    email: string,
    address: {
      line1: string,
      line2: string,
      postalCode: string,
      city: string,
      country: string
    }
  }];
  correctedTests: [{
    test: Test, // Reference to Test
    correction: TestCorrection // Referece to Test Correction
  }];
  password: string; // only once sent from front end at the time of student registration, not stored in database
  hashed_password: string; // hash generated for the password
  salt: string; // salt for password
  recovery_code: string; // password recovery code
  parallelIntake?: boolean;
  specializations?: any;

  constructor() {
    this._id = '';
    this.school = ''; // id
    //this.mentors = new User;
    this.scholarSeason = new Season;
    this.rncpTitle = ''; // id
    this.firstName = '';
    this.lastName = '';
    this.sex = ''; // F/M
    this.email = '';
    this.country = '';
    this.dateOfBirth = new Date();
    this.placeOfBirth = '';
    this.nationality = '';
    this.studentRefId = ''; // auto generated
    this.handicapped = false;
    this.studiesFinancedBy = '';
    this.photo = ''; // path to photo file
    this.telePhone = '';
    this.cellPhone = '';
    this.previousClasses = [new ClassModel()];
    this.currentClass = new ClassModel();
    this.companies = [{
      company: new Company(),
      mentors: new User, // reference to Company collection
      startDate: new Date(),
      endDate: new Date(),
      isActive: false
    }];

    this.parents = [{
      relation: '',
      familyName: '',
      name: '',
      sex: '',
      profession: '',
      telePhone: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        postalCode: '',
        city: '',
        country: ''
      }
    }];

    this.address = {
      line1: '',
      line2: '',
      postalCode: '',
      city: '',
      country: ''
    };

    this.password = '';
  }
}
