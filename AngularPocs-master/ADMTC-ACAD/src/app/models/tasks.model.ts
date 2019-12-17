export class Tasks {

  _id: string;
  rncp: any;
  assignedTo: string;
  createdBy: any;
  createdDate: string;
  priority: string;
  dueDate: string;
  description: string;
  taskStatus: string;
  status: string;
  comments: string;
  actionTaken: string;
  sortName?: string;
  test: {
    date: string,
    name: string,

    subjectId: {
      _id: string,
      subjectName: string
    }
  };
  userSelection: {
    name: string,
    selectionType: string,
    userTypeId?: {
      _id: '',
      name: ''
    },
    userId?: {
      _id: string,
      firstName: string,
      lastName: string
    },
    testGroupId?: {
      _id: '',
      name: ''
    },
  };
  lang: string;
  type?: string;
  documentExpected?: any;

  //constructor(_id: string, rncptitle: string, assignTo: string, createdBy: string, createdDate: string, priority: string, dueDate: string, description: string, status:string) {
  constructor() {
    this._id = '';
    this.rncp = null;
    this.assignedTo = '';
    this.createdBy = null;
    this.createdDate = '';
    this.priority = '';
    this.dueDate = '';
    this.description = '';
    this.status = '';
    this.taskStatus = '';
    this.actionTaken = '';
    this.comments = '';
    this.sortName = '';
    // this.test = {
    //   date: '',
    //   name: '',
    //   subjectId: {
    //     _id: '',
    //     subjectName: ''
    //   }
    // };
    this.userSelection = {
      name: '',
      selectionType: '',
      userTypeId: {
        _id: '',
        name: ''
      },
      userId: {
        _id: '',
        firstName: '',
        lastName: ''
      }
    };
    this.lang = '';
    //this._id = _id;
    //this.rncp = rncptitle;
    //this.assignTo = assignTo;
    //this.createdBy = createdBy;
    //this.createdDate = createdDate;
    //this.priority = priority;
    //this.dueDate = dueDate;
    //this.description = description;
    //this.status = status

  }
}
