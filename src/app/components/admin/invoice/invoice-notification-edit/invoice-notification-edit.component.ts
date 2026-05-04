import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InvoiceService } from "../invoice.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DiscountType, InvoiceItem, InvoiceNotificationItem, InvoiceType, Item, ShortOrLong, ZATCAPaymentMethod } from "../../../../shared/models/invoice";
import { IClient } from "../../../../shared/models/client";
import { ClientService } from "../../client/client.service";
import { ITax } from "../../../../shared/models/tax";
import { TaxService } from "../../tax/tax.service";
import { BranchService } from "../../branch/branch.service";
import { IBranch } from "../../../../shared/models/branch";
import { AdditionalContactService } from "../../additional-contact/additional-contact.service";
import { IAdditionalContact } from "../../../../shared/models/additional-contact";
import { BankService } from "../../bank/bank.service";
import { IBank } from "../../../../shared/models/bank";
import { ProductService } from "../../product/product.service";
import { IProduct } from "../../../../shared/models/product";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-invoice-notification-edit',
  templateUrl: './invoice-notification-edit.component.html',
  styleUrls: ['./invoice-notification-edit.component.scss']
})
export class InvoiceNotificationEditComponent implements OnInit {
  @ViewChild('myModal', { static: false }) myModal: ElementRef;
  elm: HTMLElement;
  taxes: ITax[] = [];
  products: IProduct[] = [];
  invoiceNotificationForm: FormGroup;
  invoiceType = InvoiceType.Invoice;
  shortOrLong = ShortOrLong.Short;
  HasPendingMoney: boolean = false;
  productForm: InvoiceNotificationItem = new Item();
  invoiceItems: InvoiceNotificationItem[] = [];
  timeNow = '';
  remarks = '';
  zatcapaymentmethods=ZATCAPaymentMethod.CASH;
  previousProductId: string = '';
  total = 0;
  pipe = new DatePipe('en-US');
  myControl = new FormControl();
  filteredOptions: Observable<IProduct[]>;
  constructor(private invoiceService: InvoiceService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private clientService: ClientService, private taxService: TaxService,
    private branchService: BranchService, private additionalContactService: AdditionalContactService,
    private bankService: BankService, private productService: ProductService, private translate: TranslateService) { }

  ngOnInit(): void {
    let date = new Date()
    this.timeNow = this.pipe.transform(date, "yyyy-MM-dd");
    this.loadTaxes();
    this.loadProducts();
    this.createInvoiceForm();
    this.initializeInvoiceToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
    this.productForm.taxId = 0;
  }

  ngAfterViewInit(): void {
    this.elm = this.myModal.nativeElement as HTMLElement;
  }

  initializeInvoiceToEdit(id: number) {
    this.invoiceService.getInvoiceWithNotification(id).subscribe(invoice => {
      this.invoiceNotificationForm.patchValue(invoice);
      console.log("sssssssssssssssssssssssssssssssssssssss")
      console.log(invoice)
      this.invoiceType = invoice.invoiceType;
      this.shortOrLong = invoice.shortOrLong;
      this.HasPendingMoney = invoice.hasPendingMoney;
       this.remarks = invoice.invoiceNotification.remarks;
      this.invoiceItems = invoice.invoiceNotification.invoiceNotificationItems;
     this.zatcapaymentmethods=invoice.zatcaPaymentMethods;
      this.timeNow = invoice.date.toString().split('T')[0];
      this.invoiceNotificationForm.get('dateOfSupply').setValue(invoice.dateOfSupply.toString().split('T')[0])
      console.log("this.invoiceItems")
      console.log(this.invoiceItems)
    });
  }

