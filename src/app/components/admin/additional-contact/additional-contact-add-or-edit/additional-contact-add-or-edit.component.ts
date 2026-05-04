import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdditionalContactService } from "../additional-contact.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IAdditionalContactEditOrCreate } from "../../../../shared/models/additional-contact";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-additional-contact-add-or-edit',
  templateUrl: './additional-contact-add-or-edit.component.html',
  styleUrls: ['./additional-contact-add-or-edit.component.scss']
})
export class AdditionalContactAddOrEditComponent implements OnInit {
  additionalContactForm: FormGroup;

  constructor(private additionalContactService: AdditionalContactService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit(): void {
    this.createAdditionalContactForm();
    this.initializeAdditionalContactToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeAdditionalContactToEdit(id: number) {
    if (id > 0) {
      this.additionalContactService.getAdditionalContact(id).subscribe(additionalContact => {
        this.additionalContactForm.patchValue(additionalContact);
      });
    }
  }

  onSubmit() {
    if (+this.activatedRoute.snapshot.paramMap.get('id') > 0) {
      this.onEditSubmit();
    } else {
      this.onCreateSubmit();
    }
  }

  private onCreateSubmit() {
    this.additionalContactService.addNew(this.additionalContactForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/additional-contacts');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.additionalContactForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.additionalContactService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/additional-contacts');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createAdditionalContactForm() {
    this.additionalContactForm = new FormGroup({
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null),
      titleAr: new FormControl(null, Validators.required),
      titleEn: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
      facebook: new FormControl(null),
      twitter: new FormControl(null),
      linkedin: new FormControl(null),
    });
  }
}
