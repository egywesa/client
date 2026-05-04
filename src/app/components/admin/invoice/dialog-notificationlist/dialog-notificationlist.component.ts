import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInvoiceNotification } from 'src/app/shared/models/invoice';
import { InvoiceService } from '../invoice.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/components/account/account.service';
import { map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-notificationlist',
  templateUrl: './dialog-notificationlist.component.html',
  styleUrls: ['./dialog-notificationlist.component.scss']
})
export class DialogNotificationlistComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    private accountService: AccountService,private translateService:TranslateService,private toastr:ToastrService,
    public dialogRef: MatDialogRef<DialogNotificationlistComponent>, private invoiceService: InvoiceService) { }
  currentInvoiceId: any;
  admin: any;

  currentOpenedNotifications: IInvoiceNotification[];
  ngOnInit(): void {
    this.currentInvoiceId = this.data.invoicrId;

    console.log(this.data);
    this.getinvoiceNotification()
    let admin = this.checkadmin().subscribe((res) => {
      console.log(res);
      this.admin = res;
    });
  }

  checkadmin() {
    return this.accountService.currentUser$.pipe(
      map(admin => {
        if (admin) {
          console.log("in admin")
          if (admin.roles.includes("Admin")) return true;
        } else {
        }
        return false;
      })
    );
  }
  VerfyNotification(id:number)
  {
    this.invoiceService.verifyNotificationZatca(id).subscribe({
      next:data=>{
        document.getElementById('verified').innerText=this.translateService.instant('zatca is verified');
      },
      error:err=>{this.toastr.error('Not Verified')}
    })

  }
  getinvoiceNotification() {
    this.invoiceService.getInvoiceNotifications(this.currentInvoiceId).subscribe(notifications => {
      this.currentOpenedNotifications = notifications;
    });
  }
  addnew() {

    this.router.navigateByUrl('/dashboard/invoice-notifications/add/' + this.currentInvoiceId);
    this.dialogRef.close(true);
    setTimeout(function () {
      location.reload()
    }, 50);
  }
  close() {
    this.dialogRef.close(true);
  }
  removenotification(id: number) {
    if (confirm("هل انت متأكد ؟")) {
      this.invoiceService.removeInvoiceWithNotification(id).subscribe(() => {
        let invoiceIndex = this.currentOpenedNotifications.findIndex(a => a.id == id);
        this.currentOpenedNotifications.splice(invoiceIndex, 1);
        window.location.reload();
      })
    }
  }
}
