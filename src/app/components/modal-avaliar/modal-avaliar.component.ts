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
  selector: 'app-modal-avaliar',
  templateUrl: './modal-avaliar.component.html',
  styleUrls: ['./modal-avaliar.component.css']
})
export class ModalAvaliarComponent implements OnInit {
  global_: any;
  loading: any = false;
  user: any;
  avaliacao: any = {};
  loadingButton: any = false;
  profissional: any = {};
  endereco: any = {};
  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialogRef: MatDialogRef<ModalAvaliarComponent>,
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


  avaliarProfissional() {
    if (this.loadingButton) {
      return;
    }


    if (this.avaliacao.texto == null || this.avaliacao.texto == "") {
      this.showAlertErro('Favor preencher a descrição do seu problema ou pedido');
      this.loadingButton = false;
      return;
    }

    this.avaliacao.usuario_avaliacao_id = this.user.id;
    this.avaliacao.usuario_id = this.profissional.id;
  
    var obj = Object.assign({}, this.avaliacao);
  
    this.apiService.Post(`Avaliacao`, obj).then((res: any) => {
      this.marcarComoAvaliado();
    }).catch((err) => {
      this.loadingButton = false;
      this.showAlertErro('Houve um erro ao tentar solicitar o orçamento');
    });
  }

  marcarComoAvaliado  () {
    var obj = {
      "status_orcamento": 'AVALIADO'
    }
    this.apiService.Put(`Orcamento/${this.profissional.orcamento_id}`, obj).then((res: any) => {
      this.loadingButton = false;
      this.dialogRef.close('atualizar');
      this.alertService.success('Sucesso ao avaliar');
    }).catch((err) => {
      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

}
