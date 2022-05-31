import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CEPError, Endereco, NgxViacepService } from '@brunoc/ngx-viacep';
import { AlertService } from '@full-fledged/alerts';
import * as moment from 'moment';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';
declare var $: any;
@Component({
  selector: 'app-modal-profissionais-detalhes',
  templateUrl: './modal-profissionais-detalhes.component.html',
  styleUrls: ['./modal-profissionais-detalhes.component.css']
})
export class ModalProfissionaisDetalhesComponent implements OnInit {
  global_: any;
  loading: any = false;
  user: any = {};
  profissionais: any = [];
  orcamento: any = {};
  orcamentoresposta: any = [];
  profissional: any = {};
  loadingButton: any = false;
  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialogRef: MatDialogRef<ModalProfissionaisDetalhesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.global_ = global;
    this.authService.currentUser.subscribe(res => {
      if (res != null) {
        this.user = res;
      }
    });
    this.getOrcamento(data);
  }


  getOrcamento(id: any) {
    this.apiService.Get(`Orcamento/${id}`).then((res: any) => {
      this.orcamento = res;
      this.getOrcamentoResposta(id);
      this.getProfissional(this.orcamento.usuarioId);
    }).catch((err) => {
    });
  }

  getOrcamentoResposta(id: any) {
    this.apiService.Get(`Orcamento/${id}/Respostas`).then((res: any) => {
      this.orcamentoresposta = res;
    }).catch((err) => {
    });
  }

  getProfissional(id: any) {
    this.apiService.Get(`Usuario/${id}`).then((res: any) => {
      this.profissional = res;
    }).catch((err) => {
    });
  }



  ngOnInit() {
    // this.obterProfissionais();
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
    $("#android-developer").modal();
  }


  recusarOrcamento() {
    if (this.loadingButton) {
      return;
    }

    this.loadingButton = true;

    var obj = {
      "status_orcamento": 'RECUSADO'
    }
    this.apiService.Put(`Orcamento/${this.orcamento.id}`, obj).then((res: any) => {
      this.alertService.success(`Orçamento recusado, você poderá solicitar novos orçamentos a esse usuário.`);
      this.dialogRef.close('atualizar');
      this.loadingButton = false;
    }).catch((err) => {
      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

  aceitarOrcamento() {
    if (this.loadingButton) {
      return;
    }

    this.loadingButton = true;

    var obj = {
      "status_orcamento": 'APROVADO'
    }
    this.apiService.Put(`Orcamento/${this.orcamento.id}`, obj).then((res: any) => {
      this.alertService.success(`Orçamento aprovado com sucesso.`);
      this.dialogRef.close('atualizar');
      this.loadingButton = false;
    }).catch((err) => {
      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

  FinalizarOrcamento() {
    if (this.loadingButton) {
      return;
    }

    this.loadingButton = true;

    var obj = {
      "status_orcamento": 'FINALIZADO'
    }
    this.apiService.Put(`Orcamento/${this.orcamento.id}`, obj).then((res: any) => {
      this.alertService.success(`Trabalho finalizado, você poderá avaliar esse usuário.`);
      this.dialogRef.close('atualizar');
      this.loadingButton = false;
    }).catch((err) => {
      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

  avaliarProfissional(){

  }


}
