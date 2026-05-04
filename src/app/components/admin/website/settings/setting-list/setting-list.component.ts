import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ISetting } from 'src/app/shared/models/setting';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss']
})
export class SettingListComponent implements OnInit {

  
  settinglist:ISetting[] = [];

  constructor(private settingService: SettingService, private toastr: ToastrService, private translate: TranslateService ) { }

  ngOnInit(): void {
    this.initializeabout();
  }

  initializeabout() {
    this.settingService.getSettings().subscribe(settings => {
      this.settinglist= settings
    });
  }

  removeSetting(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.settingService.remove(id).subscribe(() => {
        let settingIndex = this.settinglist.findIndex(a => a.id == id);
        this.settinglist.splice(settingIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }

}
