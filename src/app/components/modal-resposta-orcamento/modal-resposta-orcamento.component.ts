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
  selector: 'app-modal-resposta-orcamento',
  templateUrl: './modal-resposta-orcamento.component.html',
  styleUrls: ['./modal-resposta-orcamento.component.css']
})
export class ModalResponseOrcamentoComponent implements OnInit {
  global_: any;
  loading: any = false;
  user: any = {};
  profissional: any = {};
  orcamento: any = {};
  orcamentoResposta: any = {};
  loadingButton: any = false;
  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialogRef: MatDialogRef<ModalResponseOrcamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.global_ = global;
    console.log(data);
    this.getOrcamento(data);
  }

  ngOnInit() {
    this.obterProfissionais();
  }

  obterProfissionais() {
    // this.apiService.Get(`Usuario/Profissionais`).then((res: any) => {
    //   if (res.length > 0) {
    //     this.profissionais = res
    //   }

    // }).catch((err) => {
    // });

  }


  getOrcamento(id: any) {
    this.apiService.Get(`Orcamento/${id}`).then((res: any) => {
      this.orcamento = res;
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

  }

  salvarOrcamentoResposta(obj: any) {
    if (this.loadingButton) {
      return;
    }

    this.loadingButton = true;

    var obj_ = Object.assign({}, obj)
    if (obj_.descricao == null || obj_.descricao == "") {
      this.alertService.danger('Favor preencher o campo descrição');
      this.loadingButton = false;
      return;
    }
    if ($("#valor").val() == null || $("#valor").val() == "") {
      this.alertService.danger('Favor preencher o campo valor');
      this.loadingButton = false;
      return;
    }

    if ($("#valor").val().includes(".")) {
      var split = $("#valor").val().split(".");
      if (split.length > 2) {
        obj_.valor = parseFloat($("#valor").val().replace(".", ""));
      } else {
        obj_.valor = parseFloat($("#valor").val());
      }
    } else {
      obj_.valor = parseFloat($("#valor").val());
    }

    obj_.orcamento_id = this.orcamento.id;
    this.postOrcamentoResposta(obj_);
  }

  postOrcamentoResposta(obj: any) {
    this.apiService.Post(`OrcamentoResposta`, obj).then((res: any) => {
      // this.orcamento = res;
      this.marcarComoRespondido();
    }).catch((err) => {
      this.alertService.danger('Erro ao tentar salvar orçamento');
    });
  }


  recusarOrcamento() {
    if (this.loadingButton) {
      return;
    }

    this.loadingButton = true;

    var obj = {
      "status_orcamento": 'RECUSADO_PROFISSIONAL'
    }
    this.apiService.Put(`Orcamento/${this.orcamento.id}`, obj).then((res: any) => {
      this.alertService.success(`Orçamento recusado, você poderá receber novas propostas desse usuário.`);
      this.dialogRef.close('atualizar');
      this.loadingButton = false;
    }).catch((err) => {
      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

  marcarComoRespondido() {
    var obj = {
      "status_orcamento": 'AGUARDANDO_CLIENTE'
    }
    this.apiService.Put(`Orcamento/${this.orcamento.id}`, obj).then((res: any) => {
      this.loadingButton = false;
      this.dialogRef.close('atualizar');
      this.alertService.success('Sucesso ao responder o orçamento, favor aguardar o retorno do cliente.');
    }).catch((err) => {
      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }
}
