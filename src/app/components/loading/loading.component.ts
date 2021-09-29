import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() modalVisible: boolean = false;
  @Input() modalVisibleSpinner: boolean = false;
  @Output() toggleVisible: EventEmitter<any> = new EventEmitter();
  @Output() toggleVisibleSpinner: EventEmitter<any> = new EventEmitter();
  @Input() header:string | undefined;

  constructor() { }
  ngOnInit() {
  }

  closeModal() {
    this.modalVisible = false;
    this.toggleVisible.emit(this.modalVisible);
  }

  mostraSpinner() {
    this.modalVisibleSpinner = true;
    this.toggleVisibleSpinner.emit(this.modalVisibleSpinner);
  }

  escondeSpinner() {
    this.modalVisibleSpinner = false;
    this.toggleVisibleSpinner.emit(this.modalVisibleSpinner);
  }

}
