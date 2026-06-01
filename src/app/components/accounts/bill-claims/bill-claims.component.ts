import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  selectedBank: any = null;
  selectedClient: any = null;

  isLoading = false;
  isExporting = false;

  submitSuccess = false;
  savedClaim: any = null;

  invoiceProfile: any = null;
  companyLogoUrl = 'assets/logo.png';

  discountTypes = [
    { value: 0, label: 'مبلغ ثابت' },
    { value: 1, label: 'نسبة مئوية %' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
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
    if (this.items.length === 1) return;
    this.items.removeAt(index);
  }

  // ==================== LOAD DATA ====================

  loadUserProfile(): void {
    this.http.get<any>(`${environment.baseUrl}api/Auth/profile`).subscribe({
      next: (data) => {
        this.companyLogoUrl = this.buildFileUrl(data?.logoLink || data?.company?.logo || data?.logo);

        this.invoiceProfile = {
          user: {
            ...data,
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            email: data?.email || '',
            phone: data?.phone || data?.phoneNumber || data?.mobile || '',
            company: {
              ...(data?.company || {}),
              ...data,
              companyNameAr: data?.company?.companyNameAr || data?.companyNameAr || data?.companyName || '',
              companyNameEn: data?.company?.companyNameEn || data?.companyNameEn || '',
              companyAddressAr: data?.company?.companyAddressAr || data?.companyAddressAr || data?.addressAr || '',
              companyAddressEn: data?.company?.companyAddressEn || data?.companyAddressEn || data?.addressEn || '',
              cityName: data?.company?.cityName || data?.cityName || data?.city || '',
              tin: data?.company?.tin || data?.tin || '',
              vat: data?.company?.vat || data?.vat || data?.vatNumber || data?.taxNumber || '',
              commercialRegNumber: data?.company?.commercialRegNumber || data?.commercialRegNumber || '',
              phone: data?.companyPhone || data?.phone || data?.phoneNumber || '',
              logo: data?.company?.logo || data?.logo || this.companyLogoUrl
            }
          }
        };

        console.log('PROFILE:', data);
      },
      error: (err) => {
        console.error('Load profile error:', err);
        this.companyLogoUrl = 'assets/logo.png';
      }
    });
  }

  loadClients(): void {
    // تستخدم فقط للـ dropdown، بيانات الطباعة لا تعتمد عليها
    this.http.get<any>(`${environment.baseUrl}api/Clients/Lookup?language=ar`).subscribe({
      next: (data) => {
        this.clients = Array.isArray(data) ? data : (data?.data || data?.items || []);
        console.log('CLIENTS LOOKUP:', this.clients);
      },
      error: (err) => {
        console.error('Load clients error:', err);
        this.clients = [];
        this.selectedClient = null;
      }
    });
  }

  loadFinancialClaimDetails(claimId: any, fallbackPayload: any = null): void {
    const id = Number(claimId);

    if (!id) {
      if (fallbackPayload) {
        this.applyClaimData(fallbackPayload);
      }
      this.isLoading = false;
      this.submitSuccess = true;
      return;
    }

    this.http.get<any>(`${environment.baseUrl}api/FinancialClaims/${id}`).subscribe({
      next: (res) => {
        this.applyClaimData(res, fallbackPayload || {});

        this.isLoading = false;
        this.submitSuccess = true;

        console.log('FINANCIAL CLAIM DETAILS:', this.savedClaim);
        console.log('CLIENT FROM FINANCIAL CLAIM:', this.savedClaim?.client);
        console.log('CLIENT EN NAME:', this.getClientNameEn());
        console.log('CLIENT ADDRESS EN:', this.getClientAddressEn());
        console.log('CLIENT CRN:', this.getClientCrn());
        console.log('CLIENT VAT:', this.getClientVat());
        console.log('CLIENT NUMBER:', this.getClientNumber());
      },
      error: (err) => {
        console.error('Load financial claim details error:', err);
        if (fallbackPayload) {
          this.applyClaimData(fallbackPayload);
        }
        this.isLoading = false;
        this.submitSuccess = true;
      }
    });
  }

  loadBanks(): void {
    this.http.get<any>(`${environment.baseUrl}api/Banks/Lookup`).subscribe({
      next: (data) => {
        this.banks = Array.isArray(data) ? data : (data?.data || data?.items || []);
        console.log('BANKS LOOKUP:', this.banks);
      },
      error: (err) => {
        console.error('Load banks error:', err);
        this.banks = [];
        this.selectedBank = null;
      }
    });
  }

  loadBankDetails(bankId: any): void {
    const id = Number(bankId);

    if (!id) {
      this.selectedBank = null;
      return;
    }

    this.http.get<any>(`${environment.baseUrl}api/Banks/${id}`).subscribe({
      next: (res) => {
        const fullBank = res?.data || res?.result || res;

        this.selectedBank = this.mergeWithoutEmptyValues(
          this.findBank(id) || {},
          fullBank
        );

        console.log('FULL BANK DETAILS:', this.selectedBank);
      },
      error: (err) => {
        console.error('Load bank details error:', err);
        this.selectedBank = this.findBank(id);
      }
    });
  }

  loadTaxes(): void {
    this.http.get<any>(`${environment.baseUrl}api/Taxis`).subscribe({
      next: (data) => {
        this.taxes = Array.isArray(data) ? data : (data?.data || data?.items || []);
        console.log('TAXES:', this.taxes);
      },
      error: (err) => {
        console.error('Load taxes error:', err);
        this.taxes = [];
      }
    });
  }

  // ==================== SELECT EVENTS ====================

  onClientSelect(event: any): void {
    const clientId = event?.id ?? event ?? this.form.get('clientId')?.value;

    if (!clientId) {
      this.selectedClient = null;
      return;
    }

    // فقط للعرض قبل الحفظ أو للـ dropdown. بيانات الطباعة تأتي من FinancialClaims/{id}
    this.selectedClient = this.findClient(clientId);
  }

  onBankSelect(event: any): void {
    const bankId = event?.id ?? event ?? this.form.get('bankId')?.value;

    if (!bankId) {
      this.selectedBank = null;
      return;
    }

    this.selectedBank = this.findBank(bankId);
    this.loadBankDetails(bankId);
  }

  // ==================== HELPERS ====================

  private toNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    if (typeof value === 'string') {
      value = value.replace('%', '').trim();
    }

    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  private toNullableNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  private cleanValue(value: any): string {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      value === 'null' ||
      value === 'undefined'
    ) {
      return '—';
    }

    return String(value).trim();
  }

  private mergeWithoutEmptyValues(base: any, override: any): any {
    const result = { ...(base || {}) };

    Object.keys(override || {}).forEach((key) => {
      const value = override[key];

      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'null' &&
        value !== 'undefined'
      ) {
        result[key] = value;
      }
    });

    return result;
  }

  private normalizeClaimResponse(res: any, payload: any = {}): any {
    const apiData = res?.data || res?.result || res || {};

    return {
      ...payload,
      ...apiData,
      id: apiData?.id || res?.id || res?.data?.id || res?.result?.id || payload?.id,
      claimNumber: apiData?.claimNumber || payload?.claimNumber,
      clientId: apiData?.clientId || payload?.clientId,
      bankId: apiData?.bankId || payload?.bankId,
      client: apiData?.client || res?.client || payload?.client || null,
      bank: apiData?.bank || res?.bank || payload?.bank || null,
      user: apiData?.user || res?.user || payload?.user || null,
      claimDate: apiData?.claimDate || payload?.claimDate,
      notes: apiData?.notes ?? payload?.notes ?? '',
      discount: apiData?.discount ?? payload?.discount ?? 0,
      discountType: apiData?.discountType ?? payload?.discountType ?? 0,
      total: apiData?.total ?? payload?.total ?? 0,
      netTotal: apiData?.netTotal ?? payload?.netTotal,
      taxAmount: apiData?.taxAmount ?? payload?.taxAmount,
      grandTotal: apiData?.grandTotal ?? payload?.grandTotal,
      items: apiData?.items || apiData?.invoiceItems || payload?.items || []
    };
  }

  private applyClaimData(res: any, payload: any = {}): void {
    this.savedClaim = this.normalizeClaimResponse(res, payload);

    // أهم جزء: بيانات العميل للطباعة من /api/FinancialClaims/{id}
    if (this.savedClaim?.client) {
      this.selectedClient = this.savedClaim.client;
    }

    if (this.savedClaim?.bank) {
      this.selectedBank = this.savedClaim.bank;
    }

    if (this.savedClaim?.user) {
      this.invoiceProfile = {
        ...this.invoiceProfile,
        user: this.savedClaim.user
      };

      const logo = this.savedClaim?.user?.company?.logo;
      if (logo) {
        this.companyLogoUrl = this.buildFileUrl(logo);
      }
    }
  }

  private getPureEnglishValue(...values: any[]): string {
    for (const value of values) {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value === 'null' ||
        value === 'undefined'
      ) {
        continue;
      }

      const text = String(value).trim();

      if (!text) {
        continue;
      }

      const hasArabic = /[\u0600-\u06FF]/.test(text);

      if (!hasArabic) {
        return text;
      }
    }

    return '—';
  }

  private getArabicOrAnyValue(...values: any[]): string {
    for (const value of values) {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value === 'null' ||
        value === 'undefined'
      ) {
        continue;
      }

      const text = String(value).trim();

      if (text) {
        return text;
      }
    }

    return '—';
  }

  private buildFileUrl(path: string): string {
    if (!path) {
      return 'assets/logo.png';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    return `https://demo.saudifatora.com/${cleanPath}`;
  }

  private findClient(id: any): any | null {
    if (!id || !this.clients || !this.clients.length) {
      return null;
    }

    return this.clients.find((client: any) => Number(client.id) === Number(id)) || null;
  }

  private findBank(id: any): any | null {
    if (!id || !this.banks || !this.banks.length) {
      return null;
    }

    return this.banks.find((bank: any) => Number(bank.id) === Number(id)) || null;
  }

  private extractCreatedClaimId(res: any): any {
    if (typeof res === 'number' || typeof res === 'string') {
      return res;
    }

    return (
      res?.id ||
      res?.data?.id ||
      res?.result?.id ||
      res?.claimId ||
      res?.data?.claimId ||
      res?.result?.claimId ||
      res?.claimNumber ||
      res?.data?.claimNumber ||
      res?.result?.claimNumber ||
      null
    );
  }

  // ==================== LOGO ====================

  getCompanyLogoUrl(): string {
    return this.companyLogoUrl || 'assets/logo.png';
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/logo.png';
  }

  // ==================== CALCULATIONS ====================

  getItemTotal(index: number): number {
    const item = this.items.at(index).value;
    return this.toNumber(item.quantity) * this.toNumber(item.price);
  }

  getTaxRate(taxId: any): number {
    const tax = this.taxes.find((t: any) => Number(t.id) === Number(taxId));

    if (!tax) {
      return 0;
    }

    const possibleRate =
      tax.taxRate ??
      tax.rate ??
      tax.percentage ??
      tax.percent ??
      tax.taxPercentage ??
      tax.taxPercent ??
      tax.taxValue ??
      tax.taxAmount ??
      tax.value ??
      tax.amount ??
      0;

    return this.toNumber(possibleRate);
  }

  getTaxRateLabel(taxId: any): string {
    const rate = this.getTaxRate(taxId);
    return rate > 0 ? `${rate}%` : '—';
  }

  getItemDiscountAmount(item: any): number {
    const itemSubtotal = this.toNumber(item.quantity) * this.toNumber(item.price);
    const subtotal = this.getSubtotal();
    const totalDiscount = this.getDiscountAmount();

    if (itemSubtotal <= 0 || subtotal <= 0 || totalDiscount <= 0) {
      return 0;
    }

    return (itemSubtotal / subtotal) * totalDiscount;
  }

  getItemTotalBeforeVatAfterDiscount(item: any): number {
    const itemSubtotal = this.toNumber(item.quantity) * this.toNumber(item.price);
    const itemDiscount = this.getItemDiscountAmount(item);

    return Math.max(itemSubtotal - itemDiscount, 0);
  }

  getItemVatAmount(item: any): number {
    const apiVat = this.toNumber(item?.taxAmount);
    if (apiVat > 0) {
      return apiVat;
    }

    const amountBeforeVat = this.getItemTotalBeforeVatAfterDiscount(item);
    const rate = this.getTaxRate(item.taxId);

    return (amountBeforeVat * rate) / 100;
  }

  getItemTotalWithVat(item: any): number {
    const apiTotal = this.toNumber(item?.grandTotal || item?.totalWithVat);
    if (apiTotal > 0) {
      return apiTotal;
    }

    const amountBeforeVat = this.getItemTotalBeforeVatAfterDiscount(item);
    const vatAmount = this.getItemVatAmount(item);

    return amountBeforeVat + vatAmount;
  }

  getSubtotal(): number {
    if (this.savedClaim?.total !== undefined && this.savedClaim?.total !== null) {
      return this.toNumber(this.savedClaim.total);
    }

    const claimItems = this.savedClaim?.items || this.form.get('items')?.value || [];

    return claimItems.reduce((sum: number, item: any) => {
      return sum + (this.toNumber(item.quantity) * this.toNumber(item.price));
    }, 0);
  }

  getDiscountAmount(): number {
    const discount = this.toNumber(this.savedClaim?.discount ?? this.form.get('discount')?.value);
    const discountType = this.toNumber(this.savedClaim?.discountType ?? this.form.get('discountType')?.value);
    const subtotal = this.savedClaim ? this.toNumber(this.savedClaim.total) : this.getSubtotal();

    if (discount <= 0) {
      return 0;
    }

    if (discountType === 1) {
      return (subtotal * discount) / 100;
    }

    return discount;
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscountAmount();
  }

  getTotalVat(): number {
    if (this.savedClaim?.taxAmount !== undefined && this.savedClaim?.taxAmount !== null) {
      return this.toNumber(this.savedClaim.taxAmount);
    }

    const claimItems = this.savedClaim?.items || this.form.get('items')?.value || [];

    return claimItems.reduce((sum: number, item: any) => {
      return sum + this.getItemVatAmount(item);
    }, 0);
  }

  getTotalBeforeVat(): number {
    if (this.savedClaim?.netTotal !== undefined && this.savedClaim?.netTotal !== null) {
      return this.toNumber(this.savedClaim.netTotal);
    }

    return this.getSubtotal() - this.getDiscountAmount();
  }

  getTotalWithVat(): number {
    if (this.savedClaim?.grandTotal !== undefined && this.savedClaim?.grandTotal !== null) {
      return this.toNumber(this.savedClaim.grandTotal);
    }

    return this.getTotalBeforeVat() + this.getTotalVat();
  }

  // ==================== COMPANY / USER GETTERS ====================

  private get _seller(): any {
    return (
      this.savedClaim?.user?.company ||
      this.invoiceProfile?.user?.company ||
      this.invoiceProfile?.company ||
      this.invoiceProfile?.user ||
      this.invoiceProfile ||
      null
    );
  }

  getUserFullName(): string {
    const user = this.savedClaim?.user || this.invoiceProfile?.user || this.invoiceProfile;
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

    return this.cleanValue(
      fullName ||
      user?.fullName ||
      user?.name ||
      user?.userName ||
      ''
    );
  }

  getUserEmail(): string {
    const user = this.savedClaim?.user || this.invoiceProfile?.user || this.invoiceProfile;

    return this.cleanValue(
      user?.email ||
      user?.emailAddress ||
      ''
    );
  }

  getCompanyNameAr(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.companyNameAr ||
      seller?.nameAr ||
      seller?.arabicName ||
      seller?.companyArabicName ||
      seller?.nameArabic ||
      seller?.companyName ||
      seller?.name ||
      ''
    );
  }

  getCompanyNameEn(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.companyNameEn ||
      seller?.nameEn ||
      seller?.englishName ||
      seller?.companyEnglishName ||
      seller?.nameEnglish ||
      ''
    );
  }

  getCompanyAddress(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.companyAddressAr ||
      seller?.addressAr ||
      seller?.arabicAddress ||
      seller?.addressArabic ||
      seller?.companyAddress ||
      seller?.address ||
      seller?.cityName ||
      seller?.city ||
      ''
    );
  }

  getCompanyAddressEn(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.companyAddressEn ||
      seller?.addressEn ||
      seller?.englishAddress ||
      seller?.addressEnglish ||
      seller?.companyAddressEnglish ||
      seller?.cityNameEn ||
      seller?.cityEn ||
      ''
    );
  }

  getCompanyCity(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.cityName ||
      seller?.city ||
      seller?.cityAr ||
      seller?.cityNameAr ||
      ''
    );
  }

  getCompanyVat(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.vat ||
      seller?.vatNumber ||
      seller?.taxNumber ||
      seller?.taxId ||
      seller?.taxRegistrationNumber ||
      seller?.taxRegistrationNo ||
      ''
    );
  }

  getCompanyTin(): string {
    const seller = this._seller;

    return this.cleanValue(
      seller?.commercialRegNumber ||
      seller?.crn ||
      seller?.commercialRegistrationNo ||
      seller?.commercialRecord ||
      seller?.commercialNumber ||
      seller?.registrationNumber ||
      seller?.commercialRegistration ||
      seller?.tin ||
      ''
    );
  }

  getCompanyPhone(): string {
    const seller = this._seller;
    const user = this.savedClaim?.user || this.invoiceProfile?.user || this.invoiceProfile;

    return this.cleanValue(
      seller?.phone ||
      seller?.companyPhone ||
      seller?.phoneNumber ||
      seller?.mobile ||
      seller?.mobileNumber ||
      user?.phone ||
      user?.phoneNumber ||
      user?.mobile ||
      ''
    );
  }

  // ==================== CLIENT GETTERS ====================

  private get _client(): any {
    // الأولوية دائمًا لداتا العميل القادمة من /api/FinancialClaims/{id}
    if (this.savedClaim?.client) {
      return this.savedClaim.client;
    }

    if (this.selectedClient) {
      return this.selectedClient;
    }

    const id = this.savedClaim?.clientId ?? this.form.get('clientId')?.value;

    if (!id) {
      return null;
    }

    return this.findClient(id);
  }

  getClientName(): string {
    return this.getClientNameAr();
  }

  getClientNameAr(): string {
    const client = this._client;

    return this.cleanValue(
      client?.nameAr ||
      client?.client?.nameAr ||
      client?.clientNameAr ||
      client?.arabicName ||
      client?.nameArabic ||
      client?.arName ||
      client?.name ||
      client?.clientName ||
      ''
    );
  }

  getClientNameEn(): string {
    const client = this._client;

    return this.cleanValue(
      client?.nameEn ||
      client?.client?.nameEn ||
      client?.clientNameEn ||
      client?.englishName ||
      client?.nameEnglish ||
      client?.enName ||
      client?.foreignName ||
      client?.latinName ||
      ''
    );
  }

  getClientAddressAr(): string {
    const client = this._client;

    return this.cleanValue(
      client?.addressAr ||
      client?.client?.addressAr ||
      client?.clientAddressAr ||
      client?.arabicAddress ||
      client?.addressArabic ||
      client?.cityNameAr ||
      client?.cityAr ||
      client?.address ||
      client?.cityName ||
      client?.city ||
      ''
    );
  }

  getClientAddressEn(): string {
    const client = this._client;

    return this.cleanValue(
      client?.addressEn ||
      client?.client?.addressEn ||
      client?.clientAddressEn ||
      client?.englishAddress ||
      client?.addressEnglish ||
      client?.foreignAddress ||
      client?.latinAddress ||
      ''
    );
  }

  getClientVat(): string {
    const client = this._client;

    return this.cleanValue(
      client?.tin ||
      client?.client?.tin ||
      client?.vat ||
      client?.client?.vat ||
      client?.vatNumber ||
      client?.taxNumber ||
      client?.taxId ||
      client?.taxRegistrationNumber ||
      client?.taxRegistrationNo ||
      ''
    );
  }

  getClientCrn(): string {
    const client = this._client;

    return this.cleanValue(
      client?.crn ||
      client?.client?.crn ||
      client?.commercialRegNumber ||
      client?.client?.commercialRegNumber ||
      client?.commercialRegistrationNo ||
      client?.commercialRecord ||
      client?.commercialNumber ||
      client?.registrationNumber ||
      client?.commercialRegistration ||
      client?.clientCommercialRegistrationNo ||
      client?.clientCommercialNumber ||
      client?.commercialRegister ||
      client?.commercialRegisterNo ||
      client?.commercialRegistry ||
      client?.companyRegistrationNo ||
      client?.registerNo ||
      client?.registrationNo ||
      client?.registrationCode ||
      client?.regNo ||
      client?.crNumber ||
      ''
    );
  }

  getClientEmail(): string {
    const client = this._client;

    return this.cleanValue(
      client?.email ||
      client?.client?.email ||
      client?.clientEmail ||
      client?.emailAddress ||
      ''
    );
  }

  getClientPhone(): string {
    const client = this._client;

    return this.cleanValue(
      client?.phone ||
      client?.client?.phone ||
      client?.mobile ||
      client?.phoneNumber ||
      client?.clientPhone ||
      client?.mobileNumber ||
      ''
    );
  }

  getClientNumber(): string {
    const client = this._client;

    return this.cleanValue(
      client?.clientNum ||
      client?.client?.clientNum ||
      client?.clientNumber ||
      client?.clientNo ||
      client?.clientCode ||
      client?.customerNumber ||
      client?.customerNo ||
      client?.customerCode ||
      client?.accountNumber ||
      client?.code ||
      client?.number ||
      client?.serial ||
      client?.serialNumber ||
      client?.referenceNumber ||
      client?.referenceNo ||
      client?.externalCode ||
      client?.externalId ||
      client?.clientReference ||
      client?.customerReference ||
      ''
    );
  }

  // ==================== BANK GETTERS ====================

  private get _bank(): any {
    if (this.savedClaim?.bank) {
      return this.savedClaim.bank;
    }

    if (this.selectedBank) {
      return this.selectedBank;
    }

    const id = this.savedClaim?.bankId ?? this.form.get('bankId')?.value;

    if (!id) {
      return null;
    }

    return this.findBank(id);
  }

  getBankName(): string {
    return this.cleanValue(this._bank?.bankName || this._bank?.name || '');
  }

  getBankAccountName(): string {
    return this.cleanValue(
      this._bank?.bankAccountName ||
      this._bank?.accountName ||
      this._bank?.nameOnAccount ||
      ''
    );
  }

  getBankAccountNumber(): string {
    return this.cleanValue(
      this._bank?.accountNumber ||
      this._bank?.bankAccountNumber ||
      this._bank?.accountNo ||
      ''
    );
  }

  getBankIban(): string {
    return this.cleanValue(
      this._bank?.ibanNumber ||
      this._bank?.iban ||
      this._bank?.ibanNo ||
      ''
    );
  }

  // ==================== SUBMIT ====================

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.form.value;

    const payload = {
      clientId: this.toNullableNumber(formValue.clientId),
      bankId: this.toNullableNumber(formValue.bankId),
      claimDate: formValue.claimDate,
      notes: formValue.notes || '',
      taxId: this.toNullableNumber(formValue.taxId),
      discount: this.toNumber(formValue.discount),
      discountType: this.toNullableNumber(formValue.discountType),
      items: (formValue.items || []).map((item: any) => ({
        name: item.name,
        quantity: this.toNumber(item.quantity),
        price: this.toNumber(item.price),
        taxId: this.toNullableNumber(item.taxId)
      }))
    };

    this.http.post(`${environment.baseUrl}api/FinancialClaims`, payload).subscribe({
      next: (res: any) => {
        const createdId = this.extractCreatedClaimId(res);

        console.log('RAW SAVE RESPONSE:', res);
        console.log('CREATED CLAIM ID:', createdId);

        if (createdId) {
          this.loadFinancialClaimDetails(createdId, payload);
        } else {
          this.applyClaimData(res, payload);
          this.isLoading = false;
          this.submitSuccess = true;
        }
      },
      error: (err) => {
        console.error('Financial claim error:', err);
        this.isLoading = false;
      }
    });
  }

  // ==================== EXPORT PDF ====================

  async exportPdf(): Promise<void> {
    const originalElement = document.getElementById('claimPrintArea');

    if (!originalElement) {
      console.error('Print area not found');
      return;
    }

    let cloneWrapper: HTMLDivElement | null = null;

    try {
      this.isExporting = true;

      const clonedElement = originalElement.cloneNode(true) as HTMLElement;

      cloneWrapper = document.createElement('div');
      cloneWrapper.style.position = 'fixed';
      cloneWrapper.style.left = '-100000px';
      cloneWrapper.style.top = '0';
      cloneWrapper.style.width = '1200px';
      cloneWrapper.style.background = '#ffffff';
      cloneWrapper.style.zIndex = '-99999';
      cloneWrapper.style.opacity = '1';
      cloneWrapper.style.pointerEvents = 'none';
      cloneWrapper.style.overflow = 'hidden';

      clonedElement.style.display = 'block';
      clonedElement.style.width = '1200px';
      clonedElement.style.maxWidth = '1200px';
      clonedElement.style.minHeight = 'auto';
      clonedElement.style.height = 'auto';
      clonedElement.style.background = '#ffffff';
      clonedElement.style.position = 'relative';
      clonedElement.style.left = 'auto';
      clonedElement.style.top = 'auto';
      clonedElement.style.transform = 'none';
      clonedElement.style.opacity = '1';
      clonedElement.style.overflow = 'hidden';
      clonedElement.style.boxSizing = 'border-box';

      cloneWrapper.appendChild(clonedElement);
      document.body.appendChild(cloneWrapper);

      await new Promise(resolve => setTimeout(resolve, 400));

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF('l', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 5;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      let imgWidth = availableWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = margin;

      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

      const fileName = `financial-claim-${this.savedClaim?.id || 'new'}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      if (cloneWrapper && cloneWrapper.parentNode) {
        cloneWrapper.parentNode.removeChild(cloneWrapper);
      }

      this.isExporting = false;
    }
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.savedClaim = null;
    this.selectedBank = null;
    this.selectedClient = null;
    this.initForm();
  }
}
