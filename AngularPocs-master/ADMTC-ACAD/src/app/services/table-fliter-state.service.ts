import { Injectable } from '@angular/core';


// Required for Logging on console
import { Log } from 'ng2-logger';
const log = Log.create('TableFilterStateService');
log.color = 'violet';

@Injectable()
export class TableFilterStateService {

  private myTaskFilterState: any = null;
  private pendingTaskFilterState: any = null;

 
  constructor() {}

  get myTaskListFilterState(): any {
    return this.myTaskFilterState;
  }

  set myTaskListFilterState(state) {
    this.myTaskFilterState = state;
  }

  get pendingTaskListFilterState(): any {
    return this.pendingTaskFilterState;
  }

  set pendingTaskListFilterState(state) {
    this.pendingTaskFilterState = state;
  }

  resetFiltersStates() {
    log.data('TableFilterStateService resetFiltersStates');
    this.myTaskFilterState = null;
    this.pendingTaskFilterState = null;
  }
}