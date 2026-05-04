import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { InvoiceService } from "../invoice.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DiscountType, InvoiceItem, InvoiceType,Item, PoNumberNum, ShortOrLong, ZATCAInvoiceType, ZATCAPaymentMethod } from "../../../../shared/models/invoice";
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
import { data } from 'jquery';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CountryService } from '../../city/country.service';
import { CityService } from '../../city/city.service';
import { ICity } from 'src/app/shared/models/city';
import { ICountry } from 'src/app/shared/models/country';
import { validationXhtmlIcon } from '@progress/kendo-svg-icons';
@Component({
  selector: 'app-invoice-add-or-edit',
  templateUrl: './invoice-add-or-edit.component.html',
  styleUrls: ['./invoice-add-or-edit.component.scss']
})

export class InvoiceAddOrEditComponent implements OnInit {
  @ViewChild('myModal', { static: false }) myModal: ElementRef;
  @ViewChild('clientAddNewModel', { static: false }) clientAddNewModel: ElementRef;
  pipe = new DatePipe('en-US');
  elm: HTMLElement;
  clientElm: HTMLElement;
  clients: IClient[] = [];
  cities: ICity[];
  countries: ICountry[];
  taxes: ITax[] = [];
  branches: IBranch[] = [];
  companyId:number;
  additionalContacts: IAdditionalContact[] = [];
  banks: IBank[] = [];
  products: IProduct[] = [];
  invoiceForm: FormGroup;
  invoiceType = InvoiceType.Invoice;
  poNumberNum=PoNumberNum.poNumber;
  shortOrLong = ShortOrLong.Short;
  PoNumber:string;
  productForm: InvoiceItem = new Item();
  invoiceItems: InvoiceItem[] = [];
  timeNow = ''
  previousProductId: string;
  clientForm: FormGroup;

  constructor(private countryService:CountryService, private   cityService: CityService,private invoiceService: InvoiceService, private router: Router,
    private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private clientService: ClientService, private taxService: TaxService,
    private branchService: BranchService, private additionalContactService: AdditionalContactService,
    private bankService: BankService, private productService: ProductService,
    private translate: TranslateService,private formBuilder: FormBuilder) { }
  myControl = new FormControl();
  filteredOptions: Observable<IProduct[]>;
  ngOnInit(): void {
    this.invoiceForm = this.formBuilder.group({
      bankId: [''] // Set the initial value to an empty string
    });
    this.previousProductId=""
    let date = new Date()
    this.timeNow = this.pipe.transform(date, "yyyy-MM-dd");
    this.getAllowAditDate();
    this.loadClients();
    this.loadTaxes();
    this.loadBranches(this.companyId);
    this.loadAdditionalContacts();
    this.loadBanks();
    this.loadProducts();
    this.createInvoiceForm();
    this.createClientForm();
    this.initializeInvoiceToEdit(+this.activatedRoute.snapshot.paramMap.get('id'));
    //this.productForm.taxId = 4;
    this.productForm.taxId = 0;
  }
  private _filter(value: IProduct): IProduct[] {
    if(this.previousProductId == ''){
    return this.products.filter(option => option.productName);
    }else{
      return this.products.filter(option => option.productName.includes(this.previousProductId));
    }
  }
  ngAfterViewInit(): void {
    this.elm = this.myModal.nativeElement as HTMLElement;
    this.clientElm = this.clientAddNewModel.nativeElement as HTMLElement;

  }
  clearSelection(){
    this.invoiceForm.get('bankId').reset();
  }

  selectedClient(event: any) {
    ///////////////////////
    const filteredClients = this.clients.filter(c => c.name == event.target.value);
    if (filteredClients.length > 0) {
      this.invoiceForm.get('clientId').patchValue(filteredClients[0].id);
    }

  }

  initializeInvoiceToEdit(id: number) {
    if (id > 0) {

      this.invoiceService.getInvoicelang(id).subscribe(invoice => {
        this.invoiceForm.patchValue(invoice);
        this.invoiceType = invoice.invoiceType;
        this.poNumberNum = invoice.poNumberNum;
        this.shortOrLong = invoice.shortOrLong;
        this.PoNumber=invoice.PoNumber;
        this.HasPendingMoney = invoice.hasPendingMoney;
       
        this.invoiceItems = invoice.invoiceItems;
        this.timeNow = invoice.date.toString().split('T')[0];
        this.invoiceForm.get('dateOfSupply').setValue(invoice.dateOfSupply.toString().split('T')[0])
        this.invoiceForm.get('date').setValue(invoice.date.toString().split('T')[0])



      });

    }

  
  }
  getTaxById(id: number) {

    let tax = this.taxes.filter(
    tax => tax.id == id);

    return tax[0];

  }
  onSubmit() {
    if (+this.activatedRoute.snapshot.paramMap.get('id') > 0) {
      
      this.onEditSubmit();
    } else {
      this.onCreateSubmit();
    }
  }

