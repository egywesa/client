import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SliderService } from "../slider.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ISliderEditOrCreate } from "../../../../../shared/models/slider";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-slider-add-or-edit',
  templateUrl: './slider-add-or-edit.component.html',
  styleUrls: ['./slider-add-or-edit.component.scss']
})
export class SliderAddOrEditComponent implements OnInit {
  sliderForm: FormGroup;

  constructor(private sliderService: SliderService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createSliderForm();
    this.initializeSliderToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeSliderToEdit(id: number) {
    if (id > 0) {
      this.sliderService.getSlider(id).subscribe(slider => {
        this.sliderForm.patchValue(slider);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sliderForm.patchValue({
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
    this.sliderService.addNew(this.sliderForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/sliders');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.sliderForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.sliderService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/sliders');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createSliderForm() {
    this.sliderForm = new FormGroup({
      titleAr: new FormControl(null, Validators.required),
      titleEn: new FormControl(null, Validators.required),
      descriptionAr: new FormControl(null, Validators.required),
      descriptionEn: new FormControl(null, Validators.required),
      imageSource: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
      image: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
    });
  }

}
