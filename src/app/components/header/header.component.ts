import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DocumentsService } from 'src/app/services';
import { DocumentType, IFilter } from 'src/app/types';
import { ModalComponent } from '../modal/modal.component';
import { Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: '[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  docTypes: Array<DocumentType> = [];
  subscription: Subscription;
  doctypeControl = new FormControl<DocumentType | null>(null);
  numberControl = new FormControl<number | null>(null);

  @Input() filters: IFilter
  @Input() selectedDocId: number | null
  @Input() disableBtn: boolean
  @Output() toggleArhive = new EventEmitter<boolean>();
  @Output() deleteDocEvent = new EventEmitter();
  @Output() setFilters = new EventEmitter<{type: DocumentType | null, number: number | null}>();

  constructor(
    private documentsService: DocumentsService,
    public dialog: Dialog
  ) {}

  ngOnInit() {
    this.subscription = this.documentsService
      .getDocumentTypes()
      .subscribe((response) => {
        this.docTypes = response;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openDialog(id: number | null = null) {
    this.dialog.open(ModalComponent, { data: id });
  }

  clear() {
    this.doctypeControl.setValue(null);
    this.numberControl.setValue(null);

    this.setFilters.emit({
      type: null,
      number: null
    })
  }

  find() {
    this.setFilters.emit({
      type: this.doctypeControl.value,
      number: this.numberControl.value
    })
  }

  handleToggleArhive(event: MatCheckboxChange) {
    this.toggleArhive.emit(event.checked)
  }

  deleteDoc() {
    if(this.selectedDocId) {
      this.documentsService.deleteDocumentById(this.selectedDocId)
      this.deleteDocEvent.emit()
    }
  }
}
