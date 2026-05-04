import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNotificationDownloadComponent } from './invoice-notification-download.component';

describe('InvoiceNotificationDownloadComponent', () => {
  let component: InvoiceNotificationDownloadComponent;
  let fixture: ComponentFixture<InvoiceNotificationDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceNotificationDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceNotificationDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
