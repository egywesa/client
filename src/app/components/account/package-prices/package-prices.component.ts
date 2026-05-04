import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { PriceService } from '../../admin/price/price.service';

@Component({
  selector: 'app-package-prices',
  templateUrl: './package-prices.component.html',
  styleUrls: ['./package-prices.component.scss']
})
export class PackagePricesComponent implements OnInit {
firstlist:any;
lastlist:any;
  constructor(public appService: AppService ,private priceService: PriceService) { }
lang:any;
  ngOnInit(): void {
   this.lang=localStorage.getItem('language');
    this.getallPrices();
    console.log(this.firstlist);
    
  }
  getallPrices(){
    this.priceService.getPrices().pipe(
      map(x => x.slice(0,3))
    ).subscribe(res=>{
      console.log(res)
     this.firstlist=res
    })
    this.priceService.getPrices().pipe(
      map(x => x.slice(3,6))
    ).subscribe(res=>{
      console.log(res)
     this.lastlist=res
    })
  }
  changeLanguage(lang:any) {
    console.log('lang change')
    this.lang=lang;
    this.appService.changeLanguage(lang);
    this.ngOnInit()
  }
}
