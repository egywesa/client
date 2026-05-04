import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../environments/environment";
import { AccountService } from "../../account/account.service";
import { PaymentService } from "./payment.service";

@Component({
  selector: 'app-after-payment-success',
  templateUrl: './after-payment-success.component.html',
  styleUrls: ['./after-payment-success.component.scss']
})
export class AfterPaymentSuccessComponent implements OnInit {
  baseUrl = environment.baseUrl;

  constructor(private paymentService: PaymentService, private route: ActivatedRoute, private router: Router) { }
  visible: number;
  ngOnInit(): void {
    // alert("hello");
    console.log('Hiiiiiiiii');
    this.route.queryParams.subscribe(params => {
     
      this.paymentService
        .checkIfPaymentSuccess(params["TranId"], params["amount"], params["TrackId"])
       
        .subscribe(
          (resp) => {

            // console.log(resp);
            if (resp) {
              this.visible = 1;
              //  console.log('111111111111')
              setTimeout(() => {
                this.router.navigateByUrl('/dashboard/invoices');
              }, 2000);
            } else {
              this.visible = 0;
              // console.log('0000000000');
              setTimeout(() => {
                this.router.navigateByUrl('/dashboard/renew-payment');
              }, 2000);

            }
            console.log(this.visible)
           
            
            /*setTimeout(() => {
           this.router.navigateByUrl('/dashboard/invoices');
         }, 2000);*/
          },
          (error) => {
            console.log(error.error);
          }




        );
    });
  }

}
