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

  // ==================== NEW: LIST STATE ====================
  savedClaims: any[] = [];
  viewMode: 'list' | 'form' | 'detail' = 'list';
  editingClaimId: string | null = null;
  currentDetailClaim: any = null;

  claimSearchName: string = '';
  claimSearchDate: string = '';

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
    this.loadSavedClaims();
  }

  // ==================== LOCAL STORAGE ====================

  private LS_KEY = 'fin_claims_v1';

  loadSavedClaims(): void {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      this.savedClaims = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.savedClaims = [];
    }
  }

  get filteredSavedClaims(): any[] {
    const nameSearch = (this.claimSearchName || '').trim().toLowerCase();
    const dateSearch = (this.claimSearchDate || '').trim();

    return (this.savedClaims || []).filter((claim: any) => {
      const clientNameAr = claim?.client?.nameAr || '';
      const clientNameEn = claim?.client?.nameEn || '';
      const clientName = claim?.clientName || claim?.client?.name || '';
      const fullName = `${clientNameAr} ${clientNameEn} ${clientName}`.toLowerCase();

      const claimDate = claim?.claimDate ? String(claim.claimDate).slice(0, 10) : '';

      const matchName = !nameSearch || fullName.includes(nameSearch);
      const matchDate = !dateSearch || claimDate === dateSearch;

      return matchName && matchDate;
    });
  }

  clearClaimsSearch(): void {
    this.claimSearchName = '';
    this.claimSearchDate = '';
  }

  private persistClaims(): void {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(this.savedClaims));
    } catch (e) {
      console.error('Failed to persist claims', e);
    }
  }

  // ==================== VIEW NAVIGATION ====================

  showList(): void {
    this.viewMode = 'list';
    this.loadSavedClaims();
    this.editingClaimId = null;
    this.submitSuccess = false;
    this.savedClaim = null;
  }

  showNewForm(): void {
    this.editingClaimId = null;
    this.submitSuccess = false;
    this.savedClaim = null;
    this.selectedClient = null;
    this.selectedBank = null;
    this.initForm();
    this.viewMode = 'form';
  }

  showDetail(claim: any): void {
    this.currentDetailClaim = claim;
    this.savedClaim = claim;
    if (claim?.client) this.selectedClient = claim.client;
    if (claim?.bank) this.selectedBank = claim.bank;
    this.viewMode = 'detail';
  }

  openEditClaim(claim: any): void {
    this.editingClaimId = claim.id;
    this.submitSuccess = false;
    this.savedClaim = null;
    this.selectedClient = null;
    this.selectedBank = null;
    this.initForm();

    // Populate form with existing claim data
    this.form.patchValue({
      clientId: claim.clientId,
      bankId: claim.bankId,
      claimDate: claim.claimDate,
      notes: claim.notes || '',
      taxId: claim.taxId,
      discount: claim.discount || 0,
      discountType: claim.discountType ?? 0,
    });

    // Populate items
    const items = this.form.get('items') as FormArray;
    items.clear();
    (claim.items || []).forEach((item: any) => {
      items.push(this.fb.group({
        name: [item.name || '', Validators.required],
        quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
        price: [item.price || 0, [Validators.required, Validators.min(0)]],
        taxId: [item.taxId || null]
      }));
    });

    if (claim.clientId) {
      this.selectedClient = this.findClient(claim.clientId);
    }
    if (claim.bankId) {
      this.selectedBank = this.findBank(claim.bankId);
    }

    this.viewMode = 'form';
  }

  deleteClaimById(id: string): void {
    this.savedClaims = this.savedClaims.filter(c => c.id !== id);
    this.persistClaims();
    this.loadSavedClaims();
  }

  deleteCurrentDetail(): void {
    if (this.currentDetailClaim?.id) {
      this.deleteClaimById(this.currentDetailClaim.id);
      this.showList();
    }
  }

  // ==================== FORM ====================

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
      },
      error: (err) => {
        console.error('Load profile error:', err);
        this.companyLogoUrl = 'assets/logo.png';
      }
    });
  }

  loadClients(): void {
    this.http.get<any>(`${environment.baseUrl}api/Clients/Lookup?language=ar`).subscribe({
      next: (data) => {
        this.clients = Array.isArray(data) ? data : (data?.data || data?.items || []);
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
        this.currentDetailClaim = this.savedClaim;
        this.viewMode = 'detail';
        this.isLoading = false;
        this.submitSuccess = true;
        setTimeout(() => {
          document.getElementById('claimPrintArea')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      },
      error: (err) => {
        console.error('Load financial claim details error:', err);
        if (fallbackPayload) {
          this.applyClaimData(fallbackPayload);
        }
        this.currentDetailClaim = this.savedClaim;
        this.viewMode = 'detail';
        this.isLoading = false;
        this.submitSuccess = true;
        setTimeout(() => {
          document.getElementById('claimPrintArea')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }

  loadBanks(): void {
    this.http.get<any>(`${environment.baseUrl}api/Banks/Lookup`).subscribe({
      next: (data) => {
        this.banks = Array.isArray(data) ? data : (data?.data || data?.items || []);
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
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'string') value = value.replace('%', '').trim();
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  private toNullableNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  private cleanValue(value: any): string {
    if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') return '—';
    return String(value).trim();
  }

  private mergeWithoutEmptyValues(base: any, override: any): any {
    const result = { ...(base || {}) };
    Object.keys(override || {}).forEach((key) => {
      const value = override[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'null' && value !== 'undefined') {
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

    if (this.savedClaim?.client) this.selectedClient = this.savedClaim.client;
    if (this.savedClaim?.bank) this.selectedBank = this.savedClaim.bank;

    if (this.savedClaim?.user) {
      this.invoiceProfile = { ...this.invoiceProfile, user: this.savedClaim.user };
      const logo = this.savedClaim?.user?.company?.logo;
      if (logo) this.companyLogoUrl = this.buildFileUrl(logo);
    }

    // Save to local list
    const existingIndex = this.savedClaims.findIndex(c => c.id === this.savedClaim.id);
    if (existingIndex >= 0) {
      this.savedClaims[existingIndex] = this.savedClaim;
    } else {
      this.savedClaims.unshift(this.savedClaim);
    }
    this.persistClaims();
  }

  private buildFileUrl(path: string): string {
    if (!path) return 'assets/logo.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `https://demo.saudifatora.com/${cleanPath}`;
  }

  private findClient(id: any): any | null {
    if (!id || !this.clients?.length) return null;
    return this.clients.find((client: any) => Number(client.id) === Number(id)) || null;
  }

  private findBank(id: any): any | null {
    if (!id || !this.banks?.length) return null;
    return this.banks.find((bank: any) => Number(bank.id) === Number(id)) || null;
  }

  private extractCreatedClaimId(res: any): any {
    if (typeof res === 'number' || typeof res === 'string') return res;
    return (
      res?.id || res?.data?.id || res?.result?.id ||
      res?.claimId || res?.data?.claimId || res?.result?.claimId ||
      res?.claimNumber || res?.data?.claimNumber || res?.result?.claimNumber || null
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
    if (!tax) return 0;
    const possibleRate = tax.taxRate ?? tax.rate ?? tax.percentage ?? tax.percent ?? tax.taxPercentage ?? tax.taxValue ?? tax.value ?? 0;
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
    if (itemSubtotal <= 0 || subtotal <= 0 || totalDiscount <= 0) return 0;
    return (itemSubtotal / subtotal) * totalDiscount;
  }

  getItemTotalBeforeVatAfterDiscount(item: any): number {
    const itemSubtotal = this.toNumber(item.quantity) * this.toNumber(item.price);
    const itemDiscount = this.getItemDiscountAmount(item);
    return Math.max(itemSubtotal - itemDiscount, 0);
  }

  getItemVatAmount(item: any): number {
    const apiVat = this.toNumber(item?.taxAmount);
    if (apiVat > 0) return apiVat;
    const amountBeforeVat = this.getItemTotalBeforeVatAfterDiscount(item);
    const rate = this.getTaxRate(item.taxId);
    return (amountBeforeVat * rate) / 100;
  }

  getItemTotalWithVat(item: any): number {
    const apiTotal = this.toNumber(item?.grandTotal || item?.totalWithVat);
    if (apiTotal > 0) return apiTotal;
    return this.getItemTotalBeforeVatAfterDiscount(item) + this.getItemVatAmount(item);
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
    if (discount <= 0) return 0;
    if (discountType === 1) return (subtotal * discount) / 100;
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
    return claimItems.reduce((sum: number, item: any) => sum + this.getItemVatAmount(item), 0);
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
    return this.cleanValue(fullName || user?.fullName || user?.name || user?.userName || '');
  }

  getUserEmail(): string {
    const user = this.savedClaim?.user || this.invoiceProfile?.user || this.invoiceProfile;
    return this.cleanValue(user?.email || user?.emailAddress || '');
  }

  getCompanyNameAr(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.companyNameAr || seller?.nameAr || seller?.arabicName || seller?.companyName || seller?.name || '');
  }

  getCompanyNameEn(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.companyNameEn || seller?.nameEn || seller?.englishName || '');
  }

  getCompanyAddress(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.companyAddressAr || seller?.addressAr || seller?.companyAddress || seller?.address || seller?.cityName || '');
  }

  getCompanyAddressEn(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.companyAddressEn || seller?.addressEn || seller?.cityNameEn || '');
  }

  getCompanyCity(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.cityName || seller?.city || '');
  }

  getCompanyVat(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.vat || seller?.vatNumber || seller?.taxNumber || seller?.taxRegistrationNumber || '');
  }

  getCompanyTin(): string {
    const seller = this._seller;
    return this.cleanValue(seller?.commercialRegNumber || seller?.crn || seller?.tin || '');
  }

  getCompanyPhone(): string {
    const seller = this._seller;
    const user = this.savedClaim?.user || this.invoiceProfile?.user || this.invoiceProfile;
    return this.cleanValue(seller?.phone || seller?.companyPhone || seller?.phoneNumber || user?.phone || user?.phoneNumber || '');
  }

  // ==================== CLIENT GETTERS ====================

  private get _client(): any {
    if (this.savedClaim?.client) return this.savedClaim.client;
    if (this.selectedClient) return this.selectedClient;
    const id = this.savedClaim?.clientId ?? this.form.get('clientId')?.value;
    if (!id) return null;
    return this.findClient(id);
  }

  getClientName(): string { return this.getClientNameAr(); }

  getClientNameAr(): string {
    const client = this._client;
    return this.cleanValue(client?.nameAr || client?.arabicName || client?.name || client?.clientName || '');
  }

  getClientNameEn(): string {
    const client = this._client;
    return this.cleanValue(client?.nameEn || client?.englishName || client?.foreignName || '');
  }

  getClientAddressAr(): string {
    const client = this._client;
    return this.cleanValue(client?.addressAr || client?.address || client?.cityName || '');
  }

  getClientAddressEn(): string {
    const client = this._client;
    return this.cleanValue(client?.addressEn || client?.englishAddress || '');
  }

  getClientVat(): string {
    const client = this._client;
    return this.cleanValue(client?.tin || client?.vat || client?.vatNumber || client?.taxNumber || '');
  }

  getClientCrn(): string {
    const client = this._client;
    return this.cleanValue(client?.crn || client?.commercialRegNumber || client?.registrationNumber || '');
  }

  getClientEmail(): string {
    const client = this._client;
    return this.cleanValue(client?.email || client?.emailAddress || '');
  }

  getClientPhone(): string {
    const client = this._client;
    return this.cleanValue(client?.phone || client?.mobile || client?.phoneNumber || '');
  }

  getClientNumber(): string {
    const client = this._client;
    return this.cleanValue(client?.clientNum || client?.clientNumber || client?.customerNumber || client?.code || '');
  }

  // ==================== BANK GETTERS ====================

  private get _bank(): any {
    if (this.savedClaim?.bank) return this.savedClaim.bank;
    if (this.selectedBank) return this.selectedBank;
    const id = this.savedClaim?.bankId ?? this.form.get('bankId')?.value;
    if (!id) return null;
    return this.findBank(id);
  }

  getBankName(): string {
    return this.cleanValue(this._bank?.bankName || this._bank?.name || '');
  }

  getBankAccountName(): string {
    return this.cleanValue(this._bank?.bankAccountName || this._bank?.accountName || '');
  }

  getBankAccountNumber(): string {
    return this.cleanValue(this._bank?.accountNumber || this._bank?.bankAccountNumber || '');
  }

  getBankIban(): string {
    return this.cleanValue(this._bank?.ibanNumber || this._bank?.iban || '');
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

    // If editing an existing local claim, update it locally first
    if (this.editingClaimId) {
      const localClaimIndex = this.savedClaims.findIndex(c => c.id === this.editingClaimId);
      if (localClaimIndex >= 0) {
        const updatedClaim = { ...this.savedClaims[localClaimIndex], ...payload };
        this.savedClaims[localClaimIndex] = updatedClaim;
        this.persistClaims();
      }
    }

    this.http.post(`${environment.baseUrl}api/FinancialClaims`, payload).subscribe({
      next: (res: any) => {
        const createdId = this.extractCreatedClaimId(res);

        if (createdId) {
          this.loadFinancialClaimDetails(createdId, payload);
        } else {
          this.applyClaimData(res, payload);
          this.currentDetailClaim = this.savedClaim;
          this.viewMode = 'detail';
          this.isLoading = false;
          this.submitSuccess = true;
          setTimeout(() => {
            document.getElementById('claimPrintArea')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }

        this.viewMode = 'detail';
        this.editingClaimId = null;
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
    if (!originalElement) { console.error('Print area not found'); return; }

    let cloneWrapper: HTMLDivElement | null = null;

    try {
      this.isExporting = true;
      const clonedElement = originalElement.cloneNode(true) as HTMLElement;

      cloneWrapper = document.createElement('div');
      cloneWrapper.style.cssText = 'position:fixed;left:-100000px;top:0;width:1200px;background:#ffffff;z-index:-99999;opacity:1;pointer-events:none;overflow:hidden';
      clonedElement.style.cssText = 'display:block;width:1200px;max-width:1200px;min-height:auto;height:auto;background:#ffffff;position:relative;left:auto;top:auto;transform:none;opacity:1;overflow:hidden;box-sizing:border-box';

      cloneWrapper.appendChild(clonedElement);
      document.body.appendChild(cloneWrapper);

      await new Promise(resolve => setTimeout(resolve, 400));

      const canvas = await html2canvas(clonedElement, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false,
        scrollX: 0, scrollY: 0,
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

      pdf.addImage(imgData, 'JPEG', (pageWidth - imgWidth) / 2, margin, imgWidth, imgHeight);
      pdf.save(`financial-claim-${this.savedClaim?.id || 'new'}.pdf`);

    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      if (cloneWrapper?.parentNode) cloneWrapper.parentNode.removeChild(cloneWrapper);
      this.isExporting = false;
    }
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.savedClaim = null;
    this.selectedBank = null;
    this.selectedClient = null;
    this.editingClaimId = null;
    this.initForm();
    this.viewMode = 'form';
  }
}
