import { Component, OnInit } from '@angular/core';
import { ISlider } from "../../../../../shared/models/slider";
import { SliderService } from "../slider.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../../environments/environment";

@Component({
  selector: 'app-slider-list',
  templateUrl: './slider-list.component.html',
  styleUrls: ['./slider-list.component.scss']
})
export class SliderListComponent implements OnInit {
  baseUrl = environment.baseUrl;
  sliders: ISlider[] = [];

  constructor(private sliderService: SliderService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.initializeSliders();
  }

  initializeSliders() {
    this.sliderService.getSliders().subscribe(sliders => {
      this.sliders = sliders
    });
  }

  removeSlider(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.sliderService.remove(id).subscribe(() => {
        let sliderIndex = this.sliders.findIndex(a => a.id == id);
        this.sliders.splice(sliderIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
