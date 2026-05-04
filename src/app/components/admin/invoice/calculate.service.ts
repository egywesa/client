import { Injectable } from '@angular/core';
import {
  DiscountType,
  IInvoice,
  Invoice,
  InvoiceItem,
  InvoiceNotification,
  PendingMoneyType
} from "../../../shared/models/invoice";
import {InvoiceService} from "./invoice.service";

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor() { }

  // generateQrCode(invoice: IInvoice): string {
  //   let qrCode = `http://chart.googleapis.com/chart?cht=qr&chl=

   
  //   Seller : ${invoice.user?.company.companyNameEn + " " + invoice.user?.company.companyNameAr}
  //   %0AVAT No : ${invoice.id}
  //   %0ATime: ${invoice.date.toString()}
  //   %0AVAT Amount: ${this.getTotalTax(invoice)}
  //   %0AInvoice Amount: ${this.getTotalPriceAfterTax(invoice)}
  //   &chs=160x160&chld=L|0
  //   `;

  //   return btoa(qrCode);
  // }

  // generateNotificationQrCode(invoice: IInvoice): string {
  //   let qrCode = `http://chart.googleapis.com/chart?cht=qr&chl=
  //   Seller : ${invoice.invoiceNotification.user?.company.companyNameEn + " " + invoice.invoiceNotification.user?.company.companyNameAr}
  //   %0AVAT No : ${invoice.invoiceNotification.id}
  //   %0ATime: ${invoice.invoiceNotification.date.toString()}
  //   %0AVAT Amount: ${this.getNotificationTotalTax(invoice)}
  //   %0AInvoice Amount: ${this.getNotificationTotalPriceAfterTax(invoice)}
  //   &chs=160x160&chld=L|0
  //   `;

  //   return btoa(qrCode);
  // }

  getTotalPriceBeforeTax(invoice: Invoice): number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let discount = invoice.discountType == DiscountType.Static ?
    //     invoice.discount : ( (invoice.discount * invoice.total) / 100 );

    //   return invoice.total - discount;
    // } else {
      let total = 0;
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithoutTax(obj);
      }, 0);

      return total ;
    }


    getTotalWithoutDiscountPriceBeforeTax(invoice: Invoice): number {
     
        let total = 0;
        invoice.invoiceItems.reduce((accumulator, obj) => {
          return total += this.calculateProductTotalwithoutDiscountWithoutTax(obj);
        }, 0);
  
        return total ;
      }
  //}

  getNotificationTotalPriceBeforeTax(invoice: Invoice): number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let discount = invoice.invoiceNotification.discountType == DiscountType.Static ?
    //     invoice.invoiceNotification.discount : ( (invoice.invoiceNotification.discount * invoice.invoiceNotification.total) / 100 );

    //   return invoice.invoiceNotification.total - discount;
    // } else {
      let total = 0;
      invoice.invoiceNotification.invoiceNotificationItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithoutTax(obj);
      }, 0);

      return  total  ;
    }
 // }

  getTotalTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   return ( (invoice.tax.taxValue * this.getTotalPriceBeforeTax(invoice)) / 100 );
    // } else {
     
   
    
    let total = 0;
      invoice.invoiceItems.reduce((accumulator, obj) => {

        
        return total +=this.calculateTaxoneProduct(obj);
      }, 0);
      
      return   total  ;
    
  }

  getsimpleTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   return ( (invoice.tax.taxValue * this.getTotalPriceBeforeTax(invoice)) / 100 );
    // } else {
      let total = 0;
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return total += (obj.tax.taxValue);
      }, 0);

      return total  ;
      console.log(total);
    
  }

  getNotificationTotalTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   return ( (invoice.invoiceNotification.tax.taxValue * this.getNotificationTotalPriceBeforeTax(invoice)) / 100 );
    // } else {
      let total = 0;
      invoice.invoiceNotification.invoiceNotificationItems.reduce((accumulator, obj) => {
        return total  +=this.calculateTaxoneProduct(obj);
      }, 0);

      return total;
    
  }
  getTotalwithoutDiscountPriceAfterTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let tax = ( (invoice.tax.taxValue * this.getTotalPriceBeforeTax(invoice)) / 100 );
    //   return this.getTotalPriceBeforeTax(invoice) + tax;
    // } else {
      let total = 0;
   
      
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return total += this.calculateProductwithoutDiscountTotalWithTax(obj);
      }, 0);
      
      return total;// result .12
      
  }
  getTotalPriceAfterTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let tax = ( (invoice.tax.taxValue * this.getTotalPriceBeforeTax(invoice)) / 100 );
    //   return this.getTotalPriceBeforeTax(invoice) + tax;
    // } else {
      let total = 0;
   
      
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithTax(obj);
      }, 0);
      
      return  Math.round(total * 100) / 100  ;// result .12
      
  }
  getTotalPricewithoutDiscountAfterTax(invoice: Invoice) : number {
    
      let total = 0;
   
      
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithTax(obj);
      }, 0);
      
      return total;// result .12
      
  }
 PendinggetTotalPriceAfterTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let tax = ( (invoice.tax.taxValue * this.getTotalPriceBeforeTax(invoice)) / 100 );
    //   return this.getTotalPriceBeforeTax(invoice) + tax;
    // } else {
      let total = 0;
   
      
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithTax(obj);
      }, 0);
      if (invoice.hasPendingMoney){
        total = total -this.getTotalPendingMoney(invoice);
      }
      return total= Math.round(total * 100) / 100  ;// result .12
      
  }
  getNotificationTotalPriceAfterTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let tax = ( (invoice.invoiceNotification.tax.taxValue * this.getNotificationTotalPriceBeforeTax(invoice)) / 100 );
    //   return this.getNotificationTotalPriceBeforeTax(invoice) + tax;
    // } else {
      let total = 0;
      invoice.invoiceNotification.invoiceNotificationItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithTax(obj);
      }, 0);
      
      return Math.round(total * 100) / 100 ;
    
  }
  PendinggetNotificationTotalPriceAfterTax(invoice: Invoice) : number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let tax = ( (invoice.invoiceNotification.tax.taxValue * this.getNotificationTotalPriceBeforeTax(invoice)) / 100 );
    //   return this.getNotificationTotalPriceBeforeTax(invoice) + tax;
    // } else {
      let total = 0;
      invoice.invoiceNotification.invoiceNotificationItems.reduce((accumulator, obj) => {
        return total += this.calculateProductTotalWithTax(obj);
      }, 0);
      if (invoice.hasPendingMoney){
        total = total -this.getTotalPendingMoney(invoice);
      }
      return Math.round(total * 100) / 100 ;
    
  }
  calculateProductTotalWithoutTax(product: InvoiceItem) {
    let totalProductPriceBeforeTax = (product.unitPrice * product.quantity);
    let discountValue;

    if (product.discountType == DiscountType.Percentage) {
      discountValue = (product.discountValue * totalProductPriceBeforeTax) / 100;
    } else {
      discountValue = product.discountValue;
    }
let total= totalProductPriceBeforeTax - discountValue
    // discount is percent
    return total  ;      
  }
  calculateProductTotalwithoutDiscountWithoutTax(product: InvoiceItem) {
    let total = (product.unitPrice * product.quantity);

    return total  ;      
  }

  
  calculateTaxoneProduct(product: InvoiceItem) :number{
   

   
    let tax= (this.calculateProductTotalWithoutTax(product) * product.tax.taxValue/100);
    // discount is percent
         

    return tax ;


  }

  calculateProductTotalWithTax(product: InvoiceItem) :number{
   
    let total=   this.calculateProductTotalWithoutTax(product) + this.calculateTaxoneProduct(product) ;
    return total ;


  }
  calculateProductwithoutDiscountTotalWithTax(product: InvoiceItem) :number{
   
    // discount is percent
        
         let totalProductPriceBeforeTax = (product.unitPrice * product.quantity);
         let tax=totalProductPriceBeforeTax * (product.tax.taxValue/100)
             let total=   totalProductPriceBeforeTax + tax ;
    
        return total ;
  

  }
  

  getTotalPendingMoney(invoice: Invoice): number {
    let totalPendingMoney: number;
    if (invoice.pendingMoneyType == PendingMoneyType.Static) {
      totalPendingMoney = invoice.pendingMoney;
    } else if (invoice.pendingMoneyType == PendingMoneyType.Percentage) {

      if (invoice.calculatePendingMoneyAfterTax)
      {
        totalPendingMoney = (invoice.pendingMoney * this.getTotalwithoutDiscountPriceAfterTax(invoice)) / 100;
      } else {
        totalPendingMoney = (invoice.pendingMoney * this.getTotalWithoutDiscountPriceBeforeTax(invoice)) / 100;
      }
    }



    return  Math.round(totalPendingMoney * 100) / 100 ;
  }


  getRemainingPendingMoney(invoice: Invoice): number {
    let RemainingPendingMoney: number;
    if (invoice.calculatePendingMoneyAfterTax){
      RemainingPendingMoney=this.getTotalWithoutDiscountPriceBeforeTax(invoice)-this.getTotalPendingMoney(invoice);

    }

     else {
      RemainingPendingMoney=this.getTotalWithoutDiscountPriceBeforeTax(invoice)-this.getTotalPendingMoney(invoice);
     }

    return  Math.round(RemainingPendingMoney * 100) / 100 ; 
  }


  getTotalDiscount(invoice: Invoice): number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let discount = invoice.discountType == DiscountType.Static ?
    //     invoice.discount : ( (invoice.discount * invoice.total) / 100 );

    //   return discount;
    // } else {
      let discount = 0;
      invoice.invoiceItems.reduce((accumulator, obj) => {
        return discount += this.calculateDiscountItem(obj);
      }, 0);

      return  discount ;
    
  }
  getNotificationTotalDiscount(invoice: Invoice): number {
    // if (invoice.invoiceType == 1 && invoice.shortOrLong == 0) {
    //   let discount = invoice.discountType == DiscountType.Static ?
    //     invoice.discount : ( (invoice.discount * invoice.total) / 100 );

    //   return discount;
    // } else {
      // فث
      let discount = 0;
      invoice.invoiceNotification.invoiceNotificationItems.reduce((accumulator, obj) => {
        return discount += this.calculateDiscountItem(obj);
      }, 0);

      return  discount   ;           
    
  }
  calculateDiscountItem(product: InvoiceItem): number {
    let totalProductPriceBeforeTax = (product.unitPrice * product.quantity);
    let discountValue;

    if (product.discountType == DiscountType.Percentage) {
      discountValue = (product.discountValue * totalProductPriceBeforeTax) / 100;
    } else {
      discountValue = product.discountValue;
    }

    // discount is percent
    return   discountValue  ;
  }
}