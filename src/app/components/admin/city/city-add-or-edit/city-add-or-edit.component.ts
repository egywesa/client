import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CityService } from "../city.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ICityEditOrCreate } from "../../../../shared/models/city";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-city-add-or-edit',
  templateUrl: './city-add-or-edit.component.html',
  styleUrls: ['./city-add-or-edit.component.scss']
})
export class CityAddOrEditComponent implements OnInit {
  cityForm: FormGroup;

  constructor(private cityService: CityService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.initializeCityToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeCityToEdit(id: number) {
    if (id > 0) {
      this.cityService.getCity(id).subscribe(city => {
        this.cityForm.patchValue(city);
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
    this.cityService.addNew(this.cityForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/cities');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.cityForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.cityService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/cities');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createLoginForm() {
    this.cityForm = new FormGroup({
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null, Validators.required),
    });
  }

}
