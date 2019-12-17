import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RNCPTitlesService } from './rncp-titles.service';
import { AcademicKitService } from './academic-kit.service';
declare var _: any;
@Injectable()
export class MoveItemService {

  positionStack = new BehaviorSubject<number[]>(null);
  movingStack = new BehaviorSubject<{stack: number[], type: string}>({stack: [], type : ''});

  constructor(private appService: RNCPTitlesService,
              private acadService: AcademicKitService) {
  }

  updateMovingCategory(stack: number[], type: string) {
    this.movingStack.next({
      stack: stack,
      type: type
    });
    let a = [...stack];
    a.pop();
    this.positionStack.next(a);
  }

  getPositionStack() {
    return this.positionStack;
  }

  getMovingStack() {
    return this.movingStack;
  }

  updateSelectedCategory(stack: number[]) {
    this.positionStack.next(stack);
  }

  moveItem(type: string, from: number[], to: number[], fromCategory?, doc?) {
    return this.acadService.moveAcademicContent(type, from, to, fromCategory, doc);
  }

}
