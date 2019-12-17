export class StudentCard {
  id: string;
  firstName:string;
  isCardSelected:false;
  sex:string;
  rncpTitle:string;
  className:string;
  lastName: string;

  constructor(id: string, firstName: string) {
    this.id = "";
    this.firstName = "";
    this.isCardSelected=false;
  }
}
