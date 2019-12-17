import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TestCorrectionService } from '../../services/test-correction.service';
import _ from 'lodash';

@Component({
  selector: 'app-test-header-dialog',
  templateUrl: './test-header-dialog.component.html',
  styleUrls: ['./test-header-dialog.component.scss']
})
export class TestHeaderDialogComponent implements OnInit {
	public test;
	public form: FormGroup;
	testCorrect;
    today;
    currentSchoolYear;
    rncpTitle;

    constructor(private dialogRef: MdDialogRef<TestHeaderDialogComponent>,
				private dialog: MdDialog,
				private fb: FormBuilder,
                private testCorrectionService: TestCorrectionService) {
    	this.form = this.fb.group({
          });
        this.today = new Date();
        let nextYear = Number(new Date().getFullYear())+1;
        this.currentSchoolYear = new Date().getFullYear()+'-'+ nextYear;
    }

    ngOnInit() {
    	this.testCorrect = {
    		correctionGrid: {
                header: {
                  fields: []
                }
            }
        }
    	console.log("TestHeaderDialogComponent")
    	console.log(this.test);
    	let test = {};
    	let testCorrect = this.testCorrect;

    	_.forEach(this.test.correctionGrid.header.fields, function(val, key) {
            test['header'+key] = [null, Validators.required];
            testCorrect.correctionGrid.header.fields.push({
                'type': val.type,
                'label': val.value,
                'value': '',
                'dataType': val.dataType,
                'align': val.align
            });
        });
        
        this.form = this.fb.group(test);
    }
    closeDialog(object?: any) {
    	this.dialogRef.close(object);
    }
    submit(form){
    	console.log(form);
        this.testCorrectionService.addHeader(this.testCorrect.correctionGrid);
        this.closeDialog();
    }
}
