import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DocumentsService } from 'src/app/services';
import { IDocument, IFilter } from 'src/app/types';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-main]',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'isMain',
    'type',
    'serial',
    'number',
    'issueDate',
  ];

  documents: MatTableDataSource<IDocument>;
  subscription: Subscription;

  @Input() filters: IFilter;
  @Input() selectedDocId: number | null;
  @Output() selectDoc = new EventEmitter<number>(); 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private documentsService: DocumentsService) {}

  ngOnInit(): void {
    this.documentsService.loadAllDocuments();
    this.subscription = this.documentsService.documents.subscribe((data) => {
      this.documents = new MatTableDataSource(data);

      this.documents.paginator = this.paginator;
      this.documents.sort = this.sort;

      this.documents.filterPredicate = this.createFilter()
    });
  }

  ngOnChanges() {
    if (this.documents) {
      this.documents.filter = JSON.stringify(this.filters)
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createFilter() {
    return (document: IDocument, filter: string) => {
      let searchTerms = JSON.parse(filter) as IFilter;

      return (searchTerms.type === null || document.type === searchTerms.type)
        && (searchTerms.number === null || document.number.toString().startsWith(searchTerms.number.toString()))
        && (searchTerms.showArhive || !document.isArchive);
    }
  }

  selectDocId(id: number) {
    this.selectDoc.emit(id)
  }
}