import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ClientService } from "../client.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IClientEditOrCreate } from "../../../../shared/models/client";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/components/account/account.service';
import { CountryService } from '../../city/country.service';
import { CityService } from '../../city/city.service';
import { ICity } from 'src/app/shared/models/city';
import { ICountry } from 'src/app/shared/models/country';

@Component({
  selector: 'app-client-add-or-edit',
  templateUrl: './client-add-or-edit.component.html',
  styleUrls: ['./client-add-or-edit.component.scss']
})
export class ClientAddOrEditComponent implements OnInit {
  clientForm: FormGroup;
  client: any;
  allowZatacCon = new BehaviorSubject(false);
  allowCondition: any;
  allowZatacCon2 = new BehaviorSubject(false);
  allowCondition2: any;
  profile: any;
  cities: ICity[];
  countries:ICountry[];
  constructor(private countryService:CountryService, private   cityService: CityService,private profileService: AccountService, private clientService: ClientService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.initializeCities();
    this.initializeCountry();
    this.initializeClientToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
    this.initializeProfileToEdit()

  }

  initializeProfileToEdit() {
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
      this.allowZatacCon.next(this.profile.allowZatac);

    });
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
      this.allowZatacCon2.next(this.profile.allowZatacForm);
console.log(this.profile.allowZatacForm);
    });
  }

  initializeClientToEdit(id: number) {
    if (id > 0) {
      this.clientService.getClient(id).subscribe(client => {
        console.log('Edit client response:', client);

        const mappedClient = {
          ...client,
          nameAr: client.nameAr ?? client.nameAr ?? null,
          nameEn: client.nameEn ?? client.nameEn ?? null,
          administratorNameAr: client.administratorNameAr ?? client.administratorNameAr ?? null,
          administratorNameEn: client.administratorNameEn ?? client.administratorNameEn ?? null,
          addressAr: client.addressAr ?? client.addressAr ?? null,
          addressEn: client.addressEn ?? client.addressEn ?? null,
          countryId: client.companyId ?? client.companyId ?? null,
          
        };

        this.clientForm.patchValue(mappedClient);
        this.client = client;
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
      if ((this.clientForm.get('buildingNumber').value != "null" && this.clientForm.get('buildingNumber').value != null && this.clientForm.get('buildingNumber').value != "")
        && (this.clientForm.get('postalZone').value != "null" && this.clientForm.get('postalZone').value != null && this.clientForm.get('postalZone').value != "")
        && (this.clientForm.get('streetName').value != "null" && this.clientForm.get('streetName').value != null && this.clientForm.get('streetName').value != "")) {
        // console.log('hereeeeeeeeeeeeeeeeeeeeeee')
        // console.log(this.clientForm.get('buildingNumber').value)
        // console.log(this.clientForm.get('postalZone').value)
        // console.log(this.clientForm.get('streetName').value)
        this.clientService.addNew(this.clientForm.value).subscribe(() => {
          this.router.navigateByUrl('/dashboard/clients');//saveSucess
          this.toastr.success(this.translate.instant('saveSucess'));
        });
      } else {
        this.toastr.error(this.translate.instant("invalid data"))
      }
    } else {
      this.clientService.addNew(this.clientForm.value).subscribe(() => {
        this.router.navigateByUrl('/dashboard/clients');//saveSucess
        this.toastr.success(this.translate.instant('saveSucess'));
      });
    }
  }

  private onEditSubmit() {

    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.clientForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.allowCondition == true) {

      if ((this.clientForm.get('buildingNumber').value != "null" && this.clientForm.get('buildingNumber').value != null && this.clientForm.get('buildingNumber').value != "")
        && (this.clientForm.get('postalZone').value != "null" && this.clientForm.get('postalZone').value != null && this.clientForm.get('postalZone').value != "")
        && (this.clientForm.get('streetName').value != "null" && this.clientForm.get('streetName').value != null && this.clientForm.get('streetName').value != "")) {
        this.clientService.edit(id,
          data).subscribe(() => {
            this.router.navigateByUrl('/dashboard/clients');
            this.toastr.success(this.translate.instant('saveSucess'));
          });
      } else {
        this.toastr.error(this.translate.instant("invalid data"))
      }
    } else {
      this.clientService.edit(id,
        data).subscribe(() => {
          this.router.navigateByUrl('/dashboard/clients');
          this.toastr.success(this.translate.instant('saveSucess'));
        });
    }
  }

  private createLoginForm() {
    this.allowZatacCon.subscribe(data => {
      this.allowCondition = data;
      console.log(this.allowCondition);
    });
    this.allowZatacCon2.subscribe(data => {
      this.allowCondition2= data;
      console.log(this.allowCondition2);
    });

    this.clientForm = new FormGroup({
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null),
      administratorNameAr: new FormControl(null),
      administratorNameEn: new FormControl(null),
      addressAr: new FormControl(null),
      addressEn: new FormControl(null),
      clientNum: new FormControl(null),
      email: new FormControl(null),
      commercialRegNumber:new FormControl(null, [Validators.pattern('^[0-9]{10}$')]),


      // email: new FormControl(null, [
      //   Validators.required, Validators.minLength(6), Validators.maxLength(40),
      //   Validators.pattern('^[\\w-\\.]+@([\\w-]+\.)+[\\w-]{2,4}$')
      // ]),
      phone: new FormControl(null),
      //tin: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{15}$')]),
      tin:  new FormControl(null, [Validators.pattern('^[0-9]{15}$')]),
      buildingNumber: new FormControl(null, [Validators.pattern('^[0-9]{4}$')]),
      citySubdivisionName: new FormControl(null),
    //  country: new FormControl('SA'),
      countrySubentity: new FormControl(null),
      countryId: new FormControl(null),
      cityId: new FormControl(null),
      plotIdentification: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
      postalZone: new FormControl(null),
      streetName: new FormControl(null),
    });
  }

  private initializeCities() {
    this.cityService.getCities().subscribe(cities => this.cities = cities);
  }
  private initializeCountry() {
    this.countryService.geCountry().subscribe(country => this.countries = country);
  }
}