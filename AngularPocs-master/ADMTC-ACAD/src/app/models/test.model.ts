import { Document } from './document.model';
import { ExpectedDocuments } from './expecteddocuments.model';

export class Test {
  _id: string;
  parentRNCPTitle: string;
  parentCategory: string;
  incompleteCreation: boolean;
  name: string;
  type: string;
  class: string;
  maxScore: number;
  coefficient: number;
  correctionType: string;
  organiser: string;
  dateType: string;
  groupTest: boolean;
  weight: number;
  date: string;
  controlledTest: boolean;
  linkedTests: {
    test: string,
    coefficient: number
  }[];
  schools: [{
    schoolDetails: string,
    testDate: string;
  }];
  correctionGrid: {
    orientation: string,
    header: {
      text: string,
      fields: {
        type: string,
        value: string,
        dataType: string,
        align: string
      }[]
    },
    groupDetails: {
      noOfStudents: number,
      minNoOfStudents: number,
      headerText: string
    },
    correction: {
      displayFinalTotal: boolean,
      totalZone: {
        displayAdditionalTotal: boolean,
        additionalMaxScore: number,
        decimalPlaces: number
      },
      showAsList: boolean,
      showFinalComments: boolean,
      finalCommentsHeader: string,
      showNotationsMarks: boolean,
      commentArea: boolean,
      commentsHeader: string,
      showDirectionsColumn: boolean,
      directionsColumnHeader: string,
      showNumberMarksColumn: boolean,
      numberMarksColumnHeader: string,
      showLetterMarksColumn: boolean,
      letterMarksColumnHeader: string,
      showPenalties: boolean,
      penaltiesHeader: string,
      penalties: {
        title: string,
        count: number
      }[],
      showBonuses: boolean,
      bonusesHeader: string,
      bonuses: {
        title: string,
        count: number
      }[],
      showEliminations: boolean,
      sections: {
        title: string,
        maximumRating: number,
        pageBreak: boolean,
        subSections: {
          title: string,
          maximumRating: number,
          direction: string
        }[]
      }[]
    },
    footer: {
      text: string,
      textBelow: boolean,
      fields: {
        type: string,
        value: string,
        dataType: string,
        align: string
      }[]
    }
  };
  documents: Document[];
  expectedDocuments: ExpectedDocuments[];
  subjectId: string;
  subjectTestId: string;
  calendar: {
    steps: {
      id: number,
      text: string,
      sender: string,
      actor: string,
      date: {
        type: 'relative',
        before: boolean,
        days: number
      } | {
        type: 'fixed',
        value: string
      },
      createdFrom: string
    }[]
  };
  juryMin: string;
  juryMax: string;
  addedQuestionnaire: boolean;
  questionnaire: string;
  allowReTakeExam: boolean;
  qualityControl: boolean;
  dateReTakeExam: string;
  qualityControlDifference: string;
  studentPerSchoolForQC: string;

  constructor() {
    this.addedQuestionnaire = false;

    this.incompleteCreation = true;

    this.name = '';

    this.type = '';

    this.maxScore = null;

    this.coefficient = 1;

    this.correctionType = '';

    this.organiser = '';

    this.dateType = '';

    this.date = '';

    this.groupTest = false;

    this.controlledTest = false;

    this.linkedTests = [];

    //this.schools = null;
    this.schools = [{
      schoolDetails: '',
      testDate: ''
    }];

    this.correctionGrid = {
      orientation: 'portrait',
      header: {
        text: '',
        fields: []
      },
      groupDetails: {
        noOfStudents: 3,
        minNoOfStudents: 1,
        headerText: 'Liste des élèves'
      },
      correction: {
        displayFinalTotal: true,
        totalZone: {
          displayAdditionalTotal: false,
          additionalMaxScore: 20,
          decimalPlaces: 0
        },
        showAsList: false,
        showFinalComments: false,
        finalCommentsHeader: 'Observations',
        showNotationsMarks: true,
        commentArea: false,
        commentsHeader: 'Observations',
        showDirectionsColumn: false,
        directionsColumnHeader: 'Directives',
        showNumberMarksColumn: true,
        numberMarksColumnHeader: 'Note',
        showLetterMarksColumn: false,
        letterMarksColumnHeader: 'Note',
        sections: [],
        showPenalties: false,
        penaltiesHeader: 'Pénalités',
        penalties: [],
        showBonuses: false,
        showEliminations: false,
        bonusesHeader: 'Bonus',
        bonuses: []
      },
      footer: {
        text: '',
        textBelow: false,
        fields: []
      }
    };

    this.subjectId = '';
    this.subjectTestId = '';
    this.documents = [];
    this.expectedDocuments = [];

    this.calendar = {
      steps: []
    };
    this.weight = 0;
    this.allowReTakeExam = false;
    this.dateReTakeExam = '';
  }
}
