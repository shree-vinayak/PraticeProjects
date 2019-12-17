import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { RNCPTitlesService } from '../../../../services/rncp-titles.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { Files, DownloadAnyFileOrDocFromS3 } from 'app/shared/global-urls';
import { CustomerService } from '../../../customer/customer.service';
import { TranslateService } from 'ng2-translate';
import { UtilityService } from '../../../../services';
declare var _: any;
declare var swal: any;
@Component({
  selector: 'app-subject-for-certification',
  templateUrl: './subject-for-certification.component.html',
  styleUrls: ['./subject-for-certification.component.scss'],
  providers: [DashboardService]
})
export class SubjectForCertification implements OnInit, OnChanges {
  @Input() student;
  selectedRNCPDetails;
  selectedRNCP;
  academicKit: any;
  subjects = [];
  category: any;
  certificate: boolean;
  expandedFields = {
    documents: false
  };

  constructor(
    private customerService: CustomerService,
    private translate: TranslateService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    console.log('this.selectedRNCP');
    console.log(this.selectedRNCP);
  }

  ngOnChanges() {
    this.customerService.getDocsForStudent(this.student._id, this.student.rncpTitle._id, this.student.school._id).subscribe(docs => {
      // this.documents = docs;

      this.subjects = docs.subjects;
      console.log(this.subjects);
      // docs.forEach(element => {
      //   if(element.status === "active"){
      //     this.subjects.push(element);
      //   }
      // });
    });
  }

  openDocumentDetails(doc, test?) {
    const documentName = doc.name;
    const fileName = doc.fileName;
    const filePath = doc.filePath;
    let testRetake = null;
    if (doc.uploadedForStudent && doc.uploadedForStudent.finalTranscriptId && doc.uploadedForStudent.finalTranscriptId.retakeTestsForStudents && !doc.uploadedForStudent.finalTranscriptId.hasJuryFinallyDecided) {
      testRetake = _.find(doc.uploadedForStudent.finalTranscriptId.retakeTestsForStudents, {'testId': test._id});
    }

    if (testRetake && (this.utilityService.checkUserIsAcademicDirector() || this.utilityService.checkUserIsFromGroupOfSchools() || this.utilityService.checkUserIsStudent())) {
      this.checkIfResultAndDocAccesible();
    } else if (
      test &&
      ( test.correctionType === 'pc' || test.correctionType === 'cp' )  &&
      (this.utilityService.checkUserIsAcademicDirector() ||
      this.utilityService.checkUserIsStudent() ||
      this.utilityService.checkUserIsFromGroupOfSchools()) &&
      !this.checkIfStudentValidated()
    ) {
      if (doc.uploadedForStudent && doc.uploadedForStudent.finalTranscriptId && doc.uploadedForStudent.finalTranscriptId.retakeTestsForStudents && !doc.uploadedForStudent.finalTranscriptId.hasJuryFinallyDecided) {
        this.checkIfResultAndDocAccesible();
      } else {
        this.openDocument(doc, filePath, fileName);
      }
    } else {
      this.openDocument(doc, filePath, fileName);

    }
  }

  openDocument(doc, filePath, fileName) {
    const a = document.createElement('a');
    a.target = '_blank';
    if (doc.storedInS3) {
      a.href = DownloadAnyFileOrDocFromS3.download + doc.S3FileName;
    } else {
      a.href = Files.url + filePath;
    }
    a.download = fileName;
    window.open(a.href, '_blank');
  }

  checkIfStudentValidated(): boolean {
    return this.student.finalTranscriptId && this.student.finalTranscriptId.isValidated;
  }

  openTestDetails(test) {
    if (test.isPFE && (this.utilityService.checkUserIsAcademicDirector() ||
    this.utilityService.checkUserIsStudent() ||
    this.utilityService.checkUserIsFromGroupOfSchools())) {
      this.checkIfResultAndDocAccesible();
    } else if (
      ( test.correctionType === 'pc' || test.correctionType === 'cp' )  &&
      (this.utilityService.checkUserIsAcademicDirector() ||
      this.utilityService.checkUserIsStudent() ||
      this.utilityService.checkUserIsFromGroupOfSchools())
    ) {
      this.checkIfResultAndDocAccesible();
    }
  }

  getExpectedDocuments(documents) {
    const docs = _.filter(documents, function(d) {
      return d.documentType === 'documentExpected';
    });
    return this.sortDocsBasedOnStudentLastName(docs);
  }

  getDocumentsUnderResult(documents) {
    const filteredDocs = _.filter(documents, function(d) {
      return d.documentType === 'StudentTestCorrection';
    });
    return _.sortBy(filteredDocs, function(d) {
      if (d.uploadedForStudent) {
        return d.uploadedForStudent.lastName.toLowerCase();
      } else {
        return d.uploadedForGroup.name.toLowerCase();
      }
    });
  }

  sortDocsBasedOnStudentLastName(docs) {
    return _.sortBy(docs, function(d) {
      if (d.uploadedForStudent) {
        return d.uploadedForStudent.lastName.toLowerCase();
      } else {
        return d.uploadedForGroup.name.toLowerCase();
      }
    });
  }
  checkIfResultAndDocAccesible() {
    swal({
      title: this.translate.instant(
        'CrossCorrection.CROSSCORRECTION_NOT_ACCESSIBLE.title'
      ),
      html: this.translate.instant(
        'CrossCorrection.CROSSCORRECTION_NOT_ACCESSIBLE.text'
      ),
      allowEscapeKey: true,
      type: 'warning',
      confirmButtonText: this.translate.instant(
        'CrossCorrection.CROSSCORRECTION_NOT_ACCESSIBLE.button'
      )
    });
  }

}
