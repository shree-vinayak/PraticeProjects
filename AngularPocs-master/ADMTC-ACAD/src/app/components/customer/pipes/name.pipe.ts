import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: String): String {
    return value.charAt(0).toUpperCase() + value.substr(1);
  }

}
