import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AlertService } from '@full-fledged/alerts';
declare var $: any;
@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit {
  @ViewChild('autosize', { read: ElementRef, static: true }) autosize: any = CdkTextareaAutosize;
  profissional: any;
  orcamento: any = {};
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
  constructor(private authService: AuthService, private _ngZone: NgZone, public global: Global, public apiService: ApiService, private alertService: AlertService,) {
    this.authService.profissional.subscribe(res => {
      if (res) {

        this.profissional = res;
      } else {
        this.profissional = null;
      }
    });
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
      }
    });

    this.authService.hasEndereco.subscribe(res => {
      if (res) {
    
        this.endereco = res;
      }
    });

    this.authService.profissionais.subscribe(res => {
      if (res) {
        this.profissionais = res;
      }
    });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit(): void {
  }

  init() {
    this.orcamento = {};
    this.profissional = null;
    this.sucessoSolicitar = false;
    $("#right-bar").removeClass("right-bar-show-profi").addClass("right-bar-show");

  }

  voltarLista() {
    this.init();
  }

  closeRightBar() {
    this.init();
    $("#right-bar").removeClass("right-bar-show-profi").removeClass("right-bar-show");
    this.authService.setProfissional(null);
    this.getProfissionais();
  }

  showProf(prof: any) {
    this.sucessoSolicitar = false;
    this.authService.setProfissional(prof)
    $("#right-bar").removeClass("right-bar-show").addClass("right-bar-show-profi");
  }

  solicitarOrcamento() {
    if (this.loadingButton) {
      return;
    }
    this.erroOrcamento = false;
    this.erroData = false;
    this.loadingButton = true;

    if (this.orcamento.descricao == null || this.orcamento.descricao == "") {
      this.erroOrcamento = true;
      this.loadingButton = false;
      return;
    }

    if (this.orcamento.data == null || this.orcamento.data == "") {
      this.erroData = true;
      this.loadingButton = false;
      return;
    }

    if (this.orcamento.hora == null || this.orcamento.hora == "") {
      this.erroData = true;
      this.loadingButton = false;
      return;
    }

    var data_hora: any = this.global.formatarDataHoraValor(this.orcamento.data, this.orcamento.hora);
    if (data_hora == null || !data_hora["_isValid"]) {
      this.erroData = true;
      this.loadingButton = false;
      return;
    } else {
      this.orcamento.data_hora_orcamento = data_hora['_i'];
    }

    this.orcamento.usuario_solicitante_id = this.user.id;
    this.orcamento.usuario_id = this.profissional.id;
    if (this.endereco){
      this.orcamento.endereco_id = this.endereco.id;
    }else{
      this.loadingButton = false;
      this.showAlertErro('Você precisar cadastrar um endereço para solicitar um orçamento');      
      return;
    }

    var obj = Object.assign({}, this.orcamento);
    delete obj.data;
    delete obj.hora;

    this.apiService.Post(`Orcamento`, obj).then((res: any) => {
      this.alertService.info(`Sucesso ao solicitar orcamento`);
      this.sucessoSolicitar = true;
      // this.getOrcamento();
      this.getProfissionais();
    }).catch((err) => {
      this.loadingButton = false;
    
      this.showAlertErro('Houve um erro ao tentar solicitar o orçamento');
    });
  }

  getOrcamento(id: any) {
    this.apiService.Get(`Orcamento/${id}`).then((res: any) => {
      this.loadingButton = false;
      this.sucessoSolicitar = true;
    }).catch((err) => {
      this.loadingButton = false;
   
      this.showAlertErro('Houve um erro ao tentar cadastrar endereço');
    });
  }
  showAlertErro(msg: any) {
    this.alertService.danger(`${msg}`);
  }

  getProfissionais() {
    this.apiService.Get(`Usuario`).then((res: any) => {
      if (res.length > 0) {
        this.profissionais = res.filter((x: any) => x.enderecos.length > 0 && x.id != this.user.id && x.profissao != "");
        this.profissionais.forEach((element: any) => {
          if (element.enderecos.length > 0) {
            if (element.orcamentos.length > 0) {
              var verif = element.orcamentos.filter((x: any) => x.usuario_solicitante_id == this.user.id);
              if (verif.length > 0) {
                switch (verif[0].status_orcamento) {
                  case "PENDENTE":
                    element.locationIcon = this.prof_warning;
                    element.status = "PENDENTE";
                    break;
                  case "RECUSADO":
                    element.locationIcon = this.prof_danger;
                    element.status = "RECUSADO";
                    break;
                  case "APROVADO":
                    element.locationIcon = this.prof_sucess;
                    element.status = "APROVADO";
                    break;
                  default:
                    element.locationIcon = this.prof_info;
                    break;
                }

              }
            } else {
              element.locationIcon = this.prof_info;
            }
          }
        });
        this.authService.setProfissionais(this.profissionais);
      }
    }).catch((err) => {

      this.alertService.danger('Erro ao obter endereços');
    });
  }
}
