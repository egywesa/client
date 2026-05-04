import { Component, OnInit } from '@angular/core';
import { ICity } from "../../../../shared/models/city";
import { CityService } from "../city.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
  cities: ICity[] = [];

  constructor(private cityService: CityService, private toastr: ToastrService, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeCities();
  }

  initializeCities() {
    this.cityService.getCities().subscribe(cities => {
      this.cities = cities
    });
  }

  removeCity(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.cityService.remove(id).subscribe(() => {
        let cityIndex = this.cities.findIndex(a => a.id == id);
        this.cities.splice(cityIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
