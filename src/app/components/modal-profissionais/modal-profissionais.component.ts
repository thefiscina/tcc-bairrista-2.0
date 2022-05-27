import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CEPError, Endereco, NgxViacepService } from '@brunoc/ngx-viacep';
import { AlertService } from '@full-fledged/alerts';
import * as moment from 'moment';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ModalOrcamentosComponent } from '../modal-orcamentos/modal-orcamentos.component';
import { ModalProfissionaisDetalhesComponent } from '../modal-profissionais-detalhes/modal-profissionais-detalhes.component';
declare var $: any;
@Component({
  selector: 'app-modal-profissionais',
  templateUrl: './modal-profissionais.component.html',
  styleUrls: ['./modal-profissionais.component.css']
})
export class ModalProfissionaisComponent implements OnInit {
  global_: any;
  loading: any = false;
  user: any = {};
  profissionais: any = [];
  prof_info = '../assets/imgs/profs/prof_info.svg';
  prof_warning = '../assets/imgs/profs/prof_warning.svg';
  prof_sucess = '../assets/imgs/profs/prof_sucess.svg';
  prof_danger = '../assets/imgs/profs/prof_danger.svg';
  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalProfissionaisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.obterProfissionais();
  }

  obterProfissionais() {
    this.apiService.Get(`Usuario/Profissionais`).then((res: any) => {
      if (res.length > 0) {
        this.profissionais = res
      }

    }).catch((err) => {
    });

  }

  fechar() {
    this.dialogRef.close();
  }


  showAlertErro(msg: any) {
    this.alertService.danger(`${msg}`);
  }


  submitUser() {

  }


  openModalDetalhes() {
    const dialogRef = this.dialog.open(ModalProfissionaisDetalhesComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openOrcamentoModal() {
    const dialogRef = this.dialog.open(ModalOrcamentosComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'atualizar') {
        //atualiza a lista de profissionais
      }
    });
  }
}
