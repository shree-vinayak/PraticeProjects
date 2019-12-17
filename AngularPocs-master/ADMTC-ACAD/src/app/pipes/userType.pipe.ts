import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/users.service';

@Pipe({
    name: 'UserTypePipe',
})

export class UserTypePipe implements PipeTransform {
    RNCPTitles: any = [];
    userTypes: any = [];
    rncpTitles: any = [];
    preparationCenter: any = [];
    users: any = [];
    constructor(private service: UserService) {
        // this.service.getAllUserTypes(null).subscribe((response) => {
        //    this.userTypes = response;
        // });


        this.service.getUserTypesByEntities(null).subscribe((response) => {
            this.userTypes = response;
        });

        this.service.getAllUser().subscribe((response) => {
            this.users = response.data;
        });

        // this.service.getAllRNCPTitles().subscribe((response) => {
        //    this.rncpTitles = response;
        // });
        this.service.getAllRNCPTitles().subscribe((response) => {
            this.RNCPTitles = response.data;
        });

        this.service.getAllPreparationCenter().subscribe((response) => {
            this.preparationCenter = response.data;
        })



        // this.schools = this.service.getAllPreparationCenter();
    }

    transform(value: any, args: string[]): string {
        if (!value) { return value; };
        if (args.toString() === 'usertype') {
            let result = '';

            for (let i = 0; i < value.length; i++) {
                if (i < value.length - 1) {
                    result += value[i].name + '  -  ';
                } else {
                    result += value[i].name;
                }
                // debugger;
                // for (let user of this.userTypes) {
                //    if (user._id === value[i]._id) {
                //        result += user.name + ",";
                //    }
                // }
            }
            // for (let en of value) {
            //    for (let user of this.userTypes) {
            //        if (user._id === en._id) {
            //            result += user.name + ",";
            //        }
            //    }
            // }
            return result.substring(0, result.length - 1);
            // for (let en of this.userTypes) {
            //    if (en.id === value) {
            //        return en.Name;
            //    }
            // }
        }
        if (args.toString() === 'rncp') {
            for (const en of this.RNCPTitles) {
                if (en._id === value) {
                    return en.shortName;
                }
            }
        }
        if (args.toString() === 'preparationCenter') {
            for (const en of this.preparationCenter) {
                if (en._id === value) {
                    return en.shortName;
                }
            }
        }

        if (args.toString() === 'user') {

            for (const en of this.users) {
                if (en._id === value) {
                    return en.firstname;
                }
            }
        }
    }
}
