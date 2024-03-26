import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoHtmlComponent } from './demo.html.component';

describe('DemoHtmlComponent', () => {
  let component: DemoHtmlComponent;
  let fixture: ComponentFixture<DemoHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoHtmlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
