import {UtilityService} from '../../../../services';

export default class ProblematicFormModel {
  public enableAnswer: Boolean;
  public enableComment: Boolean;
  public enableAllComments: Boolean;
  public enableStudentSign: Boolean;
  public enableAcadDirSign: Boolean;
  public enableCertifierSign: Boolean;
  public showAcadDirSign: Boolean;
  public showCertifierSign: Boolean;
  public showSendButton: Boolean;
  public showSaveButton: boolean;
  public showValidateButton: Boolean;
  public showForm: Boolean;
  public enableButtons: Boolean;
  public hideReject: Boolean;

  constructor() {
    this.setDefault();
  }

  setDefault(): void {
    this.enableAnswer = false;
    this.enableComment = false;
    this.enableAllComments = false;
    this.enableStudentSign = false;
    this.enableAcadDirSign = false;
    this.showCertifierSign = false;
    this.showAcadDirSign = false;
    this.enableCertifierSign = false;
    this.showSendButton = false;
    this.showSaveButton = false;
    this.showValidateButton = false;
    this.showForm = false;
    this.enableButtons = false;
    this.hideReject = false;
  }

  update(userRole: String, formStatus: String): void {
    this.setDefault();
    this.showForm = true;
    console.log(userRole);
    console.log('************************************8');
    switch (userRole) {
      case 'student':
        if (
          formStatus === 'sent_to_student' ||
          formStatus === 'rejected_by_acadDpt' ||
          formStatus === 'rejected_by_certifier'
        ) {
          this.enableAnswer = true;
          this.enableStudentSign = true;
          this.showSendButton = true;
          this.showSaveButton = true;
        } else if (formStatus === 'validated_by_certifier') {
          this.enableAnswer = true;
          this.showSaveButton = true;
        }
        break;
      case 'certifier':
        this.showCertifierSign = true;
        if (
          formStatus === 'sent_to_certifier' ||
          formStatus === 'resubmitted_to_certifier'
        ) {
          this.enableCertifierSign = true;
          this.enableComment = true;
          this.showAcadDirSign = true;
          this.showValidateButton = true;
        } else if (formStatus === 'rejected_by_certifier') {
          this.showAcadDirSign = true;
        } else if (formStatus === 'validated_by_certifier') {
          this.enableAnswer = true;
          this.enableAllComments = true;
          this.showSaveButton = true;
        }
        break;
      case 'acadDir':
        this.showAcadDirSign = true;
        if (
          formStatus === 'sent_to_acadDpt' ||
          formStatus === 'resubmitted_to_acadDpt'
        ) {
          this.enableAcadDirSign = true;
          this.showValidateButton = true;
        } else if (formStatus === 'validated_by_certifier') {
          this.enableAnswer = true;
          this.enableAllComments = true;
          this.showSaveButton = true;
        }
        break;
      case 'admtc':
        this.showAcadDirSign = true;
        if (
          formStatus === 'sent_to_student' ||
          formStatus === 'rejected_by_acadDpt' ||
          formStatus === 'rejected_by_certifier'
        ) {
          this.enableAnswer = true;
          this.enableStudentSign = true;
          this.showSendButton = true;
          this.showSaveButton = true;
        } else if (
          formStatus === 'sent_to_acadDpt' ||
          formStatus === 'resubmitted_to_acadDpt'
        ) {
          this.enableAcadDirSign = true;
          this.showValidateButton = true;
        } else if (
          formStatus === 'sent_to_certifier' ||
          formStatus === 'resubmitted_to_certifier'
        ) {
          this.enableCertifierSign = true;
          this.enableComment = true;
          this.showAcadDirSign = true;
          this.showValidateButton = true;
        } else if (formStatus === 'rejected_by_certifier') {
          this.showAcadDirSign = true;
        } else if (formStatus === 'validated_by_certifier') {
          this.enableAnswer = true;
          this.enableAllComments = true;
          this.showSaveButton = true;
        }
        break;
      case 'Corrector-of-Problematic': {
        this.showCertifierSign = true;
        if (
          formStatus === 'sent_to_certifier' ||
          formStatus === 'resubmitted_to_certifier'
        ) {
          this.enableCertifierSign = true;
          this.enableComment = true;
          this.showAcadDirSign = true;
          this.showValidateButton = true;
        } else if (formStatus === 'rejected_by_certifier') {
          this.showAcadDirSign = true;
        } else if (formStatus === 'validated_by_certifier') {
          this.enableAnswer = true;
          this.enableAllComments = true;
          this.showSaveButton = true;
        }
        break;
      }
      default:
        break;
    }
  }
}