  addNewProduct() {
    

    if (this.isTaxidValid) {

      if(this.productForm.discountValue == null){
        this.productForm.discountType == 0
      }

      if (this.productForm.productDescription &&
          this.productForm.quantity > 0 &&
          this.productForm.discountValue >= 0 &&
          this.productForm.unitPrice != 0 &&
         (this.productForm.discountType == 0 || this.productForm.discountType == 1) &&
         this.productForm.taxId != 0) {

        this.productForm.discountType = this.productForm.discountType == 1 ? 1 : 0;
        this.productForm.tax = this.getTaxById(this.productForm.taxId);
if( this.productForm.discountValue ==null){
  this.productForm.discountValue=0;
}
        this.invoiceItems.push(this.productForm);
        this.productForm = new Item();

        //this.productForm.taxId = 4;

        return true;
        }

    }

    this.toastr.error(this.translate.instant('product form has an error'));
    return false;
  }

  removeItemFromInvoice(index) {
    this.invoiceItems.splice(index, 1);
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

  HasPendingMoney: boolean = false;
  changePendingMoneyState() {
    this.HasPendingMoney = !this.HasPendingMoney;

    
  }
  HasPendingMoney2: boolean = false;
  changePendingMoneyState2() {
    this.HasPendingMoney2 = true;
    
    
  }



  close(): void {
    this.elm.classList.remove('show');
    setTimeout(() => {
      this.elm.style.width = '0';
    }, 75);
  }

  open(): void {
    this.previousProductId=""
    this.elm.classList.add('show');
    this.elm.style.width = '100vw';
  }

  chooseProduct() {

   let pro= this.products.filter(option => option.productName==this.previousProductId)

    this.productService.getProduct(pro[0].id).subscribe(product => {
      this.productForm.productDescription = product.productName;
      this.productForm.unitPrice = product.price;
      this.close();
    });
  }
  private initializeCities() {
    this.cityService.getCities().subscribe(cities => this.cities = cities);
  }
  private initializeCountry() {
    this.countryService.geCountry().subscribe(country => this.countries = country);
  }



  addNewClient() {

    this.clientService.addNew(this.clientForm.value).subscribe(client => {

      this.clients.push({
        id: client.id,
        name: client.nameAr,
        administratorName: "",
        address: "",
        email: "",
        phone: "",
        tin: "",
        clientNum: "",
        qbId: 0,
        qbUserId: 0,
        xeroId: 0,
        xeroUserId: 0,
        companyId: 0,
        companyName: "",
      });

      this.invoiceForm.patchValue({ 'clientId': client.id });
      this.toastr.success(this.translate.instant('saveSucess'));
      this.closeClientForm();
    });
  }

  closeClientForm(): void {
    this.clientElm.classList.remove('show');
    setTimeout(() => {
      this.clientElm.style.width = '0';
    }, 75);
  }

  openClientForm(): void {
    this.clientElm.classList.add('show');
    this.clientElm.style.width = '100vw';
    this.initializeCities();
    this.initializeCountry();
  }

  private createClientForm() {
    this.clientForm = new FormGroup({
      nameAr: new FormControl(null, Validators.required),
      nameEn: new FormControl(null),
      administratorNameAr: new FormControl(null),
      administratorNameEn: new FormControl(null),
      addressAr: new FormControl(null),
      addressEn: new FormControl(null),
      phone: new FormControl(null),
      
      tin: new FormControl(null, [Validators.pattern('^[0-9]{15}$')]),

      email: new FormControl(null),

      buildingNumber: new FormControl(null, [Validators.pattern('^[0-9]{4}$')]),
      citySubdivisionName: new FormControl(null),
    //  country: new FormControl('SA'),
      countrySubentity: new FormControl(null),
      countryId: new FormControl(null),
      cityId: new FormControl(null),
      plotIdentification: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
      postalZone: new FormControl(null, [Validators.pattern('^[0-9]{5}$')]),
      streetName: new FormControl(null),
      commercialRegNumber: new FormControl(null,[Validators.pattern('^[0-9]{10}$')]),



    });
  }

  private loadClients() {
    this.clientService.getClientLookups().subscribe(clients => {
      this.clients = clients;
    });
  }

  private loadTaxes() {
    this.taxService.getTaxes().subscribe(taxes => {
      this.taxes = taxes;
    });
  }

  private loadBranches(companyId) {

    this.branchService.getBranchsLookups(companyId).subscribe(branches => {
      this.branches = branches;
      this.companyId=companyId;
    });
  }

  private loadAdditionalContacts() {
    this.additionalContactService.getAdditionalContactLookups().subscribe(additionalContacts => {
      this.additionalContacts = additionalContacts;
    });
  }

  private loadBanks() {
    this.bankService.getBankLookups().subscribe(banks => {
      this.banks = banks;
    });
  }
  visible: number;
private getAllowAditDate(){

this.invoiceService.AllowAditeDate().subscribe( (resp) => {

    if (resp) {
      this.visible = 1;
    }
    else {
      this.visible = 0;

    }
    if(this.visible==0){
      let data = this.invoiceForm.value;

      this.invoiceForm.get('date').value ==" ";

     }
  }
)


}
  private loadProducts() {

    this.productService.getProducts().subscribe(products => {
      this.products = products;

      this.filteredOptions = this.myControl.valueChanges.pipe(
         startWith(''),
        map(value => this._filter(value) )
      );
    });
  }

  private onCreateSubmit() {
    if(this.visible==0){
      this.invoiceForm.removeControl('date')
    }



    if (this.isFormValid()) {
      let data = this.invoiceForm.value;


      data['isDraft'] = this.invoiceForm.get('isDraft').value.toString() === 'true';
      
      if(!this.invoiceForm.get("zatcaPaymentMethods").value)
        {
          this.toastr.error(this.translate.instant('zatcaPaymentMethods is required'));
        }

      if(this.invoiceForm.get('zatcaPaymentMethods').value=='10')
      {
        data['zatcaPaymentMethods']=10
      }
      else if(this.invoiceForm.get('zatcaPaymentMethods').value=='30')
      {
        data['zatcaPaymentMethods']=30
      }
      else if(this.invoiceForm.get('zatcaPaymentMethods').value=='42')
      {
        data['zatcaPaymentMethods']=42
      }
      else if(this.invoiceForm.get('zatcaPaymentMethods').value=='48')
      {
        data['zatcaPaymentMethods']=48
      };
      data['hasPendingMoney'] = this.invoiceForm.get('hasPendingMoney').value=== 'true' ? true: false;

      console.log(this.invoiceForm.get('hasPendingMoney').value);
      console.log("bbbbbbbbbbbbbbbbb");
      data['pendingMoneyType'] = this.invoiceForm.get('pendingMoneyType').value == '1' ? 1 : 0;
      data['calculatePendingMoneyAfterTax'] = this.invoiceForm.get('calculatePendingMoneyAfterTax').value == 'true';
      
      data['invoiceType'] = this.invoiceForm.get('invoiceType').value=='2'?2:1;
      console.log(this.invoiceForm.get('poNumberNum').value);
      data['poNumberNum'] = this.invoiceForm.get('poNumberNum').value=='0'? 0 : this.invoiceForm.get('poNumberNum').value=='1'?1:2;
    
      data['invoiceItems'] = this.invoiceItems;


      if(this.invoiceItems==null){
        err => {
          this.toastr.error(this.translate.instant(err.error.errorMessage));
        };
      }

      this.invoiceService.addNew(data).subscribe(() => {
        this.router.navigateByUrl('/dashboard/invoices');
        this.toastr.success(this.translate.instant('saveSucess'));
      }, err => {
        this.toastr.error(this.translate.instant(err.error.errorMessage));
      });
    }
  }

  private onEditSubmit() {
      if(this.isFormValid()){
          let id = +this.activatedRoute.snapshot.paramMap.get('id');
          let data = this.invoiceForm.value;

          data['id'] = +this.activatedRoute.snapshot.paramMap.get('id');
          data['isDraft'] = this.invoiceForm.get('isDraft').value.toString() === 'true';

          if(this.invoiceForm.get('zatcaPaymentMethods').value==null) {
              this.toastr.error(this.translate.instant('zatcaPaymentMethods is required'));
          }

          if(this.invoiceForm.get('zatcaPaymentMethods').value=='10') {
            data['zatcaPaymentMethods']=10
          }
          else if(this.invoiceForm.get('zatcaPaymentMethods').value=='30') {
            data['zatcaPaymentMethods']=30
          }
          else if(this.invoiceForm.get('zatcaPaymentMethods').value=='42') {
            data['zatcaPaymentMethods']=42
          }
          else if(this.invoiceForm.get('zatcaPaymentMethods').value=='48') {
            data['zatcaPaymentMethods']=48
          }

          data['pendingMoneyType'] = this.invoiceForm.get('pendingMoneyType').value == '1' ? 1 : 0;
          data['calculatePendingMoneyAfterTax'] = this.invoiceForm.get('calculatePendingMoneyAfterTax').value === 'true' ? true : false;
          data['invoiceType'] = this.invoiceForm.get('invoiceType').value == '1' ? 1 : 2;
          data['poNumberNum'] = this.invoiceForm.get('poNumberNum').value=='0'? 0 : this.invoiceForm.get('poNumberNum').value=='1'?1:2;
          data['invoiceItems'] = this.invoiceItems;

          // Fix for hasPendingMoney
          const hasPendingMoneyValue = this.invoiceForm.get('hasPendingMoney').value;
          data['hasPendingMoney'] = hasPendingMoneyValue === true || hasPendingMoneyValue === 'true';
          this.HasPendingMoney = data['hasPendingMoney'];

          this.invoiceService.edit(id, data).subscribe({
            next: () => {
              this.router.navigateByUrl('/dashboard/invoices');
              this.toastr.success(this.translate.instant('saveSucess'));
            },
            error: err => {
              this.toastr.error(this.translate.instant(err.error.errorMessage));
            }
          });
      }
  }
  private createInvoiceForm() {
    this.invoiceForm = new FormGroup({
      language: new FormControl('arabic', Validators.required),
      invoiceType: new FormControl(InvoiceType.Invoice, Validators.required),
      poNumberNum: new FormControl(null),
      shortOrLong: new FormControl(ShortOrLong.Short, Validators.required),
      poNumber:new FormControl(null),
      clientId: new FormControl(null),
      date: new FormControl(null),
      dateOfSupply: new FormControl(null, Validators.required),
      notes: new FormControl(null),
      branchId: new FormControl(null),
      bankId: new FormControl(null),
      additionalContactId: new FormControl(null),
      hasPendingMoney: new FormControl(false),
      pendingMoney: new FormControl(null),
      pendingMoneyType: new FormControl(null),
      calculatePendingMoneyAfterTax: new FormControl(null),
      isDraft: new FormControl(false),
      zatcaPaymentMethods: new FormControl(null),
      zatcainvoicetypes: new FormControl(388),
    });
  }

  private isFormValid() {
    if (this.invoiceForm.get("invoiceType").value == 1 &&this.isLongInvoiceValid() ) {
      if (this.isClientIdValid()) {
        return true;
      }
    }


    if (this.invoiceForm.get("invoiceType").value == 2) {
      if (this.isLongInvoiceValid()) {
        return true;
      }
    }

    return false;


  }

  private isTaxidValid(): boolean {
    if (this.productForm.taxId == 0) {
      this.toastr.error(this.translate.instant('Tax is required'));
      return false;
    }

    return true;
  }


  private unitPriceValid(): boolean {
    if (this.productForm.unitPrice == 0) {
      this.toastr.error(this.translate.instant('unitPrice is must not zero'));
      return false;
    }

    return true;
  }

  

  private isClientIdValid(): boolean {
    if (!this.invoiceForm.get("clientId").value) {
      this.toastr.error(this.translate.instant('client is required'));
      return false;
    }

    return true;
  }
//   ConvertInt(event:any){
// event.target.value=parseInt(event.target.value,10)
//   }
  private isLongInvoiceValid(): boolean {
    if (this.invoiceItems.length == 0) {
      this.toastr.error(this.translate.instant('you should add 1 product at least'));
      return false;
    }

    if (this.HasPendingMoney) {
      if (this.invoiceForm.get("pendingMoney").value == null || this.invoiceForm.get("pendingMoney").value < 0) {
        this.toastr.error(this.translate.instant('pendingMoney should bigger than or equal zero'));
        return false;
      }
     
      if (this.invoiceForm.get("pendingMoneyType").value == null) {
        this.toastr.error(this.translate.instant('pendingMoneyType is required'));
        return false;
      }

      if (this.invoiceForm.get("calculatePendingMoneyAfterTax").value == null) {
        this.toastr.error(this.translate.instant('calculatePendingMoneyAfterTax is required'));
        return false;

       
      }

      if (this.invoiceForm.get("isDraft").value == null) {
        this.toastr.error(this.translate.instant('isDraft is required'));
        return false;
      }

  
    }

    return true;
  }
}
