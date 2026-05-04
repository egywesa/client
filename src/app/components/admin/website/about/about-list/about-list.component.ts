import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IAbout } from 'src/app/shared/models/about';
import { environment } from 'src/environments/environment';
import { AboutService } from '../about.service';

@Component({
  selector: 'app-about-list',
  templateUrl: './about-list.component.html',
  styleUrls: ['./about-list.component.scss']
})
export class AboutListComponent implements OnInit {

  baseUrl = environment.baseUrl;
  aboutlist:IAbout[] = [];

  constructor(private aboutService: AboutService, private toastr: ToastrService, private translate: TranslateService ) { }

  ngOnInit(): void {
    this.initializeabout();
  }

  initializeabout() {
    this.aboutService.getabouts().subscribe(abouts => {
      this.aboutlist = abouts
    });
  }

  removeabout(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.aboutService.remove(id).subscribe(() => {
        let aboutIndex = this.aboutlist.findIndex(a => a.id == id);
        this.aboutlist.splice(aboutIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }

}
