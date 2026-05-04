import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AboutService } from '../about.service';

@Component({
  selector: 'app-about-add-or-edit',
  templateUrl: './about-add-or-edit.component.html',
  styleUrls: ['./about-add-or-edit.component.scss']
})
export class AboutAddOrEditComponent implements OnInit {

  aboutForm: FormGroup;

  constructor(private aboutService: AboutService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createaboutForm();
    this.initializeAboutToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializeAboutToEdit(id: number) {
    if (id > 0) {
      this.aboutService.getabout(id).subscribe(about => {
        this.aboutForm.patchValue(about);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.aboutForm.patchValue({
        imageSource: file
      });
    }
  }

  onSubmit() {
    if (+this.activatedRoute.snapshot.paramMap.get('id') > 0) {
      this.onEditSubmit();
    } else {
      this.onCreateSubmit();
    }
  }

  private onCreateSubmit() {
    this.aboutService.addNew(this.aboutForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/whoweare');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let data = this.aboutForm.value;

    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

    this.aboutService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/whoweare');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createaboutForm() {
    this.aboutForm = new FormGroup({
      titleAr: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      paragraph1: new FormControl(null, Validators.required),
      paragraph1Ar: new FormControl(null, Validators.required),
      paragraph2: new FormControl(null, Validators.required),
      paragraph2Ar: new FormControl(null, Validators.required),
      paragraph3: new FormControl(null, Validators.required),
      paragraph3Ar: new FormControl(null, Validators.required),
      paragraph4: new FormControl(null, Validators.required),
      paragraph4Ar: new FormControl(null, Validators.required),
      imageSource: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
      image: new FormControl('',
        +this.activatedRoute.snapshot.paramMap.get('id') > 0 ? Validators.minLength(1) : Validators.required),
    });
  }
}
