import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "../account.service";
import { environment } from "../../../../environments/environment";
import { ICity } from "../../../shared/models/city";
import { CityService } from "../../admin/city/city.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivityService } from '../../admin/activity/activity.service';
import { IActivity } from "../../../shared/models/activity";
@Component({
  selector: 'app-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.scss']
})
export class CompanyprofileComponent implements OnInit {

  baseUrl = environment.baseUrl;
  profileForm: FormGroup;
  logoLink: string;
  signatureLink: string;
  cities: ICity[];
  haveInvoices: boolean;
  activities: IActivity[] = [];


  constructor(private profileService: AccountService, private router: Router,
    private   cityService: CityService, private  activityService: ActivityService,  private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.createProfileForm();
     this.initializeCities();
     this.initializeActivities();
  }

  onSubmit() {
    console.log(this.profileForm.value);
    this.profileService.updateProfile(this.profileForm.value).subscribe(profile => {
      this.logoLink = profile.logoLink;
      this.signatureLink = profile.signatureLink;


      this.router.navigate(['/dashboard']);

      console.log(profile);
      this.toastr.success(this.translate.instant('saveSucess'));

    },(err) => {
      console.log(err);
      this.toastr.error('Not Completed data in form');
    });



  }

  onLogoChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileForm.patchValue({
        logoSource: file,
        logo: file.name
      });
    }
  }

  onSignatureChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileForm.patchValue({
        signatureSource: file,
        signature: file.name
      });
    }
  }

  // Only require the core text fields for enabling submit; files remain optional
  canSubmit(): boolean {
    const f = this.profileForm;
    if (!f) { return false; }
    const required = [
      'companyNameAr', 'companyNameEn', 'companyAddressAr', 'companyAddressEn',
      'commercialRegNumber', 'vat', 'invoiceLast'
    ];
    return required.every(name => {
      const c = f.get(name);
      return c && c.valid && (c.value !== null && c.value !== undefined && String(c.value).trim() !== '');
    });
  }

  // Return list of invalid required fields for debugging/display
  invalidRequiredFields(): string[] {
    const f = this.profileForm;
    if (!f) { return []; }
    const required = [
      'companyNameAr', 'companyNameEn', 'companyAddressAr', 'companyAddressEn',
      'commercialRegNumber', 'vat', 'invoiceLast'
    ];
    return required.filter(name => {
      const c = f.get(name);
      return !(c && c.valid && (c.value !== null && c.value !== undefined && String(c.value).trim() !== ''));
    });
  }

  private initializeCities() {
    this.cityService.getCities().subscribe(cities => this.cities = cities);
  }

  private createProfileForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      companyNameAr: new FormControl(null, Validators.required),
      companyNameEn: new FormControl(null, Validators.required),
      companyAddressAr: new FormControl(null, Validators.required),
      companyAddressEn: new FormControl(null, Validators.required),
      email: new FormControl(null),
      phoneNumber: new FormControl(null, [Validators.pattern('^[0-9]{9}$')]),
      commercialRegNumber: new FormControl(null,[Validators.required, Validators.pattern('^[0-9]{10}$')] ),
      vat: new FormControl(null, [Validators.required,  Validators.pattern('^3[0-9]{13}3$')]),
      tin: new FormControl(null, [Validators.pattern('^[0-9]{10}$')]),
      invoiceLast: new FormControl(0, Validators.required),
      signatureSource: new FormControl(''),
      signature: new FormControl(''),
      logoSource: new FormControl(''),
      logo: new FormControl(''),
      cityId: new FormControl(null),
      activityId: new FormControl(null),
      
      Country: new FormControl('SA'),
     
    });


  }
   private setTableOptions() {
    if (this.translate.currentLang == 'ar') {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
    } else {
      var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";

    }
}
initializeActivities() {
  this.activityService.getActivities().subscribe(activities => this.activities = activities);
}


}
