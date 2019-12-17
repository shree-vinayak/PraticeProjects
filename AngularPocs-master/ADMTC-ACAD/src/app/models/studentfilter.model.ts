export class StudentFilter {
  lastName: string;
  rncpTitle: string;
  currentClass: string;
  schoolId: string;
  registrationStatus ?: string;
  constructor() {
    this.lastName = '';
    this.rncpTitle = '';
    this.currentClass = '';
    this.schoolId = '';
  }
}
