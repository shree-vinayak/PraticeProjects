import { ButtonStatus } from '../../../../shared/button-status';

class CardModel {
    isVisible: boolean;
    status: ButtonStatus;
    title: string;
    subtitle: string;
    bgColor?: string;
    constructor() {
        this.isVisible = true;
        this.status = ButtonStatus.NotOkay;
    }
}

export class CertificationtCardStatusModel {

    sendState: CardModel;
    studentDecisionState: CardModel;
    certificateState: CardModel;

    constructor() {
        this.sendState = new CardModel();
        this.studentDecisionState = new CardModel();
        this.certificateState = new CardModel();
    }

    setDefaultState() {
        this.sendState.title = 'CERTIFICATE_ISSUANCE.SENT_TO_STUDENT_SUB.TITLE';
        this.sendState.subtitle = 'CERTIFICATE_ISSUANCE.SENT_TO_STUDENT_SUB.SUBTITLE';
        this.sendState.status = ButtonStatus.NotOkay;
        this.studentDecisionState.title = 'CERTIFICATE_ISSUANCE.DETAILS_CONFIRMED';
        this.studentDecisionState.subtitle = '';
        this.studentDecisionState.status = ButtonStatus.NotOkay;
        this.studentDecisionState.bgColor = '';
        this.certificateState.title = 'CERTIFICATE_ISSUANCE.CERTIFICATE_ISSUED';
        this.certificateState.status = ButtonStatus.NotOkay;

    }

    setSentToStudentState() {
        this.setDefaultState();
        this.sendState.status = ButtonStatus.Okay;
    }

    setDetailsConfirmedState() {
        this.setDefaultState();
        this.sendState.status = ButtonStatus.Okay;
        this.studentDecisionState.status = ButtonStatus.Okay;
    }

    setDetailsNeedRevState() {
        this.setDefaultState();
        this.sendState.status = ButtonStatus.Okay;
        this.studentDecisionState.status = ButtonStatus.None;
        this.studentDecisionState.title = 'CERTIFICATE_ISSUANCE.MODIFICATION_REQUESTED.TITLE';
        this.studentDecisionState.subtitle = 'CERTIFICATE_ISSUANCE.MODIFICATION_REQUESTED.SUBTITLE';
        this.studentDecisionState.bgColor = 'red';
        this.certificateState.status = ButtonStatus.NotOkay;
    }

    setDetailsRevDoneState() {
        this.setDefaultState();
        this.sendState.status = ButtonStatus.Okay;
        this.studentDecisionState.status = ButtonStatus.None;
        this.studentDecisionState.title = 'CERTIFICATE_ISSUANCE.MODIFICATION_DONE.TITLE';
        this.studentDecisionState.subtitle = 'CERTIFICATE_ISSUANCE.MODIFICATION_DONE.SUBTITLE';
        this.studentDecisionState.bgColor = 'green';
        this.certificateState.status = ButtonStatus.NotOkay;
    }

    setCertificateIssuedtState() {
        this.setDefaultState();
        this.sendState.status = ButtonStatus.Okay;
        this.studentDecisionState.status = ButtonStatus.Okay;
        this.certificateState.status = ButtonStatus.Okay;
    }

}
