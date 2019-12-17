import { Company } from './company.model';

export class EmployibilitySurvey {
  _id?: string;
  surveyStatus: string;
  title: string;
  directions: string;
  firstName: string;
  lastName: string;
  postalAddress: string;
  postalCode: number;
  city: string;
  cellPhone: number;
  phone: number;
  personalMail: string;
  professionalMail: string;
  parent_surnameAndFirstName: string;
  parent_completeMailingAddress: string;
  parent_cellPhone: number;
  parent_phone: number;
  parent_personalMail: string;
  parent_professionalMail: string;
  parent_profession: string;
  experience_graduated: string;
  experience_marketingExperience: string;
  experience_lastDiploma: string;
  experience_marketingExperienceYes_jobStatus: string;
  experience_marketingExperienceYes_experienceInMonths: number;
  experience_marketingExperienceYes_positionOccupied: string;
  experience_marketingExperienceYes_practicingActivity: string;
  currentSituation_currentJob: string;
  currentSituation_comments: string;
  scholarSeasonId: {
    scholarseason: string;
  };
  schoolId: {
    shortName: string;
  };
  rncpId: {
    longName: string;
    shortName: string;
    displaySurveySet2: boolean;
    employabilitySurvey: {
      isDMOE: boolean;
      isRMO: boolean;
    };
  };
  classId: {
    name: string;
  };
  studentId: {
    firstName: string;
    lastName: string;
    sex: string;
    companies: Company[];
  };

  titleOfPositionHeld: string;

  contract_startDate: string;
  contract_endDate: string;
  contract_status: string;
  contract_grossSalary: number;
  contract_comissionAnually: number;
  contract_comissionInEuros: number;
  contract_companyName: string;
  contract_companyBusinessSector: string;
  contract_companyWebsite: string;

  DMOE_Q1: string;
  DMOE_Q2: string;
  DMOE_Q3: string;
  DMOE_Q4: string;
  DMOE_Q5: string;
  DMOE_Q6: string;
  DMOE_Q7: string;
  DMOE_Q8: string;
  DMOE_Q9: string;
  DMOE_Q10: string;
  DMOE_Q11: string;
  DMOE_Q12: string;
  DMOE_Q13: string;
  DMOE_Q14: string;
  DMOE_Q15: string;
  DMOE_Q16: string;
  DMOE_Q17: string;

  RMO_Q1: string;
  RMO_Q2: string;
  RMO_Q3: string;
  RMO_Q4: string;
  RMO_Q5: string;
  RMO_Q6: string;
  RMO_Q7: string;
  RMO_Q8: string;
  RMO_Q9: string;
  RMO_Q10: string;
  RMO_Q11: string;
  RMO_Q12: string;
  RMO_Q13: string;
  RMO_Q14: string;
  rejectionDetails: [{
    date: Date,
    reason: '',
  }];
  updatedAt: any;

  constructor() {
    this._id = '';
    this.surveyStatus = '';
    this.title = '';
    this.directions = '';
    this.firstName = '';
    this.lastName = '';
    this.postalAddress = '';
    this.postalCode = 0;
    this.city = '';
    this.cellPhone = 0;
    this.phone = 0;
    this.personalMail = '';
    this.professionalMail = '';
    this.parent_surnameAndFirstName = '';
    this.parent_completeMailingAddress = '';
    this.parent_cellPhone = 0;
    this.parent_phone = 0;
    this.parent_personalMail = '';
    this.parent_professionalMail = '';
    this.parent_profession = '';
    this.experience_graduated = '';
    this.experience_marketingExperience = '';
    this.experience_marketingExperienceYes_jobStatus = '';
    this.experience_lastDiploma = '';
    this.experience_marketingExperienceYes_experienceInMonths = 0;
    this.experience_marketingExperienceYes_positionOccupied = '';
    this.experience_marketingExperienceYes_practicingActivity = '';
    this.currentSituation_currentJob = '';
    this.currentSituation_comments = '';
  }
}
