import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { CustomerService } from './../customer.service';
import { Observable } from 'rxjs/Observable';
//import { schoolMdl } from '../../model/dealModel';


import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
  providers: [CustomerService]
})
export class AddSchoolComponent implements OnInit {

 // school: schoolMdl;
  errorMessage: String;
  listUt = [];
  public addSchform: FormGroup;
  items: Observable<Array<string>>;
  selectedValue: string;
  idcity: string;
  popid: string;
  popname: string;
  myid: string = null;
  myname: string = null;

  stateCtrl: FormControl;
  filteredStates: any;

  lcountry = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
		,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
		,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
		,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
		,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
		,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
		,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
		,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
		,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
		,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
		,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
		,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
		,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
		,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)"
,"Yemen","Zambia","Zimbabwe"];

  constructor(private fb: FormBuilder,
    public dialogRef: MdDialogRef<AddSchoolComponent>,
    public custService: CustomerService
    ) {

    this.addSchform = this.fb.group({
      schShortName: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      schLongName: ['', Validators.required],
      Address: ['', Validators.required],
      City: ['', Validators.required],
      Country: ['France', Validators.required],
      Title: [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      mobileNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      directLinePh: ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      Position: ['', Validators.required],
      userType: ['', Validators.required]
    })
    this.getCity();

    this.filteredStates = this.addSchform.controls.Country.valueChanges.startWith(null).map(name => this.filterCountry(name));

  }

  filterCountry(val: string) {
    return val ? this.lcountry.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : this.lcountry;
  }


  ngOnInit() {
    this.getUserType((data) => {
      console.log('data');
      console.log(data);
      this.listUt = data;
      var usertype = [];
      this.listUt.forEach(function(type) {
        usertype.push(type._id);
      });
      this.addSchform.controls['userType'].setValue(usertype);
      console.log('value list u:', this.listUt);

    });
  }

  getCity() {
    console.log('test call City')
    this.items = this.addSchform.controls.City.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      //.switchMap(term => this.dealSvc.seacrhCity(term));
      .switchMap(term => {
        console.log(term);
        const values = this.custService.seacrhCity(term);
        values.subscribe((data) => {
          if (!data || data.length === 0) {
            console.log('no data available');
          } else {

            let myid = data[0]._id;
            this.idcity = myid.toString();
          }
        });
        return values;
      })
  }

  getUserType(data) {
    this.custService.userType(data);

  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
  //   console.log(this.addSchform.value);

    const shortName = this.addSchform.controls.schShortName.value;
    const longName = this.addSchform.controls.schLongName.value;
    const address = this.addSchform.controls.Address.value;
    // const city = this.addSchform.controls.City.value;
    const city = this.idcity;
    const country = this.addSchform.controls.Country.value;
    const title = this.addSchform.controls.Title.value;
    const firstName = this.addSchform.controls.firstName.value;
    const lastName = this.addSchform.controls.lastName.value;
    const landlinePhone = this.addSchform.controls.phoneNumber.value;
    const mobilePhone = this.addSchform.controls.mobileNumber.value;
    const directPhone = this.addSchform.controls.directLinePh.value;
    const email = this.addSchform.controls.email.value;
    const position = this.addSchform.controls.Position.value;
    const userTypes = this.addSchform.controls.userType.value;
    // const specilalizations = this.addSchform.controls.specialiazations.value;
    const data = ({
      shortName, longName, address, city, country, title, firstName, lastName, landlinePhone,
      mobilePhone, directPhone, email, position, userTypes
    });
    this.custService.saveScoolQuick(data)
      .subscribe((data) => {
        let response = data.json();
        if (response.code == 400) {
          let msg = response.message;
          this.errorMessage = msg;
          console.log('message', this.errorMessage);
        }
        else {
            console.log('response.data : From School Add popup');
            console.log(response.data);
          this.myid = response.data._id;
          //this.myname = response.data.shortName;
          this.myname = longName;
          this.dialogRef.close({ popid: this.myid, popname: this.myname });
          this.addSchform.reset();
        }
        return data;
      });
   }
}
