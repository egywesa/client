import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "../account.service";
import { environment } from "../../../../environments/environment";
import { ICity } from "../../../shared/models/city";
import { CityService } from "../../admin/city/city.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivityService } from '../../admin/activity/activity.service';
import { IActivity } from "../../../shared/models/activity";
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  baseUrl = environment.baseUrl;
  profileForm: FormGroup;
  logoLink: string;
  signatureLink: string;
  cities: ICity[];
  haveInvoices: boolean;
  activities: IActivity[] = [];
  profile: any;

  allowZatacCon = new BehaviorSubject(false);
  allowCondition: any;
  allowCondition2: any;
  allowZatacFormCon=new BehaviorSubject(false);
  constructor(private profileService: AccountService, private router: Router,
    private cityService: CityService, private activityService: ActivityService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.createProfileForm();
    this.initializeCities();
    this.initializeProfileToEdit();
    this.initializeActivities();
  }

  initializeProfileToEdit() {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        this.profile = profile;
        this.logoLink = profile.logoLink;
        this.signatureLink = profile.signatureLink;
        this.haveInvoices = profile.haveInvoices;
        this.allowZatacCon.next(this.profile.allowZatac);
        this.allowZatacFormCon.next(this.profile.allowZatacFormCon);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.toastr.error('Failed to load profile. Check server logs.');
      }
    });
  }



  Delete(num: number) {
    this.profileService.Deletelogo(num).subscribe({
      next: data => {
        if (num == 0) {
          this.toastr.success(this.translate.instant('LogoDeletedSuccess'));
        }
        else if (num == 1) {
          this.toastr.success(this.translate.instant('SignatureDeletedSuccess'));
        }
      }
    })

  }


  onSubmit() {

  
  
    // يسمح بالحفظ سواء في تغيير أو لا
    console.log('profileForm submit:', this.profileForm.value,
      'logoSource=', this.profileForm.get('logoSource')?.value,
      'signatureSource=', this.profileForm.get('signatureSource')?.value,
      'valid=', this.profileForm.valid);

    this.profileService.setProfile(this.profileForm.value)
      .subscribe(profile => {
        this.logoLink = profile.logoLink;
        this.signatureLink = profile.signatureLink;
        this.toastr.success(this.translate.instant('saveSucess'));
  
        // optional: نرجّع الفورم pristine بعد الحفظ
        this.profileForm.markAsPristine();
      });
  }

  onLogoChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileForm.patchValue({
        logoSource: file
      });
    }
  }

  onSignatureChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileForm.patchValue({
        signatureSource: file
      });
    }
  }

  private initializeCities() {
    this.cityService.getCities().subscribe(cities => this.cities = cities);
  }
 

  private createProfileForm() {
    this.allowZatacCon.subscribe(data => {
      this.allowCondition = data;


      console.log(this.allowCondition);
     




    });
    this.allowZatacFormCon.subscribe(data => {
      this.allowCondition2 = data;


      console.log(this.allowCondition2);
     




    });
   
    this.profileForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      companyNameAr: new FormControl(null, Validators.required),
      companyNameEn: new FormControl(null, Validators.required),
      companyAddressAr: new FormControl(null, Validators.required),
      companyAddressEn: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, [
        Validators.required, Validators.minLength(8), Validators.maxLength(25)
      ]),
      email: new FormControl(null, [
        Validators.required, Validators.minLength(6), Validators.maxLength(40),
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\.)+[\\w-]{2,4}$')
      ]),

      commercialRegNumber: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      vat: new FormControl(null, [Validators.required, Validators.pattern('^3[0-9]{13}3$')]),
      tin: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      invoiceLast: new FormControl(0, Validators.required),
      signatureSource: new FormControl(''),
      signature: new FormControl(''),
      logoSource: new FormControl(''),
      logo: new FormControl(''),
      cityId: new FormControl(null),
      activityId: new FormControl(null),
     
      country: new FormControl('SA'),
     
    });

  }
  initializeActivities() {
    this.activityService.getActivities().subscribe(activities => this.activities = activities);
  }

}
