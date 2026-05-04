import { Component, OnInit, ViewChild } from '@angular/core';
import { IFaq } from "../../../../../shared/models/faq";
import { FaqService } from "../faq.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../../environments/environment";
import { CompositeFilterDescriptor, process } from "@progress/kendo-data-query";
import { employees } from 'src/app/shared/models/employees';
import { images } from 'src/app/shared/models/images';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  faqs: IFaq[] = [];
 @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: unknown[] = this.faqs;
  public gridView: unknown[];

  public mySelection: string[] = [];

  public ngOnInit(): void {
    this.initializeFaqs();
    
  }

  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "full_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "job_title",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "budget",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "phone",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "address",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;
    console.log(this.dataBinding)

    this.dataBinding.skip = 0;
  }

  initializeFaqs() {
      this.faqService.getFaqs().subscribe(faqs => {
        this.faqs = faqs;
        this.gridData=this.faqs;
        this.gridView = this.gridData;
      });
    }
  
  constructor(private faqService: FaqService, private toastr: ToastrService, private translate: TranslateService
  ) { }

  

  // ngOnInit(): void {
  //   this.initializeFaqs();
  // }

  // initializeFaqs() {
  //   this.faqService.getFaqs().subscribe(faqs => {
  //     this.faqs = faqs
  //   });
  // }

  // removeFaq(id: number) {
  //   if (confirm("هل انت متأكد ؟")) {
  //     this.faqService.remove(id).subscribe(() => {
  //       let faqIndex = this.faqs.findIndex(a => a.id == id);
  //       this.faqs.splice(faqIndex, 1);
  //       this.toastr.success(this.translate.instant('saveSucess'));
  //     })
  //   }
  // }
}
