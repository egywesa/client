import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { InvoiceService } from '../../invoice/invoice.service';
@Component({
  selector: 'app-designes',
  templateUrl: './designes.component.html',
  styleUrls: ['./designes.component.scss']
})
export class DesignesComponent implements OnInit {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,private toastr: ToastrService,
    private translate: TranslateService,private router: Router,private invoiceService: InvoiceService,
    ) { }
    chose:any;
  ngOnInit(): void {
   this.getdesign();
  }
  onView(img:any) {
   window.open(img);
  
}
chosedesign(value:any){
 this.addshoise(value).subscribe(res=>{
  console.log(res);
  this.ngOnInit()
  this.toastr.success(this.translate.instant('saveSucess'));
  // this.router.navigate(['/dashboard']);
 })
}
addshoise(value: any) {

  console.log(value.toString())
  let headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');
  headers.append('accept', 'text/plain');
  return this.http.post(this.baseUrl + `api/Companies/ChooseRecomrndedSample?recommendedId=${value}`, {headers: headers});
}
getdesign(){
  this.invoiceService.getInvoicedesign().subscribe(res=>{
    console.log(res)
   this.chose=res;
  })
}
}

