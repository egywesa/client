import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bill-claims',
  templateUrl: './bill-claims.component.html',
  styleUrls: ['./bill-claims.component.scss']
})
export class BillClaimsComponent implements OnInit {

  form!: FormGroup;
  clients: any[] = [];
  banks: any[] = [];
  taxes: any[] = [];
  isLoading = false;
  submitSuccess = false;
  savedClaim: any = null;

  discountTypes = [
    { value: 0, label: 'مبلغ ثابت' },
    { value: 1, label: 'نسبة مئوية %' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
    this.loadBanks();
    this.loadTaxes();
  }

  initForm(): void {
    this.form = this.fb.group({
      clientId: [null, Validators.required],
      bankId: [null],
      claimDate: [new Date().toISOString().split('T')[0], Validators.required],
      notes: [''],
      taxId: [null],
      discount: [0],
      discountType: [0],
      items: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      taxId: [null]
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  loadClients(): void {
    this.http.get<any[]>(`${environment.baseUrl}api/Clients/Lookup?language=ar`).subscribe({
      next: (data) => this.clients = data,
      error: () => this.clients = []
    });
  }

  loadBanks(): void {
    this.http.get<any[]>(`${environment.baseUrl}api/Banks/Lookup`).subscribe({
      next: (data) => this.banks = data,
      error: () => this.banks = []
    });
  }

  loadTaxes(): void {
    this.http.get<any[]>(`${environment.baseUrl}api/Taxis`).subscribe({
      next: (data) => this.taxes = data,
      error: () => this.taxes = []
    });
  }

  getItemTotal(index: number): number {
    const item = this.items.at(index).value;
    return (item.quantity || 0) * (item.price || 0);
  }

  getSubtotal(): number {
    return this.items.controls.reduce((sum, _, i) => sum + this.getItemTotal(i), 0);
  }

  getDiscountAmount(): number {
    const discount = this.form.get('discount')?.value || 0;
    const discountType = this.form.get('discountType')?.value;
    if (discountType === 1) {
      return (this.getSubtotal() * discount) / 100;
    }
    return discount;
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscountAmount();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      ...this.form.value,
      claimDate: this.form.value.claimDate
    };

    this.http.post(`${environment.baseUrl}api/FinancialClaims`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.submitSuccess = true;
        this.savedClaim = { ...payload, id: res?.id || res };
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getClientName(): string {
    const client = this.clients.find(c => c.id == this.form.get('clientId')?.value);
    return client ? (client.name || client.clientName) : '';
  }

  getBankName(): string {
    const bank = this.banks.find(b => b.id == this.form.get('bankId')?.value);
    return bank ? bank.bankName : '';
  }

  getTaxName(taxId: number): string {
    const tax = this.taxes.find(t => t.id == taxId);
    return tax ? tax.taxName : '';
  }

  printInvoice(): void {
    window.print();
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.savedClaim = null;
    this.initForm();
  }
}
