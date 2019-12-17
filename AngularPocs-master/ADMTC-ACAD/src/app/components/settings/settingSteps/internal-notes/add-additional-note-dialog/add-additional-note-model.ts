export class InternalNoteModel {
    _id?: string;
    addedNote: string;
    addedDocuments: Document[];


    constructor() {
        this._id = '';
        this.addedNote = '';
        this.addedDocuments = [];

    }
}