export class Questionnaire {
  questionnaireName: string;
  _id: string;
  questionnaireType: string;
  createdBy: string;
  competence: [
    {
      _id: string,
      competenceName: string,
      sortOrder: number,
      segment: [{
        _id: string,
        segmentName: string,
        sortOrder: number,
        question: [{
          _id: string,
          isAnswerRequired: boolean,
          questionnaireFieldKey: string,
          isField: boolean,
          questionName: string,
          questionType: string,
          options: any,
          answer: any
        }
        ]
      }]
    }
  ];

  questionnaireGrid: {
    orientation: string,
    header: {
      title: string,
      text: string,
      direction: string,
      fields: {
        type: string,
        value: string,
        dataType: string,
        align: string
      }[]
    },
    correction: {
      showAsList: boolean,
      showFinalComments: boolean,
      finalCommentsHeader: string,
      showNotationsMarks: boolean,
      commentArea: boolean,
      commentsHeader: string,
      showDirectionsColumn: boolean,
      directionsColumnHeader: string,
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
  constructor() {
    this.questionnaireName = '';
    this.questionnaireType = '';
    this.createdBy = '';
    this.questionnaireGrid = {
      orientation: 'portrait',
      header: {
        title: '',
        text: '',
        direction: '',
        fields: []
      },
      correction: {
        showAsList: false,
        showFinalComments: false,
        finalCommentsHeader: 'Observations',
        showNotationsMarks: true,
        commentArea: false,
        commentsHeader: 'Observations',
        showDirectionsColumn: false,
        directionsColumnHeader: 'Directives',
        sections: []
      },
      footer: {
        text: '',
        textBelow: false,
        fields: []
      }
    };
    this.competence = [
      {
        _id: '',
        competenceName: '',
        sortOrder: 1,
        segment: [{
          _id: '',
          segmentName: '',
          sortOrder: 1,
          question: [{
            _id: '',
            isAnswerRequired: false,
            questionnaireFieldKey: '',
            isField: false,
            questionName: '',
            questionType: '',
            options: [],
            answer: ''
          }]
        }]
      }
    ];
  }
}
