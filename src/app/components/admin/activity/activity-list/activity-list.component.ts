import { Component, OnInit } from '@angular/core';
import { IActivity } from "../../../../shared/models/activity";
import { ActivityService } from "../activity.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  activities: IActivity[] = [];

  constructor(private activityService: ActivityService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.initializeActivities();
  }

  initializeActivities() {
    this.activityService.getActivities().subscribe(activities => {
      this.activities = activities
    });
  }

  removeActivity(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.activityService.remove(id).subscribe(() => {
        let activityIndex = this.activities.findIndex(a => a.id == id);
        this.activities.splice(activityIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess') );
      })
    }
  }
}
