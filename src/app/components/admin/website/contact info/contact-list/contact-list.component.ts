import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Icontact } from 'src/app/shared/models/contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  
  contactlist:Icontact[] = [];

  constructor(private contactService: ContactService, private toastr: ToastrService, private translate: TranslateService ) { }

  ngOnInit(): void {
    this.initializecontact();
  }

  initializecontact() {
    this.contactService.getContacts().subscribe(contact => {
      console.log(contact);
      this.contactlist = contact
    },
    (err) => {
      console.log(err);
    });
    
  }

  removecontact(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.contactService.remove(id).subscribe(() => {
        let contactIndex = this.contactlist.findIndex(a => a.id == id);
        this.contactlist.splice(contactIndex, 1);
        this.toastr.success(this.translate.instant('saveSucess'));
      })
    }
  }


}
