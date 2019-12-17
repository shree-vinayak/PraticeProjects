export const QuestionnaireConsts = {

    fieldTypes: [
        {
          value: 'date',
          view: 'Date'
        },
        {
          value: 'text',
          view: 'Text'
        },
        {
          value: 'number',
          view: 'Number'
        },
        {
          value: 'pfereferal',
          view: 'PFE Referal'
        },
        {
          value: 'jurymember',
          view: 'Jury Member'
        },
        {
          value: 'longtext',
          view: 'Long Text'
        },
        {
          value: 'signature',
          view: 'Signature'
        },
        {
          value: 'correctername',
          view: 'Corrector Name'
        }
      ],
      requiredFieldsTypes: [
        {
          value: 'eventName',
          view: 'Name of the Event',
          type: 'text',
          removed: false
        },
        {
          value: 'dateRange',
          view: 'Date Range',
          type: 'date',
          removed: false
        },
        {
          value: 'dateFixed',
          view: 'Date Fixed',
          type: 'date',
          removed: false
        },
        {
          value: 'titleName',
          view: 'Title Name',
          type: 'text',
          removed: false
        },
        {
          value: 'status',
          view: 'Status',
          type: 'text',
          removed: false
        }
      ],
    
      questionnaireFields: [
        'STUDENT_CIVILITY',
        'STUDENT_FIRST_NAME',
        'STUDENT_LAST_NAME',
        'STUDENT_ADDR_1',
        'STUDENT_ADDR_2',
        'STUDENT_POSTAL_CODE',
        'STUDENT_CITY',
        'STUDENT_COUNTRY',
        'STUDENT_MOBILE',
        'STUDENT_FIX_PHONE',
        'STUDENT_PERSONAL_EMAIL',
        'STUDENT_DIPLOMA',
        'PARENT_RELATION',
        'PARENT_CIVILITY',
        'PARENT_FIRST_NAME',
        'PARENT_LAST_NAME',
        'PARENT_ADDR_1',
        'PARENT_ADDR_2',
        'PARENT_POSTAL_CODE',
        'PARENT_CITY',
        'PARENT_COUNTRY',
        'PARENT_MOBILE',
        'PARENT_JOB',
        'PARENT_PERSONAL_EMAIL',
        'PARENT_PROFESSIONAL_EMAIL'
      ],

      questionAnswerTypes: [
        {name: 'NUMERIC', key: 'numeric'},
        {name: 'DATE', key: 'date'},
        {name: 'FREE_TEXT', key: 'freeText'},
        {name: 'SINGLE_OPTION', key: 'singleOption'},
        {name: 'MULTIPLE_OPTION', key: 'multipleOption'},
        {name: 'EMAIL', key: 'email'},
        {name: 'PARENT_AND_CHILD', key: 'parentChild'},
      ]
}
