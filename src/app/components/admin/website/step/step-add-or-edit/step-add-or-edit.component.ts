import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StepService} from "../step.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {IStepEditOrCreate} from "../../../../../shared/models/step";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-step-add-or-edit',
  templateUrl: './step-add-or-edit.component.html',
  styleUrls: ['./step-add-or-edit.component.scss']
})
export class StepAddOrEditComponent implements OnInit {
  stepForm: FormGroup;

  constructor(private stepService: StepService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.createStepForm();
    this.initializeStepToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeStepToEdit(id: number) {
    if (id > 0) {
      this.stepService.getStep(id).subscribe(step => {
        this.stepForm.patchValue(step);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.stepForm.patchValue({
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
    this.stepService.addNew(this.stepForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/steps');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.stepForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.stepService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/steps');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createStepForm() {
    this.stepForm = new FormGroup({
      titleAr: new FormControl(null, Validators.required),
      titleEn: new FormControl(null, Validators.required),
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null, Validators.required),
      descriptionAr: new FormControl(null, Validators.required),
      descriptionEn: new FormControl(null, Validators.required),
      icon: new FormControl(null, Validators.required),
      imageSource: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
      image: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
    });
  }

}
