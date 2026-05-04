import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FaqService } from "../faq.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IFaqEditOrCreate } from "../../../../../shared/models/faq";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-faq-add-or-edit',
  templateUrl: './faq-add-or-edit.component.html',
  styleUrls: ['./faq-add-or-edit.component.scss']
})
export class FaqAddOrEditComponent implements OnInit {
  faqForm: FormGroup;

  constructor(private faqService: FaqService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit(): void {
    this.createFaqForm();
    this.initializeFaqToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeFaqToEdit(id: number) {
    if (id > 0) {
      this.faqService.getFaq(id).subscribe(faq => {
        this.faqForm.patchValue(faq);
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
    this.faqService.addNew(this.faqForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/faqs');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.faqForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.faqService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/faqs');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createFaqForm() {
    this.faqForm = new FormGroup({
      question: new FormControl(null, Validators.required),
      answer: new FormControl(null, Validators.required),
    });
  }

}
