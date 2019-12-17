export class ClassModel {
  _id: string;
  name: string;
  parentRNCPTitle: string;
  description: string;
    dateOfCertificateIssuance ?: any;
    certificateBackgroundImage ?: string;
   certifiateSignatoryName ?: string;
   signatorySignature ?: string;
   certificateImageName ?: string;
   signatoryImageName ?: string;

  constructor(name?: string, description?: string, parentRNCPTitle?: string) {
    this._id = '';
    this.name = name ? name : '';
    this.parentRNCPTitle = parentRNCPTitle ? parentRNCPTitle : '';
    this.description = description ? description : '';
  }
}
