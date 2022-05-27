import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AlertService } from '@full-fledged/alerts';
import { ModalResponseOrcamentoComponent } from '../modal-resposta-orcamento/modal-resposta-orcamento.component';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;
@Component({
  selector: 'app-orcamento-show',
  templateUrl: './orcamento-show.component.html',
  styleUrls: ['./orcamento-show.component.css']
})
export class OrcamentoShowComponent implements OnInit {
  @ViewChild('autosize', { read: ElementRef, static: true }) autosize: any = CdkTextareaAutosize;
  profissional: any;
  orcamento: any = null;
  loadingButton: any = false;
  erroOrcamento: any = false;
  erroOrcamentoText: any = "Favor preencher a descrição";
  erroData: any = false;
  user: any;
  endereco: any;
  sucessoSolicitar: any = false;
  profissionais: any = [];
  prof_info = '../assets/imgs/profs/prof_info.svg';
  prof_warning = '../assets/imgs/profs/prof_warning.svg';
  prof_sucess = '../assets/imgs/profs/prof_sucess.svg';
  prof_danger = '../assets/imgs/profs/prof_danger.svg';
  global_: any;
  usuarioSolicitante: any;
  respostas:any =[];
  constructor(private authService: AuthService, private _ngZone: NgZone, public dialog: MatDialog, public global: Global, public apiService: ApiService, private alertService: AlertService) {
    this.global_ = global;
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
      }
    });

    this.authService.orcamento.subscribe(res => {
      if (res) {
        this.orcamento = res;
        this.obterUsuarioSolicitante(this.orcamento['usuario_solicitante_id']);
        this.getOrcamentoRespostas(this.orcamento.id)
      }
    });
  }

  obterUsuarioSolicitante(id: any) {
    this.apiService.Get(`Usuario/${id}`).then((res: any) => {
      this.usuarioSolicitante = res;      
    }).catch((err) => {
      this.loadingButton = false;
    });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {
  }

  closeRightBar() {
    $("#orcamento-show").removeClass("orcamento-show-show-profi").removeClass("orcamento-show-show");
  }

  getOrcamento(id: any) {
    this.apiService.Get(`Orcamento/${id}`).then((res: any) => {
      this.loadingButton = false;      
      this.orcamento = res;
    }).catch((err) => {
      this.loadingButton = false;

      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

  getOrcamentoRespostas(id: any) {
    this.apiService.Get(`Orcamento/${id}/Respostas`).then((res: any) => {
      this.loadingButton = false;      
      this.respostas = res;
    }).catch((err) => {
      this.loadingButton = false;

      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

  showAlertErro(msg: any) {
    this.alertService.danger(`${msg}`);
  }

  openModalResposta() {
    var orcamento = this.orcamento;
    const dialogRef = this.dialog.open(ModalResponseOrcamentoComponent, {
      width: 'auto',
      data: { orcamento }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'ok') {
        this.getOrcamento(this.orcamento.id);
        this.getOrcamentoRespostas(this.orcamento.id)
      }
    });
  }

  recusarOrcamento(){  
  var obj = {
    "status_orcamento": 'RECUSADO_PROFISSIONAL'
  }
    this.apiService.Put(`Orcamento`,obj).then((res: any) => {
      this.loadingButton = false;      
      this.alertService.success(`Orçamento recusado, você poderá receber novas propostas desse usuário.`);
    }).catch((err) => {
      this.loadingButton = false;

      this.showAlertErro('Houve um erro ao tentar obter orçamentos');
    });
  }

}
