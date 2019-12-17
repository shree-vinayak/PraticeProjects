export class Problematic {
  _id: string;
  studentId: any;
  date: Date;
  __v: number;
  status: string;
  signatureOfTheAcadDir: boolean;
  signatureOfTheCertifier: boolean;
  signatureOfTheStudent: boolean;
  generalComments: Comment[];
  question3:
    {
      _id: string;
      comments: Comment[];
      answer: string;
      question: string
    };
  question2:
    {
      _id: string;
      comments: Comment[];
      answer: string;
      question: string
    };
  question1:
    {
      _id: string;
      comments: Comment[];
      answer: string;
      question: string
    };
  problematicStatus: string;
  task ?: ProblematicTask;

  constructor() {
  }
}

export class Comment {
  comment: string;
  date:  Date;
  user: string;
}

export class ProblematicTask {
  rncp: string;
  priority: string;
  dueDate: Date;
  description: string;

  constructor(rncp){
    this.rncp = rncp;
    this.priority = "1";
    this.dueDate = new Date();
    this.description = "";
  }
}