  onSubmit() {

      if (this.isFormValid()) {
        if(this.invoiceNotificationForm.valid)
        {
        let id = +this.activatedRoute.snapshot.paramMap.get('id');
        let data = this.invoiceNotificationForm.value;

        data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');

        if(this.invoiceNotificationForm.get('zatcapaymentmethods').value=='10')
        {
          data['zatcapaymentmethods']=10
        }
        else if(this.invoiceNotificationForm.get('zatcapaymentmethods').value=='30')
        {
          data['zatcapaymentmethods']=30
        }
        else if(this.invoiceNotificationForm.get('zatcapaymentmethods').value=='42')
        {
          data['zatcapaymentmethods']=42
        }
        else if(this.invoiceNotificationForm.get('zatcapaymentmethods').value=='48')
        {
          data['zatcapaymentmethods']=48
        };
        data['hasPendingMoney'] = this.invoiceNotificationForm.get('hasPendingMoney').value == 'true';
        data['pendingMoneyType'] = this.invoiceNotificationForm.get('pendingMoneyType').value == '1' ? 1 : 0;
        data['acountantInvoiceType'] = this.invoiceNotificationForm.get('acountantInvoiceType').value == '1' ? 1 : 2;
        data['calculatePendingMoneyAfterTax'] = this.invoiceNotificationForm.get('calculatePendingMoneyAfterTax').value == 'true';
        data['discountType'] = this.invoiceNotificationForm.get('discountType').value == '1' ? 1 : 0;
       // data['remarks'] = this.invoiceNotificationForm.get('remarks');
        data['invoiceNotificationItems'] = this.invoiceItems;
        data['invoiceID'] = +this.activatedRoute.snapshot.paramMap.get('id');
        this.Total();
        data['total'] = this.total;
        data['taxId'] = this.invoiceNotificationForm.get('taxId').value;

        this.invoiceService.editNotification(id, data).subscribe(
          () => {
            this.router.navigateByUrl('/dashboard/invoices');
            this.toastr.success(this.translate.instant('saveSucess'));
          }
        );
    }
    else{ this.toastr.error(this.translate.instant('Remarks Required'));}
  }

  }

  updateItemFromInvoice(index) {
    let targetInvoiceItem = this.invoiceItems[index];

    this.productForm.productDescription = targetInvoiceItem.productDescription;
    this.productForm.quantity = targetInvoiceItem.quantity;
    this.productForm.unitPrice = targetInvoiceItem.unitPrice;
    this.productForm.discountType = targetInvoiceItem.discountType;
    this.productForm.discountValue = targetInvoiceItem.discountValue;
    this.productForm.taxId = targetInvoiceItem.taxId;
    this.productForm.productNum = targetInvoiceItem.productNum;

    this.removeItemFromInvoice(index);
  }

  addNewProduct() {

    if (this.productForm.productDescription && this.productForm.quantity > 0 &&
      this.productForm.discountValue >= 0 && this.productForm.unitPrice!=0 &&
      (this.productForm.discountType == 0 || this.productForm.discountType == 1)
       && this.productForm.taxId!=0) {

      this.productForm.discountType = this.productForm.discountType == 1 ? 1 : 0;
      this.productForm.tax = this.getTaxById(this.productForm.taxId);
      this.invoiceItems.push(this.productForm);
      this.productForm = new Item();

      return true;
    }


    this.toastr.error(this.translate.instant('product form has an error'));
    return false;
    /*  console.log('DiscountValue=' + this.productForm.discountValue);
     console.log('unitPrice=' + this.productForm.unitPrice);
     console.log('discountType=' + this.productForm.discountType);
     console.log('taxId=' + this.productForm.taxId);
     console.log('quantity=' + this.productForm.quantity); */
    // var text = '';
    /*if (!this.productForm.productDescription) { text += ' Description'; }
    if (this.productForm.quantity < 0) { text += ' Quantity'; }
    if (this.productForm.discountValue < 0) { text += '  DiscountValue'; }
    if (!this.productForm.unitPrice) { text += '  UnitPrice'; }
    if (!this.productForm.discountType) { text += '  DiscountType'; }
    if (!this.productForm.taxId) { text += '  TaxId'; }*/

  }

  getTaxById(id: number) {

    let tax = this.taxes.filter(
    tax => tax.id == id);

    return tax[0];

  }

  removeItemFromInvoice(index) {
    this.invoiceItems.splice(index, 1);
    this.productService.remove(index)
  }

  changePendingMoneyState() {
    this.HasPendingMoney = !this.HasPendingMoney;
  }

