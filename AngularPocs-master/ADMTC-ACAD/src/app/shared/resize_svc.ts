import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class ResizeSvc {
  public width: Observable<number>;
  public height: Observable<number>;
  public layout: Observable<string>;
  constructor () {
    let windowSize = new BehaviorSubject(this.getWindowSize()); // most recent and subsequent values
    this.width = windowSize.pluck('width').distinctUntilChanged();
    this.height = windowSize.pluck('height').distinctUntilChanged();
    this.layout = windowSize.pluck('layout').distinctUntilChanged(); // only observed distinct changes, e.g sm -> md -> lg, not lg -> lg -> lg
    Observable.fromEvent(window, 'resize')
      .map(this.getWindowSize)
      .subscribe(windowSize);
  }

  getWindowSize() {
    var size = 'na';
    if(window.innerWidth < 768) {
      size = 'xs';
    } else if (window.innerWidth < 992) {
      size = 'sm';
    } else if(window.innerWidth < 1200) {
      size = 'md'
    } else {
      size = 'lg';
    }
  return {
    height: window.innerHeight,
    width: window.innerWidth,
    layout: size
  };
}
}

