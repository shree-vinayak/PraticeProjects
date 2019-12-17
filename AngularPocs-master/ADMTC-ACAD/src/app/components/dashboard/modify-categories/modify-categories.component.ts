import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AddCategoryDialogComponent } from '../../../dialogs/add-category-dialog/add-category-dialog.component';
import { AddDocumentDialogComponent } from '../../../dialogs/add-document-dialog/add-document-dialog.component';
import { TestDetailsDialogComponent } from '../../../dialogs/test-details-dialog/test-details-dialog.component';
import { DocumentDetailsDialogComponent } from '../../../dialogs/document-details-dialog/document-details-dialog.component';
import { TranslateService } from 'ng2-translate';
import { RNCPTitlesService } from '../../../services/rncp-titles.service';
import { Router } from '@angular/router';
import { Category } from '../../../models/category.model';
import { MoveItemDialogComponent } from '../../../dialogs/move-item-dialog/move-item-dialog.component';
import { TestService } from '../../../services/test.service';
import { Test } from '../../../models/test.model';
import { AcademicKitService } from '../../../services/academic-kit.service';
import _ from 'lodash';
import { Document } from '../../../models/document.model';

declare var swal: any;
declare var _: any;

@Component({
    selector: 'app-modify-categories',
    templateUrl: './modify-categories.component.html',
    styleUrls: ['./modify-categories.component.scss']
})
export class ModifyCategoriesComponent implements OnInit {
    selectedCategory: Category;
    @Input('selectedCategoryIdToModify') selectedCategoryIdToModify: string;
    @Input('rncpTitle') rncpTitle: any;
    @Output() updateKit = new EventEmitter<boolean>();
    ////////////////////////////////////////////////////////

    // new code
    @Input('positionStack') positionStack: number[];
    selectedIndex = 0;

    academicKit: any;
    rncpTitleID: string;

    configCat: MdDialogConfig = {
        disableClose: false,
        width: '400px'
    };
    configDoc: MdDialogConfig = {
        disableClose: false,
        width: '600px',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };
    configDocDetails: MdDialogConfig = {
        disableClose: false,
        width: '600px'
    };
    configTest: MdDialogConfig = {
        disableClose: false,
        width: '600px',
        height: '80%',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };
    configMove: MdDialogConfig = {
        // disableClose: true,
        width: '50%',
        height: '80%'
    };

    addCategoryDialog: MdDialogRef<AddCategoryDialogComponent>;
    addDocumentDialog: MdDialogRef<AddDocumentDialogComponent>;
    documentDetailsDialog: MdDialogRef<DocumentDetailsDialogComponent>;
    testDetailsDialog: MdDialogRef<TestDetailsDialogComponent>;
    moveItemsDialog: MdDialogRef<MoveItemDialogComponent>;

    constructor(private translate: TranslateService,
        private appService: RNCPTitlesService,
        private acadService: AcademicKitService,
        private router: Router,
        private dialog: MdDialog,
        private testService: TestService) {

    }

    ngOnInit() {
        this.appService.getSelectedRncpTitle().subscribe(title => {
            this.rncpTitleID = title._id;
            this.acadService.getAcademicKit().subscribe(kit => {
                this.academicKit = kit;
                // this.academicKit.categories = this.academicKit.categories.sort((a, b) => a.sortOrder - b.sortOrder);
                // console.log(this.academicKit.categories);
                // console.log(this.positionStack);
                // this.automate();
            });
        });

    }

    // automate() {
    //     // this.positionStack[0];
    //     const categories = this.academicKit.categories;
    //     const newDocument = new Document(this.rncpTitleID, 'Test Document', 'guideline', 'demo/path', 'demo.txt');
    //     const newTest = new Test();
    //     if (this.positionStack.length) {
    //         let cat = categories[this.positionStack[0]];
    //         for (var i = 1; i <= this.positionStack.length - 1; i++) {
    //             cat = cat.subCategories[this.positionStack[i]];
    //         }
    //         newDocument.parentCategory = cat._id;
    //         this.acadService.addDocument(newDocument).subscribe(d => {
    //             if (d) {
    //                 cat.documents.push(d);
    //             }
    //         });
    //         // return cats.tests;
    //     }
    // }

    openCategory(category, index: number) {
      console.log(category);
      this.selectedCategory = category;
      let parentCategory: Category = this.getCurrentCategory();
      const i = _.findIndex(parentCategory.subCategories, {'_id': category._id});
      this.positionStack.push(i);
    }

