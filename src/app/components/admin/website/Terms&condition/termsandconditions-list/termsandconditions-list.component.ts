import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-termsandconditions-list',
  templateUrl: './termsandconditions-list.component.html',
  styleUrls: ['./termsandconditions-list.component.scss']
})
export class TermsandconditionsListComponent implements OnInit {

  list= [{name:'',id:0}];
  baseUrl = environment.baseUrl;
  constructor( private http: HttpClient,private toastr: ToastrService, private translate: TranslateService ) { }

  ngOnInit(): void {
    this.initializecontact();
  }

  initializecontact() {
    this.http.get<any[]>(this.baseUrl + 'api/Privacyiess?language='+localStorage.getItem('language')).subscribe(terms => {
      console.log(terms);
      this.list = terms
    },
    (err) => {
      console.log(err);
    });
    
  }

  removeterm(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.remove(id).subscribe(() => {
        let Index = this.list.findIndex(a => a.id == id);
        this.list.splice(Index, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/Privacyiess/'+id);
  }


}
