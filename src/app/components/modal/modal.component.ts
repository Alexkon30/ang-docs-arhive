import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services';
import { DocumentType, Organization } from 'src/app/types';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  styleUrls: ['./modal.component.scss'],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class ModalComponent {
  docTypes: Array<DocumentType> = [];
  organizations: Array<Organization> = [];
  typesSubscription: Subscription;
  orgsSubscription: Subscription;

  form = new FormGroup({
    doctypeControl: new FormControl<DocumentType | null>(null, {
      validators: [Validators.required],
    }),
    serialControl: new FormControl(''),
    numberControl: new FormControl('', {
      validators: [Validators.required],
    }),
    issueDateControl: new FormControl<Date | null>(null),
    organizationControl: new FormControl<Organization | null>(null),
    orgCodeControl: new FormControl(''),
    isMain: new FormControl(false),
    isArchive: new FormControl(false),
  });

  constructor(
    public dialog: Dialog,
    @Inject(DIALOG_DATA) public data: number,
    private documentsService: DocumentsService
  ) {}

  ngOnInit() {
    this.typesSubscription = this.documentsService
      .getDocumentTypes()
      .subscribe((response) => {
        this.docTypes = response;
      });

    this.orgsSubscription = this.documentsService
      .getOrganizations()
      .subscribe((response) => {
        this.organizations = response;
      });

    if (this.data) {
      let doc = this.documentsService.docsValue.find(
        (doc) => doc.id === this.data
      );
      if (doc) {
        this.form.controls.doctypeControl.setValue(doc.type);
        this.form.controls.serialControl.setValue(doc.serial);
        this.form.controls.numberControl.setValue(doc.number);
        this.form.controls.issueDateControl.setValue(doc.issueDate);
        this.form.controls.organizationControl.setValue(doc.organization);
        this.form.controls.orgCodeControl.setValue(doc.orgCode);
        this.form.controls.isMain.setValue(doc.isMain);
        this.form.controls.isArchive.setValue(doc.isArchive);
      }
    }
  }

  ngOnDestroy() {
    this.typesSubscription.unsubscribe();
    this.orgsSubscription.unsubscribe();
  }

  save() {
    let docInfo = {
      type: this.form.controls.doctypeControl.value,
      serial: this.form.controls.serialControl.value,
      number: this.form.controls.numberControl.value,
      issueDate: this.form.controls.issueDateControl.value,
      organization: this.form.controls.organizationControl.value,
      orgCode: this.form.controls.orgCodeControl.value,
      isMain: this.form.controls.isMain.value,
      isArchive: this.form.controls.isArchive.value,
    };

    if (this.data) {
      this.documentsService.updateDocumentById(this.data, docInfo);
    } else {
      this.documentsService.createDocument(docInfo);
    }

    this.dialog.closeAll();
  }

  close() {
    this.dialog.closeAll();
  }
}
