import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BranchService } from "../branch.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IBranchEditOrCreate } from "../../../../shared/models/branch";
import { TranslateService } from "@ngx-translate/core";
import { CountryService } from '../../city/country.service';
import { CityService } from '../../city/city.service';
import { ICity } from 'src/app/shared/models/city';
import { ICountry } from 'src/app/shared/models/country';

@Component({
  selector: 'app-branch-add-or-edit',
  templateUrl: './branch-add-or-edit.component.html',
  styleUrls: ['./branch-add-or-edit.component.scss']
})
export class BranchAddOrEditComponent implements OnInit {
  branchForm: FormGroup;
  allowCondition: any;
  cities: ICity[];
  countries:ICountry[];
  constructor(private countryService:CountryService, private   cityService: CityService,private branchService: BranchService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeCities();
    this.initializeCountry();
    this.createLoginForm();
    this.initializeBranchToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeBranchToEdit(id: number) {
    if (id > 0) {
      this.branchService.getBranch(id).subscribe(branch => {
        this.branchForm.patchValue(branch);
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
    if (this.allowCondition == true) {
      if ((this.branchForm.get('buildingNumber').value != "null" && this.branchForm.get('buildingNumber').value != null && this.branchForm.get('buildingNumber').value != "")
        && (this.branchForm.get('postalZone').value != "null" && this.branchForm.get('postalZone').value != null && this.branchForm.get('postalZone').value != "")
        && (this.branchForm.get('streetName').value != "null" && this.branchForm.get('streetName').value != null && this.branchForm.get('streetName').value != "")&& 
        (this.branchForm.get('commercialRegNumber').value != "null" && this.branchForm.get('commercialRegNumber').value != null && this.branchForm.get('commercialRegNumber').value != "")) {
        // console.log('hereeeeeeeeeeeeeeeeeeeeeee')
        // console.log(this.clientForm.get('buildingNumber').value)
        // console.log(this.clientForm.get('postalZone').value)
        // console.log(this.clientForm.get('streetName').value)
   
        this.branchService.addNew(this.branchForm.value).subscribe(() => {

          this.router.navigateByUrl('/dashboard/branches');//saveSucess
          this.toastr.success(this.translate.instant('saveSucess'));
        });
      } else {
        this.toastr.error(this.translate.instant("invalid data"))
      }
    } else {
      this.branchService.addNew(this.branchForm.value).subscribe(() => {
        this.router.navigateByUrl('/dashboard/branches');//saveSucess
        this.toastr.success(this.translate.instant('saveSucess'));
      });
    }
    // this.branchService.addNew(this.branchForm.value).subscribe(() => {
    //   this.router.navigateByUrl('/dashboard/branches');
    //   this.toastr.success(this.translate.instant('saveSucess'));
    // });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.branchForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');


    if (this.allowCondition == true) {

      if ((this.branchForm.get('buildingNumber').value != "null" && this.branchForm.get('buildingNumber').value != null && this.branchForm.get('buildingNumber').value != "")
        && (this.branchForm.get('postalZone').value != "null" && this.branchForm.get('postalZone').value != null && this.branchForm.get('postalZone').value != "")
        && (this.branchForm.get('streetName').value != "null" && this.branchForm.get('streetName').value != null && this.branchForm.get('streetName').value != "")&&
        (this.branchForm.get('commercialRegNumber').value != "null" && this.branchForm.get('commercialRegNumber').value != null && this.branchForm.get('commercialRegNumber').value != "")) {
        this.branchService.edit(id,
          data).subscribe(() => {
            this.router.navigateByUrl('/dashboard/branches');
            this.toastr.success(this.translate.instant('saveSucess'));
          });
      } else {
        this.toastr.error(this.translate.instant("invalid data"))
      }
    } else {
      this.branchService.edit(id,
        data).subscribe(() => {
          this.router.navigateByUrl('/dashboard/branches');
          this.toastr.success(this.translate.instant('saveSucess'));
        });
    }

    // this.branchService.edit(id,
    //   data).subscribe(() => {
    //     this.router.navigateByUrl('/dashboard/branches');
    //     this.toastr.success(this.translate.instant('saveSucess'));
    //   });
  }

  private createLoginForm() {
    this.branchForm = new FormGroup({
      branchName: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      buildingNumber: new FormControl(null, [Validators.pattern('^[0-9]{4}$')]),
      citySubdivisionName: new FormControl(null),
     // country: new FormControl('SA'),
      countrySubentity: new FormControl(null),
      plotIdentification: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
      postalZone: new FormControl(null, [Validators.pattern('^[0-9]{5}$')]),
      streetName: new FormControl(null),
     // cityName: new FormControl(null, Validators.required)
      countryId: new FormControl(null),
     cityId: new FormControl(null),
     commercialRegNumber:new FormControl(null),
    });
  }
  private initializeCities() {
    this.cityService.getCities().subscribe(cities => this.cities = cities);
  }
  private initializeCountry() {
    this.countryService.geCountry().subscribe(country => this.countries = country);
  }

}
