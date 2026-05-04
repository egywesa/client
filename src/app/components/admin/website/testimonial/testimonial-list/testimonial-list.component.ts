import { Component, OnInit } from '@angular/core';
import { ITestimonial } from "../../../../../shared/models/testimonial";
import { TestimonialService } from "../testimonial.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../../environments/environment";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {
  baseUrl = environment.baseUrl;
  testimonials: ITestimonial[] = [];

  constructor(private testimonialService: TestimonialService, private toastr: ToastrService, private translate: TranslateService ) { }

  ngOnInit(): void {
    this.initializeTestimonials();
  }

  initializeTestimonials() {
    this.testimonialService.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials
    });
  }

  removeTestimonial(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.testimonialService.remove(id).subscribe(() => {
        let testimonialIndex = this.testimonials.findIndex(a => a.id == id);
        this.testimonials.splice(testimonialIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
