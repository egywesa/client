import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CompanyService } from "../company.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ICompanyEditOrCreate } from "../../../../shared/models/company";
import { IActivity } from "../../../../shared/models/activity";
import { ActivityService } from "../../activity/activity.service";
import { TranslateService } from "@ngx-translate/core";
import { ICity } from 'src/app/shared/models/city';
import { CityService } from '../../city/city.service';

@Component({
  selector: 'app-company-add-or-edit',
  templateUrl: './company-add-or-edit.component.html',
  styleUrls: ['./company-add-or-edit.component.scss']
})
export class CompanyAddOrEditComponent implements OnInit {
  companyForm: FormGroup;
  activities: IActivity[] = [];
  cities: ICity[];
  

  constructor(private   cityService: CityService,private companyService: CompanyService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private activityService: ActivityService, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeActivities();
    this.initializeCities();
    this.createCompanyForm();
    
    // Wait for cities to be loaded before initializing company
    this.cityService.getCities().subscribe(cities => {
      this.cities = cities;
      this.initializeCompanyToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
    });
  }

  private initializeCities() {
    this.cityService.getCities().subscribe(cities => this.cities = cities);
  }

  initializeCompanyToEdit(id: number) {
    if (id > 0) {
      this.companyService.getCompany(id).subscribe(company => {
        console.log('Company data:', company);
        console.log('Cities:', this.cities);
        this.companyForm.patchValue({
          ...company,
          cityId: company.cityId ? +company.cityId : null
        });
      });
    }
  }

  initializeActivities() {
    this.activityService.getActivities().subscribe(activities => this.activities = activities);
  }

  onSubmit() {
    if (+this.activatedRoute.snapshot.paramMap.get('id') > 0) {
      this.onEditSubmit();
    } else {
      this.onCreateSubmit();
    }
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.companyForm.patchValue({
        logoSource: file
      });
    }
  }

  private onCreateSubmit() {
    console.log("this.companyForm.value")
    console.log(this.companyForm.value)
    this.companyService.addNew(this.companyForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/companies');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.companyForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');
    console.log("data")
    console.log(data)
    this.companyService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/companies');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }
  HasAllowEdit: boolean = false;
  changePendingEditeState() {
    this.HasAllowEdit = !this.HasAllowEdit;
  }

  private createCompanyForm() {
    this.companyForm = new FormGroup({
      companyNameAr: new FormControl(null, Validators.required),
      companyNameEn: new FormControl(null, Validators.required),
      companyAddressAr: new FormControl(null, Validators.required),
      companyAddressEn: new FormControl(null, Validators.required),
      activityId: new FormControl(null),
      commercialRegNumber: new FormControl(null),
     // commercialRegNumber: new FormControl(null,Validators.nullValidator),
      allowEditDate: new FormControl(null),
      allowZatac: new FormControl(null),
      allowZatacForm: new FormControl(null),
      vat: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{15}$')]),
      // tin: new FormControl(null),
      firstName: new FormControl(null, [
        Validators.required, Validators.minLength(2), Validators.maxLength(20)
      ]),
      lastName: new FormControl(null),
      //[
      //  Validators.required, Validators.minLength(2), Validators.maxLength(20)
      //]),
      phoneNumber: new FormControl(null, [
        Validators.required, Validators.minLength(8), Validators.maxLength(25)
      ]),
      email: new FormControl(null, [
        Validators.required, Validators.minLength(6), Validators.maxLength(40),
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\.)+[\\w-]{2,4}$')
      ]),
      cityId: new FormControl(null),
    //  buildingNumber: new FormControl(null,[Validators.required,Validators.pattern('^[0-9]{4}$')]),
     // citySubdivisionName: new FormControl(null),
      country: new FormControl('SA'),
    //  countrySubentity: new FormControl(null),
    //  plotIdentification: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
    //  postalZone: new FormControl(null,[Validators.required, Validators.pattern('^[0-9]{5}$')]),
    //  streetName: new FormControl(null,[Validators.required]),
      password: new FormControl(null, [

        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(6) : Validators.required,

        Validators.minLength(6), Validators.maxLength(50)
      ]),
      logoSource: new FormControl(null,
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required,
      ),
      logo: new FormControl(null,
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required,
      ),
    });
  }

  compareCity(city1: number, city2: number): boolean {
    return city1 === city2;
  }

}
