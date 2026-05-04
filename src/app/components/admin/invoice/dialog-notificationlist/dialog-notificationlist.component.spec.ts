import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNotificationlistComponent } from './dialog-notificationlist.component';

describe('DialogNotificationlistComponent', () => {
  let component: DialogNotificationlistComponent;
  let fixture: ComponentFixture<DialogNotificationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNotificationlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNotificationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
