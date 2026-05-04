import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNotificationEditComponent } from './invoice-notification-edit.component';

describe('InvoiceNotificationEditComponent', () => {
  let component: InvoiceNotificationEditComponent;
  let fixture: ComponentFixture<InvoiceNotificationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceNotificationEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceNotificationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
