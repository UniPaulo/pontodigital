import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import localePt from '@angular/common/locales/pt';
import { MaterialModule } from './material/material.module';
import { NgbModule,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap'
import { NgbDatePTParserFormatter } from './services/formater';

registerLocaleData(localePt);


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/template/header/header.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    LoadingComponent,
    ModalComponent,
    RelatorioComponent,
    CadastroComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    MaterialModule,
    NgbModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt-br" },{provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}],
  bootstrap: [AppComponent]
})
export class AppModule { }
