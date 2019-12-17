import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TestCorrectionService } from '../../services/test-correction.service';
import _ from 'lodash';

@Component({
  selector: 'app-test-footer-dialog',
  templateUrl: './test-footer-dialog.component.html',
  styleUrls: ['./test-footer-dialog.component.scss']
})
export class TestFooterDialogComponent implements OnInit {
	public test;
	public form: FormGroup;
	testCorrect;
    constructor(private dialogRef: MdDialogRef<TestFooterDialogComponent>,
				private dialog: MdDialog,
				private fb: FormBuilder,
                private testCorrectionService: TestCorrectionService) {
    	this.form = this.fb.group({
          });
    }

    ngOnInit() {
    	this.testCorrect = {
    		footer: {
              fields: []
            }
        }
    	console.log(this.test);
    	let test = {};
    	let testCorrect = this.testCorrect;

    	_.forEach(this.test.correctionGrid.footer.fields, function(val, key) {
            test['footer'+key] = [null, Validators.required];
            testCorrect.footer.fields.push({
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
        this.testCorrectionService.addFooter(this.testCorrect);
        this.closeDialog();
    }
}
