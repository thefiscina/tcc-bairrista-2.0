import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ModalEditUserComponent } from '../modal-edit-user/modal-edit-user.component';
import { ModalEditEnderecoComponent } from '../modal-endereco/modal-endereco.component';
import { ModalOrcamentosRecebidosComponent } from '../modal-orcamentos-recebidos/modal-orcamentos-recebidos.component';
import { ModalOrcamentoSolicitadoComponent } from '../modal-orcamentos-solicitados/modal-orcamentos-solicitados.component';
import { ModalOrcamentosComponent } from '../modal-orcamentos/modal-orcamentos.component';
import { ModalProfissionaisComponent } from '../modal-profissionais/modal-profissionais.component';
import { ModalRendimentosComponent } from '../modal-rendimentos/modal-rendimentos.component';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any = {};
  showMsg: any = true;
  orcamentos: any = [];
  orcamentosSolicitante: any = [];
  listaNotification: any = [];
  constructor(private authService: AuthService, public dialog: MatDialog, public apiService: ApiService,) {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        // setInterval(() => {
        //   this.checkOrcamentos(this.user.id);
        //   this.checkOrcamentosRespostas(this.user.id);
        // }, 2000)
      }
    });

    this.authService.hasEndereco.subscribe(res => {
      if (res) {
        this.showMsg = false;
      } else {
        this.showMsg = true;
      }
    });
  }

  ngOnInit(): void {

  }
  getFisrtLetter(nome: any) {
    if (nome) {
      return nome.substring(1, 0).toLocaleUpperCase()
    } else {
      return "-"
    }
  }

  sairSistema() {
    this.authService.logoutUser();
  }

  openRigthBar() {
    $("#right-bar").toggleClass("right-bar-show");
  }

  openModalEndereco() {
    const dialogRef = this.dialog.open(ModalEditEnderecoComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openModalUsuario() {
    const dialogRef = this.dialog.open(ModalEditUserComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  checkOrcamentos(id: any) {
    this.apiService.Get(`Usuario/${id}/Orcamento?status_orcamento=PENDENTE`).then((res: any) => {
      if (res.length > 0) {
        this.orcamentos = res
      }

    }).catch((err) => {
    });
  }

  checkOrcamentosRespostas(id: any) {
    this.apiService.Get(`Usuario/${id}/OrcamentoSolicitante?status_orcamento=AGUARDANDO_CLIENTE`).then((res: any) => {
      if (res.length > 0) {
        this.orcamentosSolicitante = res
      }

    }).catch((err) => {
    });
  }

  exibirOrcamento(item: any) {
    this.authService.setOrcamento(item);
    $("#orcamento-show").toggleClass("orcamento-show-show");
  }

  
  abrirProfissionais() {
    const dialogRef = this.dialog.open(ModalProfissionaisComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  abrirOrcamentos() {
    const dialogRef = this.dialog.open(ModalOrcamentoSolicitadoComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  abrirOrcamentosRecebidos() {
    const dialogRef = this.dialog.open(ModalOrcamentosRecebidosComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  abrirGraficos() {
    const dialogRef = this.dialog.open(ModalRendimentosComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
