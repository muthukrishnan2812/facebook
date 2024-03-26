import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { LeftsidebarComponent } from './leftsidebar/leftsidebar.component';
import { MiddlebarComponent } from './middlebar/middlebar.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from './environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire/compat';
import { AngularFireStorageModule} from '@angular/fire/compat/storage';
import { DemoHtmlComponent } from './demo.html/demo.html.component';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    ModalComponent,
    LeftsidebarComponent,
    MiddlebarComponent,
    RightsidebarComponent,
    DemoHtmlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
