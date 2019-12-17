export class TestCorrection {
    test: string;               //Test ID
    corrector: string;          //Corrector ID
    student: string;            //Student User ID
    status: string = 'active';
    date: Date;
    missingCopy: boolean;
    correctionGrid: {
        header: {
            fields: {
                type: string,
                label: string,
                value: string,
                dataType: string,
                align: string
            }[]
        },
        correction: {
            penalty: {
              title: string,
              rating: number
            }[],
            bonus: {
              title: string,
              rating: number
            }[],
            elimination:boolean,
            eliminationReason:string,
            total: number,
            additionalTotal: number,
            finalComments: string,
            sections: {
                title: string,
                rating: number,
                comments: string,
                subSections: {
                    title: string,
                    rating: number,
                    comments: string
                }[]
            }[]
        },
        footer: {
            fields: {
                type: string,
                label: string,
                value: string,
                dataType: string,
                align: string
            }[]
        }
    };

    constructor() {
        this.test = "";               //Test ID
        this.corrector = "";          //Corrector ID
        this.student = "";            //Student User ID
        this.status = "active";
        this.date = new Date();
        this.missingCopy = false;
        this.correctionGrid = {
            header: {
                fields: []
            },
            correction: {
                penalty: [],
                bonus: [],
                elimination:false,
                eliminationReason:'',
                total: 0,
                additionalTotal: 0,
                finalComments: '',
                sections: []
            },
            footer: {
                fields: []
            }
        };
    }
}


var demoCorrection: TestCorrection = {
    test: '',                                   //Test ID
    corrector: '59a295338f19de50821a3aac',      //Corrector ID
    student: '59a429235abfbf3d0bdca7cd',        //Student User ID
    date: new Date('12/8/2017'),
    missingCopy: false,
    status: 'active',
    correctionGrid: {
        header: {
            fields: [{
                type: 'date',
                label: 'field 1',
                value: 'abcd',
                dataType: 'text',
                align: 'left'
            }]
        },
        correction: {
            penalty:[{
              title: '',
              rating: 0
           }],
            bonus: [{
              title: '',
              rating: 0
           }],
           elimination:false,
           eliminationReason:'',
            total: 60,
            additionalTotal: 6,
            finalComments: 'xyz',
            sections: [{
                title: 'section 1',
                rating: 60,
                comments: 'no comment',
                subSections: [{
                    title: 'notation 1',
                    rating: 30,
                    comments: 'no comments'
                }, {
                    title: 'notation 2',
                    rating: 30,
                    comments: 'no comments'
                }]
            }]
        },
        footer: {
            fields: [{
                type: 'date',
                label: 'field 1',
                value: 'abcd',
                dataType: 'text',
                align: 'left'
            }]
        }
    }
};
