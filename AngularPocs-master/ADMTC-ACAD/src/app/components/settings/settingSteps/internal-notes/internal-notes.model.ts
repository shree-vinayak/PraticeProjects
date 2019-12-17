export class InternalNoteModel {
    _id?: string;
    date: Date;
    creator: string;
    rncpTitle: string;
    classId: string;
    school: string;
    test: string;
    userType: string;
    user: string;
    student: string;
    noteTitle: string;
    noteBody: string;
    additionalNote: string;
    documents: Document[];
    status: string;

    constructor() {
        this._id = '';
        this.date = new Date();
        this.rncpTitle = '';
        this.classId = '';
        this.school = '';
        this.test = '';
        this.userType = '';
        this.user = '';
        this.student = '';
        this.noteTitle = '';
        this.noteBody = '';
        this.additionalNote = '';
        this.status = '';
        this.documents = [];
    }
}