    getCurrentPathArray() {

        let pathArray = [this.translate.instant('DASHBOARD.CATEGORIES')];
        if (this.positionStack.length) {
            let cats = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];
            pathArray.push(cats.title);
            for (var i = 1; i <= this.positionStack.length - 1; i++) {
                cats = cats.subCategories[this.positionStack[i]];
                if (cats) {
                    pathArray.push(cats.title);
                }
            }
        }
        return pathArray;
    }

    goUp() {
        this.positionStack.pop();
    }

    goTo(index: number) {
        this.positionStack = this.positionStack.slice(0, index);
    }

    getCurrentCategory() {
        // this.academicKit.categories = this.academicKit.categories
        //     .sort(
        //     (cateA, cateB) => {
        //         if (cateA.title < cateB.title) {
        //             return -1;
        //         }
        //         if (cateA.title > cateB.title) {
        //             return 1;
        //         }
        //         return 0;
        //     });

        if (this.positionStack.length) {
            let cats = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];;
            for (let i = 1; i <= this.positionStack.length - 1; i++) {
                cats = cats.subCategories[this.positionStack[i]];
            }
            return cats;
        } else {
            return null;
        }
    }

    getCurrentCategories() {
        if (this.positionStack.length) {
            let cats = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];
            for (var i = 1; i <= this.positionStack.length - 1; i++) {
                cats = cats.subCategories[this.positionStack[i]];
            }
            // cats.subCategories = cats.subCategories.sort(
            //     (cateA, cateB) => {
            //         if (cateA.title < cateB.title) {
            //             return -1;
            //         }
            //         if (cateA.title > cateB.title) {
            //             return 1;
            //         }
            //         return 0;
            //     });
            return cats && cats.subCategories ? cats.subCategories : [];
        } else {
            // this.academicKit.categories = this.academicKit.categories.sort(
            //     (cateA, cateB) => {
            //         if (cateA.title < cateB.title) {
            //             return -1;
            //         }
            //         if (cateA.title > cateB.title) {
            //             return 1;
            //         }
            //         return 0;
            //     });
            return this.academicKit && this.academicKit.categories ? this.academicKit.categories : [];
        }
    }

    getCurrentDocuments() {
        if (this.positionStack.length) {
            let cats = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];
            for (var i = 1; i <= this.positionStack.length - 1; i++) {
                cats = cats.subCategories[this.positionStack[i]];
            }
            return cats.documents;
        } else {
            return [];
        }
    }

    getCurrentTests() {
        if (this.positionStack.length) {
            let cats = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];;
            for (var i = 1; i <= this.positionStack.length - 1; i++) {
                cats = cats.subCategories[this.positionStack[i]];
            }
            return cats.tests;
        } else {
            return [];
        }
    }

    addNewCategory() {
        const categories = this.academicKit.categories;
        this.addCategoryDialog = this.dialog.open(AddCategoryDialogComponent, this.configCat);
        this.addCategoryDialog.afterClosed().subscribe((value) => {
            if (value instanceof Category) {
                const newCat = value;
                if (this.positionStack.length) {
                    let cat = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];;
                    for (var i = 1; i <= this.positionStack.length - 1; i++) {
                        cat = cat.subCategories[this.positionStack[i]];
                    }
                    newCat.parentCategory = cat._id;
                    newCat.parentRNCPTitle = this.rncpTitleID;
                    this.acadService.addCategory(newCat).subscribe(c => {
                        this.selectedIndex = 0;
                        cat.subCategories.push(c);
                      this.updateKit.emit(true);
                    });
                //  this.updateKit.emit(true);
                    // return cats.tests;
                } else {
                    this.acadService.addCategory(newCat).subscribe(c => {
                        categories.push(c);
                      this.updateKit.emit(true);
                    });
                  // this.updateKit.emit(true);
                    // return [];
                }
                // this.appService.updateSelectedRncpTitle();
            }
        //  this.updateKit.emit(true);
        });
    //  this.updateKit.emit(true);
    }

    removeCategory() {
        swal({
            title: 'Attention',
            html: `<p>` + this.translate.instant('DASHBOARD.MESSAGES.CONFIRMREMOVEFOLDER')
                + `? </p><p>` + this.getCurrentCategory().title + `</p><p>` +
                this.translate.instant('DASHBOARD.MESSAGES.CONTENTSWILLBEREMOVED') + `</p>`,
            type: 'question',
            showCancelButton: true,
            allowEscapeKey:true,
            cancelButtonText: this.translate.instant('NO'),
            confirmButtonText: this.translate.instant('YES')
        }).then(() => {
            // let category: Category = this.getCurrentCategory();
            const category = this.selectedCategory;
            const i = this.positionStack.pop();
            let parentCategory: Category = this.getCurrentCategory();
            if (parentCategory) {
                this.acadService.removeCategory(category).subscribe(status => {
                    if (status) {
                      parentCategory.subCategories = _.filter(parentCategory.subCategories, (c) => c._id !== category._id);
                      // parentCategory.subCategories.splice(index, 1);
                    }
                });
            } else {
                // console.log("Delete");
                this.acadService.removeCategory(category).subscribe(status => {
                    // console.log("Response ");
                    if (status) {
                      this.academicKit.categories = _.filter(this.academicKit.categories, (c) => c._id !== category._id);
                      // const index = this.academicKit.categories.findIndex((c) => c._id === category._id);
                      // this.academicKit.categories.splice(index, 1);
                    }
                });
            }
        //  this.updateKit.emit(true);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
            }
        });
      this.updateKit.emit(true);
    }

    modifyCategory() {
        let currentCat = this.getCurrentCategory();
        this.addCategoryDialog = this.dialog.open(AddCategoryDialogComponent, this.configCat);
        this.addCategoryDialog.componentInstance.modify = true;
        this.addCategoryDialog.componentInstance.category = currentCat;
        this.addCategoryDialog.afterClosed().subscribe(category => {
            this.acadService.updateCategory(category).subscribe(cat => {
                if (cat) {
                    Object.assign(currentCat, category);
                    swal({
                        title:'Success',
                        text:this.translate.instant('DASHBOARD.MESSAGES.MODIFYCATEGORYSUCCESS'),
                        allowEscapeKey:true,
                        type:'success'
                    });
                } else {
                    swal({
                        title:'Attention',
                        text: this.translate.instant('DASHBOARD.MESSAGES.MODIFYCATEGORYERROR'),
                        allowEscapeKey:true,
                        type:'warning'
                    });
                }

            });
          this.updateKit.emit(true);
        });
    }

    moveCategory() {
        this.moveItemsDialog = this.dialog.open(MoveItemDialogComponent, this.configMove);
        this.moveItemsDialog.componentInstance.itemtype = 'category';
        // console.log(this.positionStack);
        this.moveItemsDialog.componentInstance.folderPosition = [...this.positionStack];
        let pos = this.positionStack.pop();
        this.moveItemsDialog.afterClosed().subscribe(function (status) {
            if (status) {
                // console.log(status.stack);
                this.positionStack = status.stack;
            } else {
                this.positionStack.push(pos);
            }
        }.bind(this));
      this.updateKit.emit(true);
    }

    addNewDocument() {
        const categories = this.academicKit.categories;
        console.log(categories[this.positionStack[0]]);
        this.addDocumentDialog = this.dialog.open(AddDocumentDialogComponent, this.configDoc);
        this.addDocumentDialog.afterClosed().subscribe((value) => {
            if (value) {
                console.log(value);
                const newDocument = value;
                if (this.positionStack.length) {
                    let cat = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : categories[this.positionStack[0]];
                    for (let i = 1; i <= this.positionStack.length - 1; i++) {
                        cat = cat.subCategories[this.positionStack[i]];
                    }
                    newDocument.parentCategory = cat._id;
                    newDocument.parentRNCPTitle = this.rncpTitleID;
                    this.acadService.addDocument(newDocument).subscribe(d => {
                        if (d) {
                            console.log(d);
                            this.selectedIndex = 1;
                            cat.documents.push(d);
                        }
                    });
                    // return cats.tests;
                } else {
                    // return [];
                }
                // this.appService.updateSelectedRncpTitle();
            }
            this.updateKit.emit(true);
        });
    }

    addNewTest() {
        console.log("Pos Stack : ", this.positionStack);
        this.acadService.setTestStack(this.positionStack);
        this.testService.updateNewTest(new Test());
        this.router.navigate(['/create-test']);
    }

    openDocumentDetailsDialog(document: any, index: number) {
        const stack = [...this.positionStack, index];
        this.documentDetailsDialog = this.dialog.open(DocumentDetailsDialogComponent, this.configDocDetails);
        this.documentDetailsDialog.componentInstance.document = document;
        this.documentDetailsDialog.componentInstance.category = this.selectedCategoryIdToModify ? this.academicKit.categories.find( c => c._id === this.selectedCategoryIdToModify) : this.academicKit.categories[this.positionStack[0]];;
        this.documentDetailsDialog.componentInstance.positionStack = stack;
        this.documentDetailsDialog.afterClosed().subscribe( (status) => {
            if (status) {
                if (status.stack) {
                    status.stack.pop();
                    this.positionStack = status.stack;
                }
                this.updateKit.emit(true);
            }
        });
    }

    openTestDetailsDialog(test: any, index: number) {
        const stack = [...this.positionStack, index];
        this.testDetailsDialog = this.dialog.open(TestDetailsDialogComponent, this.configTest);
        this.testDetailsDialog.componentInstance.test = test;
        this.testDetailsDialog.componentInstance.positionStack = stack;
        this.testDetailsDialog.afterClosed().subscribe((status) => {
            // console.log(status);
            if (status) {
                if (status.type === 'move') {
                    status.stack.pop();
                    console.log(status.stack);
                    this.positionStack = status.stack;
                } else if (status.type === 'edit') {
                    status.stack.pop();
                    this.positionStack = status.stack;
                    this.router.navigateByUrl('/create-test');
                }
            }
          // this.updateKit.emit(true);
        });
    }


    ////////////////////////////////////////////////////////
    /*Check is basic folder structre */
    isNotBasicStructure() {
        const cat = this.getCurrentCategory();
        const channelArray = ['01. ADMISSIONS', '02. ANNALES EPREUVES', '03. BOITE A OUTILS', '04. ORGANISATION', '05. PROGRAMME', '06. EPREUVES DE LA CERTIFICATION', '07. ARCHIVES', 'COMMUNICATION'];
        if (cat && cat.title) {
            if (channelArray.indexOf(cat.title) === -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }


}
