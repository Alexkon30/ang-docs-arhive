import { Component } from '@angular/core';
import { DocumentType, IFilter } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Documents';
  selectedDocId: number | null = null;

  filters: IFilter = {
    type: null,
    number: null,
    showArhive: true
  }


  toggleArhive(showArhive: boolean) {
    this.filters = {...this.filters, showArhive}
  }

  setFilters(params: {type: DocumentType | null, number: number | null}) {
    this.filters = {...this.filters, ...params}
  }

  selectDocument(id: number) {
    if (this.selectedDocId !== null && this.selectedDocId === id) {
      this.selectedDocId = null
    } else {
      this.selectedDocId = id
    }
  }

  clearDocId() {
    this.selectedDocId = null
  }
}
