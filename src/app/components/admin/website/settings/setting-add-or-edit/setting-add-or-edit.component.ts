import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-setting-add-or-edit',
  templateUrl: './setting-add-or-edit.component.html',
  styleUrls: ['./setting-add-or-edit.component.scss']
})
export class SettingAddOrEditComponent implements OnInit {
  settingForm: FormGroup;

  constructor(private settingService: SettingService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createSettingForm();
    this.initializeSettingToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeSettingToEdit(id: number) {
    if (id > 0) {
      this.settingService.getSetting(id).subscribe(setting => {
        console.log(setting)
        this.settingForm.patchValue(setting);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.settingForm.patchValue({
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
    this.settingService.addNew(this.settingForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/setting');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.settingForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.settingService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/setting');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createSettingForm() {
    this.settingForm = new FormGroup({
      titleAr: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      keyword: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      paragraphAr: new FormControl(null, Validators.required),
      paragraph: new FormControl(null, Validators.required),
      imageSource: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
      image: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
    });
  }

}
