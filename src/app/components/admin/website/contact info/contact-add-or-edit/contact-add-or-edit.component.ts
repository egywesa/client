import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-add-or-edit',
  templateUrl: './contact-add-or-edit.component.html',
  styleUrls: ['./contact-add-or-edit.component.scss']
})
export class ContactAddOrEditComponent implements OnInit {

  contactForm: FormGroup;

  constructor(private contactService: ContactService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createcontactForm();
    this.initializecontactToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
  }

  initializecontactToEdit(id: number) {
    if (id > 0) {
      this.contactService.getContact(id).subscribe(contact => {
        this.contactForm.patchValue(contact);
      });
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.contactForm.patchValue({
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
    let createdAt=new Date()
    this.contactForm.addControl('createdAt',new FormControl(null, Validators.required));
    this.contactForm.get("createdAt").setValue(createdAt);
    console.log(this.contactForm.value)
    this.contactService.addNew(this.contactForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard/contact');
      this.toastr.success(this.translate.instant('saveSucess'));
    });
  }

  private onEditSubmit() {
    let id = +this.activatedRoute.snapshot.paramMap.get('id');
    let updatedAt=new Date()
    this.contactForm.addControl('updatedAt',new FormControl(null, Validators.required));
    this.contactForm.get("updatedAt").setValue(updatedAt);
    let data = this.contactForm.value;
    data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');
    this.contactService.edit(id,
      data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/contact');
        this.toastr.success(this.translate.instant('saveSucess'));
      });
  }

  private createcontactForm() {
    this.contactForm = new FormGroup({
      titleAr: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      addressAr: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      faceBook: new FormControl(null, Validators.required),
      linkedin: new FormControl(null, Validators.required),
      twitter: new FormControl(null, Validators.required),
    });
  }
}
