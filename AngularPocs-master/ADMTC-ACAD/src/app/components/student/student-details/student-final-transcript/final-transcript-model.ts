import { ButtonStatus } from '../../../../shared/button-status';

class FinalTranscript {
    isVisible: boolean;
    status: ButtonStatus;
    title: string;
    subtitle: string;
}

class SchoolBoard {
    isVisible: boolean;
    status: ButtonStatus;
    title: string;
    subtitle: string;
}
class StudentDecision {
    isVisible: boolean;
    status: ButtonStatus;
    title: string;
    subtitle: string;
}
class FinalResult {
    isVisible: boolean;
    status: ButtonStatus;
    title: string;
    subtitle: string;
}

export class TranscriptModel {

    finalTranscript: FinalTranscript;
    schoolBoard: SchoolBoard;
    studentDecision: StudentDecision;
    finalResult: FinalResult;
    finalTranscriptState: string;

    constructor() {
        this.finalTranscript = new FinalTranscript();
        this.schoolBoard = new SchoolBoard();
        this.studentDecision = new StudentDecision();
        this.finalResult = new FinalResult();
    }

    setDefaultState() {
        this.finalTranscript.isVisible =
            this.schoolBoard.isVisible = true;
        this.studentDecision.isVisible =
            this.finalResult.isVisible = false;

        this.finalTranscript.status =
            this.schoolBoard.status = ButtonStatus.NotOkay;
        this.studentDecision.status =
            this.finalResult.status = null;

        this.finalTranscript.title = 'FINAL_TRANSCRIPT.TITLE';
        this.schoolBoard.title = 'FINAL_TRANSCRIPT.SCHOOL_BOARD';
        this.studentDecision.title = 'FINAL_TRANSCRIPT.STUDENT_DECIDED';
        this.finalResult.title = 'FINAL_TRANSCRIPT.FINAL_RESULT';
        this.finalTranscript.subtitle = '';
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.NOT_YET';
        this.studentDecision.subtitle = '';
        this.finalResult.subtitle = '';
    }

    setTranscriptNotSentState() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.NotOkay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.NotOkay;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.NOT_YET';
        this.studentDecision.isVisible = false;
        this.studentDecision.status = null;
        this.finalResult.isVisible = false;
        this.finalResult.status = null;
    }

    setTranscriptSentState() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.NotOkay;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.NOT_YET';
        this.studentDecision.isVisible = false;
        this.studentDecision.status = null;
        this.finalResult.isVisible = false;
        this.finalResult.status = null;
    }

    schoolBoardPass() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Pass;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.PASS';
        this.studentDecision.isVisible = false;
        this.studentDecision.status = null;
        this.finalResult.isVisible = false;
        this.finalResult.status = null;
    }
    schoolBoardFail() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Fail;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.FAIL';
        this.studentDecision.isVisible = false;
        this.studentDecision.status = null;
        this.finalResult.isVisible = false;
        this.finalResult.status = null;
    }
    schoolBoardEliminated() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Fail;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.ELIMINATED';
        this.studentDecision.isVisible = false;
        this.studentDecision.status = null;
        this.finalResult.isVisible = false;
        this.finalResult.status = null;
    }
    schoolBoardRetake() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Processing;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.studentDecision.isVisible = true;
        this.studentDecision.status = ButtonStatus.NotOkay;
        this.studentDecision.subtitle = 'FINAL_TRANSCRIPT.NOT_YET';
        this.finalResult.isVisible = true;
        this.finalResult.status = ButtonStatus.NotOkay;
    }
    studentRefuseRetake() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Processing;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.studentDecision.isVisible = true;
        this.studentDecision.status = ButtonStatus.Fail;
        this.studentDecision.subtitle = 'FINAL_TRANSCRIPT.REFUSE_RETAKE';
        this.finalResult.isVisible = true;
        this.finalResult.status = ButtonStatus.Fail;
    }
    studentAcceptRetake() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Processing;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.studentDecision.isVisible = true;
        this.studentDecision.status = ButtonStatus.Processing;
        this.studentDecision.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.finalResult.isVisible = true;
        this.finalResult.status = ButtonStatus.Processing;
    }
    studentRetakePass() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Processing;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.studentDecision.isVisible = true;
        this.studentDecision.status = ButtonStatus.Processing;
        this.studentDecision.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.finalResult.isVisible = true;
        this.finalResult.status = ButtonStatus.Pass;
        this.finalResult.subtitle = 'FINAL_TRANSCRIPT.PASS';
    }
    studentRetakeFail() {
        this.finalTranscript.isVisible = true;
        this.finalTranscript.status = ButtonStatus.Okay;
        this.schoolBoard.isVisible = true;
        this.schoolBoard.status = ButtonStatus.Processing;
        this.schoolBoard.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.studentDecision.isVisible = true;
        this.studentDecision.status = ButtonStatus.Processing;
        this.studentDecision.subtitle = 'FINAL_TRANSCRIPT.RETAKE';
        this.finalResult.isVisible = true;
        this.finalResult.status = ButtonStatus.Fail;
        this.finalResult.subtitle = 'FINAL_TRANSCRIPT.FINAL_RESULT_FAIL';

    }
}