import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TestimonialService } from "../testimonial.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ITestimonialEditOrCreate } from "../../../../../shared/models/testimonial";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-testimonial-add-or-edit',
  templateUrl: './testimonial-add-or-edit.component.html',
  styleUrls: ['./testimonial-add-or-edit.component.scss']
})
export class TestimonialAddOrEditComponent implements OnInit {
  testimonialForm: FormGroup;

  constructor(private testimonialService: TestimonialService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createTestimonialForm();
    this.initializeTestimonialToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeTestimonialToEdit(id: number) {
    if (id > 0) {
      this.testimonialService.getTestimonial(id).subscribe(testimonial => {
        this.testimonialForm.patchValue(testimonial);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.testimonialForm.patchValue({
        imageSource: file
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
    this.testimonialService.addNew(this.testimonialForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/testimonials');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.testimonialForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.testimonialService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/testimonials');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createTestimonialForm() {
    this.testimonialForm = new FormGroup({
      jobAr: new FormControl(null, Validators.required),
      jobEn: new FormControl(null, Validators.required),
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null, Validators.required),
      descriptionAr: new FormControl(null, Validators.required),
      descriptionEn: new FormControl(null, Validators.required),
      imageSource: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
      image: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
    });
  }

}
