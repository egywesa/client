import { Component, OnInit } from '@angular/core';
import { IStep } from "../../../../../shared/models/step";
import { StepService } from "../step.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../../../environments/environment";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-step-list',
  templateUrl: './step-list.component.html',
  styleUrls: ['./step-list.component.scss']
})
export class StepListComponent implements OnInit {
  baseUrl = environment.baseUrl;
  steps: IStep[] = [];

  constructor(private stepService: StepService, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.initializeSteps();
  }

  initializeSteps() {
    this.stepService.getSteps().subscribe(steps => {
      this.steps = steps
    });
  }

  removeStep(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.stepService.remove(id).subscribe(() => {
        let stepIndex = this.steps.findIndex(a => a.id == id);
        this.steps.splice(stepIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }
}
