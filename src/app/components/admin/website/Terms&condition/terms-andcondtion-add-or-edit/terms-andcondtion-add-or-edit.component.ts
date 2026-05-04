import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Validators, Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-terms-andcondtion-add-or-edit',
  templateUrl: './terms-andcondtion-add-or-edit.component.html',
  styleUrls: ['./terms-andcondtion-add-or-edit.component.scss']
})
export class TermsAndcondtionAddOrEditComponent implements OnInit {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService) { }

  html:any;

 form:FormGroup
  ngOnInit(): void {
   this.createForm();
   this.initializeToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }
 
  initializeToEdit(id: number) {
    console.log(id)
    if (id > 0) {
      this.http.get<any>(this.baseUrl + 'api/Privacyiess/'+id).subscribe(about => {
        this.form.patchValue(about);
      });
    }
  }


  save(){
    
    if (+this.activatedRoute.snapshot.paramMap.get('id') > 0) {
      this.onEdit();
    } else {
      this.onCreate();
    }
    
  }
  private onCreate() {
    this.addNew(this.form.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/termsAndCondition');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEdit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.form.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.edit(id,data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/termsAndCondition');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }
  

  private createForm() {
    this.form = new FormGroup({
      nameAr: new FormControl(null),
      nameEn: new FormControl(null),
    });
  }

  addNew(values: any) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('accept', 'text/plain');

    return this.http.post(this.baseUrl + 'api/Privacyiess', values, {headers: headers});
  }
  edit(id: number, values: any) {

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('accept', 'text/plain');

    return this.http.put(this.baseUrl + 'api/Privacyiess/'+id, values, {headers: headers});
  }
}
