import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, map, take } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { ISlider } from 'src/app/shared/models/slider';
import { environment } from 'src/environments/environment';
import { PriceService } from '../admin/price/price.service';
import { TestimonialService } from '../admin/website/testimonial/testimonial.service';
import { HomeService } from '../home/home.service';
import { LandingpageService } from '../landpage service/landingpage.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AboutService } from '../admin/website/about/about.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
lang:any;
sliderlist:ISlider[];
baseUrl = environment.baseUrl;
about:any;
public chart: any;

totalNormalInvoices = 0;
totalSimpleInvoices = 0;
totalCredit = 0;
totalDebit = 0;
customOptions: OwlOptions = {
  loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ "<i class='fa fa-arrow-left' aria-hidden='true'></i>", "<i class='fa fa-arrow-right' aria-hidden='true'></i>"],
    nav: true,
    responsive: {
    0: {
      items: 1
    },
    400: {
      items: 1
    },
    740: {
      items: 3
    }
  },

}
customOptionsprices: OwlOptions = {
  loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ "<i class='fa fa-arrow-left' aria-hidden='true'></i>", "<i class='fa fa-arrow-right' aria-hidden='true'></i>"],
    nav: true,
    responsive: {
    0: {
      items: 1
    },
    400: {
      items: 1
    },
    740: {
      items: 3
    }
  },

}
customOptionsabout: OwlOptions = {
  loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ "<i class='fa fa-arrow-left' aria-hidden='true'></i>", "<i class='fa fa-arrow-right' aria-hidden='true'></i>"],
    nav: true,
   items:1
}
  constructor(public appService: AppService,public landService:LandingpageService ,
    private homeService: HomeService ,private priceService: PriceService,private testemoniaservice:TestimonialService ,
    private aboutservice:AboutService) { }
  form!: FormGroup;
  pricesList:any;
  testimoniallist:any;
  ngOnInit(): void {
   this.lang=localStorage.getItem('language');
   this.getSlider();
   this.loadHomeStatistics();
   this.getallPrices();
   this.gettestemonias();
   this.getabouts();
  }
  translateLanguageTo(lang:any){
  this.appService.changeLanguage(lang)
  }
 
  sendcontact(){

  }
  getSlider(){
  this.landService.getSliders().subscribe(res=>{
    this.sliderlist=res;
    console.log(this.sliderlist)
  })
  }
  loadHomeStatistics() {
    this.homeService.loadStatistics().subscribe(response => {
      console.log("in statistic")
      console.log(response)
      this.totalNormalInvoices = response["totalNormalInvoices"];
      this.totalSimpleInvoices = response["totalSimpleInvoices"];
      this.totalCredit = response["totalCredit"];
      this.totalDebit = response["totalDebit"];
      
    });
  }
  getallPrices(){
    this.priceService.getPrices().pipe(
      map(x => x.slice(0,6))
    ).subscribe(res=>{
      console.log(res)
      this.pricesList=res;
    })
  }
  gettestemonias(){
    this.testemoniaservice.getTestimonials().subscribe(res=>{
      console.log(res);
      this.testimoniallist=res;
    })
  }
  getabouts(){
    this.aboutservice.getabouts().subscribe(res=>{
      console.log(res)
      this.about=res;
    })
  }
  changeLanguage(lang:any) {
    console.log('lang change')
    this.lang=lang;
    this.appService.changeLanguage(lang);
    this.ngOnInit()
  }
}
