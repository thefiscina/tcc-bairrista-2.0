import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CEPError, Endereco, NgxViacepService } from '@brunoc/ngx-viacep';
import { AlertService } from '@full-fledged/alerts';
import * as moment from 'moment';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-modal-orcamentos',
  templateUrl: './modal-orcamentos.component.html',
  styleUrls: ['./modal-orcamentos.component.css']
})
export class ModalOrcamentosComponent implements OnInit {
  global_: any;
  loading: any = false;
  user: any;
  orcamento: any = {};
  loadingButton: any = false;
  profissional: any = {};
  endereco: any = {};
  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialogRef: MatDialogRef<ModalOrcamentosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profissional = data;
    var currentUser = localStorage.getItem('@bairrista:currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser)
    }
  }

  ngOnInit() {
  }

  fechar() {
    this.dialogRef.close();
  }


  showAlertErro(msg: any) {
    this.alertService.danger(`${msg}`);
  }


  solicitarOrcamento() {
    if (this.loadingButton) {
      return;
    }


    if (this.orcamento.data == null || this.orcamento.data == "") {
      this.showAlertErro('Favor preencher a data');
      this.loadingButton = false;
      return;
    }

    if (this.orcamento.hora == null || this.orcamento.hora == "") {
      this.showAlertErro('Favor preencher a hora');
      this.loadingButton = false;
      return;
    }

    if (this.orcamento.descricao == null || this.orcamento.descricao == "") {
      this.showAlertErro('Favor preencher a descrição do seu problema ou pedido');
      this.loadingButton = false;
      return;
    }

    var data_hora: any = this.global.formatarDataHoraValor(this.orcamento.data, this.orcamento.hora);
    if (data_hora == null || !data_hora["_isValid"]) {
      this.showAlertErro('Data inválida');
      this.loadingButton = false;
      return;
    } else {
      this.orcamento.data_hora_orcamento = data_hora['_i'];
    }

    this.orcamento.usuario_solicitante_id = this.user.id;
    this.orcamento.usuario_id = this.profissional.id;
    if (this.endereco) {
      this.orcamento.endereco_id = this.user.enderecos[0].id;
    } else {
      this.loadingButton = false;
      this.showAlertErro('Você precisar cadastrar um endereço para solicitar um orçamento');
      return;
    }

    var obj = Object.assign({}, this.orcamento);
    delete obj.data;
    delete obj.hora;

    this.apiService.Post(`Orcamento`, obj).then((res: any) => {
      this.alertService.info(`Sucesso ao solicitar orcamento`);
      this.dialogRef.close('atualizar');
    }).catch((err) => {
      this.loadingButton = false;

      this.showAlertErro('Houve um erro ao tentar solicitar o orçamento');
    });
  }

}
