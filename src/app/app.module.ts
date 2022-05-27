import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { AppConfig } from './service/app.config';
import { ApiService } from './service/apiServices';
import { Global } from './global';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './screens/home/home.component';
import { LoginComponent } from './screens/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { AgmCoreModule } from '@agm/core';


//Angular Material Components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './screens/register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { LocationService } from './service/locationService';
import { AlertModule } from '@full-fledged/alerts';
import { ModalEditEnderecoComponent } from './components/modal-endereco/modal-endereco.component';
import { ModalEditUserComponent } from './components/modal-edit-user/modal-edit-user.component';
import { OrcamentoShowComponent } from './components/orcamento-show/orcamento-show.component';
import { ModalResponseOrcamentoComponent } from './components/modal-resposta-orcamento/modal-resposta-orcamento.component';
import { IndexComponent } from './screens/index/index.component';
import { PrincipalComponent } from './screens/principal/principal.component';
import { ModalProfissionaisComponent } from './components/modal-profissionais/modal-profissionais.component';
import { ModalOrcamentosComponent } from './components/modal-orcamentos/modal-orcamentos.component';
import { ModalOrcamentosRecebidosComponent } from './components/modal-orcamentos-recebidos/modal-orcamentos-recebidos.component';
import { ModalRendimentosComponent } from './components/modal-rendimentos/modal-rendimentos.component';
import { ModalProfissionaisDetalhesComponent } from './components/modal-profissionais-detalhes/modal-profissionais-detalhes.component';
import { ModalOrcamentoSolicitadoComponent } from './components/modal-orcamentos-solicitados/modal-orcamentos-solicitados.component';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SideMenuComponent,
    RightBarComponent,
    FooterBarComponent,
    RegisterComponent,
    OrcamentoShowComponent,
    ModalResponseOrcamentoComponent,
    PrincipalComponent,
    IndexComponent,
    ModalEditEnderecoComponent,
    ModalEditUserComponent,
    ModalResponseOrcamentoComponent,
    ModalProfissionaisComponent,
    ModalOrcamentosComponent,
    ModalOrcamentosRecebidosComponent,
    ModalRendimentosComponent,
    ModalProfissionaisDetalhesComponent,
    ModalOrcamentoSolicitadoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCODZ0uSWEkmREQFti8KrDVVBmbjB8WNVw'
    }),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    AlertModule.forRoot({ maxMessages: 5, timeout: 0, positionX: 'right' }),
    NgxViacepModule,
    RouterModule,
  ],
  providers: [AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: "pt"
    },
    ApiService,
    Global,
    AuthGuard,
    LocationService
  ],
  entryComponents: [
    ModalEditEnderecoComponent,
    ModalEditUserComponent,
    ModalResponseOrcamentoComponent,
    ModalProfissionaisComponent,
    ModalOrcamentosComponent,
    ModalOrcamentosRecebidosComponent,
    ModalRendimentosComponent,
    ModalProfissionaisDetalhesComponent,
    ModalOrcamentoSolicitadoComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
