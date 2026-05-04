import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ZatacSettingService } from '../zatac-setting.service';
import { BranchService } from '../../branch/branch.service';
import { IBranch } from 'src/app/shared/models/branch';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CityService } from '../../city/city.service';
import { ICity } from 'src/app/shared/models/city';
import { ICountry } from 'src/app/shared/models/country';
import { CountryService } from '../../city/country.service';
import { CompanyService } from '../../company/company.service';
import { EventEmitter, Injectable } from "@angular/core";
@Component({
  selector: 'app-zatac-setting',
  templateUrl: './zatac-setting.component.html',
  styleUrls: ['./zatac-setting.component.scss'],
})
export class ZatacSettingComponent implements OnInit {

  mystatusChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('branchAddNewModel', { static: false })
  branchAddNewModel: ElementRef;
  branches: IBranch[] = [];
  zatacform: FormGroup;
  branchForm: FormGroup;
  cities: ICity[];
  countries: ICountry[];
  branchElm: HTMLElement;
 

  companies: any;

  selectedcompanyObj:any;

  constructor(
    private countryService: CountryService,
    private cityService: CityService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private zatacsetting: ZatacSettingService,
    private branchservice: BranchService,
    private translate: TranslateService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    
    
    this.initializeCities();
    this.initializeCountry();
    this.createZataForm();
    this.companyService.getCompanysZata().subscribe({
      next: (data) => {
        (this.companies = data), console.log(data);
      },
      error: (err) => console.log(err),
    });
    this.createBranchForm(this.selectedcompanyObj);

  }

  brandTyped(event: any) {
    var jsonData =JSON.parse(`${JSON.stringify(event)}`);
   this.selectedcompanyObj=jsonData['id'];
   this.mystatusChanged.emit(this.selectedcompanyObj);

    console.log( this.selectedcompanyObj);
    this.branchservice.getBranchLookups(jsonData['id']).subscribe({
      next: (data) => {
        (this.branches = data),
         console.log(this.branches);
      },

      error: (err) => console.log(err),
    });
   
}

  FilterBranch(event: any)
   {

    this.branchservice.getBranchLookups(event.target.value).subscribe({
      next: (data) => {
        (this.branches = data),
         console.log(this.branches);
      },

      error: (err) => console.log(err),
    });
   }

   

  ngAfterViewInit(): void {
    this.branchElm = this.branchAddNewModel.nativeElement as HTMLElement;
  }
  closeBranchForm(): void {
    this.branchElm.classList.remove('show');
    setTimeout(() => {
      this.branchElm.style.width = '0';
    }, 75);
  }

  openBranchForm(): void {

   
    console.log('Button clicked!');
    this.mystatusChanged.emit(this.selectedcompanyObj);
    console.log(this.selectedcompanyObj);
    this.branchElm.classList.add('show');
    this.branchElm.style.width = '100vw';
    this.branchElm.style.display = 'flex';
    console.log(this.branchElm);
   this.createBranchForm(this.selectedcompanyObj);
  }

  addNewBranch() {
    this.branchservice.addNew(this.branchForm.value).subscribe((branch) => {
      this.branches.push({
        branchId: branch['branchId'],
        branchName: branch['branchName'],
        address: branch['address'],
        companyId: branch['companyId'],
        companyName: branch['companyName'],
        streetName: branch['streetName'],
        buildingNumber: branch['buildingNumber'],
        plotIdentification: branch['plotIdentification'],
        citySubdivisionName: branch['citySubdivisionName'],
        cityName: branch['cityName'],
        postalZone: branch['postalZone'],
        countrySubentity: branch['countrySubentity'],
        country: branch['country'],
       commercialRegNumber:branch['commercialRegNumber']

      });

      this.zatacform.patchValue({ branchId: branch['branchId'] });
      this.toastr.success(this.translate.instant('saveSucess'));
      this.closeBranchForm();
      console.log(this.branches);
    });
  }

  private createBranchForm(innnn ) {
    this.branchForm = new FormGroup({
      branchName: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      buildingNumber: new FormControl(null, [Validators.pattern('^[0-9]{4}$')]),
      citySubdivisionName: new FormControl(null),
    
      // country: new FormControl('SA'),
      // cityName: new FormControl(null, Validators.required) cityId: new FormControl(null),,
      countryId: new FormControl(null),
      commercialRegNumber:new FormControl(null),
      cityId: new FormControl(null),
      countrySubentity: new FormControl(null),
      plotIdentification: new FormControl(null, [
        Validators.pattern('^[0-9]+$'),
      ]),
      postalZone: new FormControl(null, [Validators.pattern('^[0-9]{5}$')]),
      streetName: new FormControl(null),
      companyId:new FormControl(innnn),
     
    });

   

  }
  private initializeCities() {
    this.cityService.getCities().subscribe((cities) => (this.cities = cities));
  }

  private initializeCountry() {
    this.countryService
      .geCountry()
      .subscribe((country) => (this.countries = country));
  }



  private createZataForm() {
    this.zatacform = new FormGroup({
      //zatcaInvoiceTypes: new FormControl(null, Validators.required),
      otp: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{6}$'),
      ]),
      branchId: new FormControl(null, Validators.required),
      IntegrationType: new FormControl(null, Validators.required),
    });
  }


  send() {
    console.log(this.zatacform.get('branchId').value);
    this.zatacsetting
      .zatacSetting(
        this.zatacform.get('branchId').value,
        //this.zatacform.get('zatcaInvoiceTypes').value,
        this.zatacform.get('otp').value,
        this.zatacform.get('IntegrationType').value
      )
      .subscribe({
        next: (data) =>
          this.toastr.success(this.translate.instant('saveSucess')),
        error: (err) => console.log(err),
      });
  }
}
