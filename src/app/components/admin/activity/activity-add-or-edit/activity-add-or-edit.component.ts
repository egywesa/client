import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivityService } from "../activity.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IActivityEditOrCreate } from "../../../../shared/models/activity";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-activity-add-or-edit',
  templateUrl: './activity-add-or-edit.component.html',
  styleUrls: ['./activity-add-or-edit.component.scss']
})
export class ActivityAddOrEditComponent implements OnInit {
  activityForm: FormGroup;

  constructor(private activityService: ActivityService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit(): void {
    this.createLoginForm();
    this.initializeActivityToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeActivityToEdit(id: number) {
    if (id > 0) {
      this.activityService.getActivity(id).subscribe(activity => {
        this.activityForm.patchValue(activity);
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
    this.activityService.addNew(this.activityForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/activities');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.activityForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.activityService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/activities');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createLoginForm() {
    this.activityForm = new FormGroup({
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null, Validators.required),
    });
  }

}