  close(): void {
    this.elm.classList.remove('show');
    setTimeout(() => {
      this.elm.style.width = '0';
    }, 75);
  }

  open(): void {
    console.log(this.products)
    this.elm.classList.add('show');
    this.elm.style.width = '100vw';
  }

  chooseProduct() {
    console.log(this.previousProductId)
    let pro = this.products.filter(option => option.productName == this.previousProductId)
    console.log(pro)
    this.productService.getProduct(pro[0].id).subscribe(product => {
      this.productForm.productDescription = product.productName;
      this.productForm.unitPrice = product.price;

      this.close();
    });
  }
  onSelectChange(e: any) {
    console.log(e);
    let tax = this.taxes.filter(
      tax => tax.id == e);
    this.productForm.tax = tax[0];
    console.log(this.productForm.tax)
  }
  // private loadTaxes() {
  //   this.taxService.getTaxes().subscribe(taxes => {
  //     this.taxes = taxes;
  //   });
  // }
  private loadTaxes() {
    this.taxService.getAllTaxes().subscribe(taxes => {
      this.taxes = taxes;
      console.log(taxes)
      console.log("taxes")

      this.taxes = taxes;
    });
  }
  private loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }
  private _filter(value: IProduct): IProduct[] {
    if (this.previousProductId == '') {
      return this.products.filter(option => option.productName);
    } else {
      console.log(this.previousProductId)
      return this.products.filter(option => option.productName.includes(this.previousProductId));
    }
  }

  private createInvoiceForm() {
    this.invoiceNotificationForm = new FormGroup({
      acountantInvoiceType: new FormControl('1', Validators.required),
      language: new FormControl('arabic', Validators.required),
      invoiceType: new FormControl('invoiceType'),
      shortOrLong: new FormControl('shortOrLong'),
      dateOfSupply: new FormControl(null),
      remarks: new FormControl(null,Validators.required),
      discount: new FormControl(0),
      discountType: new FormControl(DiscountType.Static),
      taxId: new FormControl(null),
      total: new FormControl(null),
      hasPendingMoney: new FormControl(false),
      pendingMoney: new FormControl(null),
      pendingMoneyType: new FormControl(null),
      calculatePendingMoneyAfterTax: new FormControl(null),
      zatcapaymentmethods: new FormControl(null, Validators.required),
    });
  }

  private isFormValid() {
    if (this.invoiceNotificationForm.get("invoiceType").value == 1 && this.invoiceNotificationForm.get("shortOrLong").value == 0) {
      if (this.isShortInvoiceValid()) {
        return true;
      }
    }

    if (this.invoiceNotificationForm.get("invoiceType").value == 1 && this.invoiceNotificationForm.get("shortOrLong").value == 1) {
      if (this.isLongInvoiceValid()) {
        return true;
      }
    }

    if (this.invoiceNotificationForm.get("invoiceType").value == 2) {
      if (this.isLongInvoiceValid()) {
        return true;
      }
    }

    return false;
  }

  private isShortInvoiceValid(): boolean {


    return true;
  }

  private isLongInvoiceValid(): boolean {
    if (this.invoiceItems.length == 0) {
      this.toastr.error(this.translate.instant('you should add 1 product at least'));
      return false;
    }

    if (this.HasPendingMoney) {
      if (this.invoiceNotificationForm.get("pendingMoney").value == null || this.invoiceNotificationForm.get("pendingMoney").value < 0) {
        this.toastr.error(this.translate.instant('pendingMoney should bigger than or equal zero'));
        return false;
      }

      if (this.invoiceNotificationForm.get("pendingMoneyType").value == null) {
        this.toastr.error(this.translate.instant('pendingMoneyType is required'));
        return false;
      }

      if (this.invoiceNotificationForm.get("calculatePendingMoneyAfterTax").value == null) {
        this.toastr.error(this.translate.instant('calculatePendingMoneyAfterTax is required'));
        return false;
      }

    }

    return true;
  }
  Total() {
    var x;
    this.invoiceItems.forEach(element => {
      this.total = this.total + element.unitPrice * element.quantity;

    });
  }
}
