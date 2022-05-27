import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';
import { LocationService } from 'src/app/service/locationService';
declare var Swiper: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  user: any = {};
  profissionais: any = [];
  profissionais_: any = [];

  lat = 0;
  lng = 0;
  zoom = 8;
  locationIcon = '../assets/imgs/pin_locale.svg';
  showProfi: any = false;
  prof_info = '../assets/imgs/profs/prof_info.svg';
  prof_warning = '../assets/imgs/profs/prof_warning.svg';
  prof_sucess = '../assets/imgs/profs/prof_sucess.svg';
  prof_danger = '../assets/imgs/profs/prof_danger.svg';

  constructor(
    private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    public global: Global,
    public locationService: LocationService,
    private alertService: AlertService

  ) {
    this.authService.currentUser.subscribe(res => {
      if (res != null) {
        this.user = res;

        if (this.user['profissao'] == null || this.user['profissao'] == "") {
          this.alertService.warning('Clique na inicial do seu nome para adiconar uma profissão, sem isso você não poderá receber orçamentos');
        }
        this.checkUserEndereco(this.user.id);
      }
    });
    this.showProfi = true;
    this.getProfissionais();
    // this.authService.hasEndereco.subscribe(res => {
    //   if (res) {


    //   }
    // });
  }

  getProfissionais() {
    this.apiService.Get(`Usuario`).then((res: any) => {
      if (res.length > 0) {
        this.profissionais = res.filter((x: any) => x.enderecos.length > 0 && x.id != this.user.id && x.profissao != "");
        this.profissionais.forEach((element: any) => {
          var loc = this.global.getRandomLocation(this.lat, this.lng);
          if (element.enderecos.length > 0) {
            element.enderecos[0].lat = parseFloat(parseFloat(loc[0]).toFixed(7));
            element.enderecos[0].lng = parseFloat(parseFloat(loc[1]).toFixed(7));
            if (element.orcamentos.length > 0) {
              var verif = element.orcamentos.filter((x: any) => x.usuario_solicitante_id == this.user.id);
              verif = verif.sort(function (a: any, b: any) {
                var c: any = new Date(a.data_criacao);
                var d: any = new Date(b.data_criacao);
                return d - c;
              });
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
                  case "RECUSADO_PROFISSIONAL":
                    element.locationIcon = this.prof_danger;
                    element.status = "RECUSADO_PROFISSIONAL";
                    break;
                  case "APROVADO":
                    element.locationIcon = this.prof_sucess;
                    element.status = "APROVADO";
                    break;
                  case "AGUARDANDO_CLIENTE":
                    element.locationIcon = this.prof_warning;
                    element.status = "AGUARDANDO_CLIENTE";
                    break;
                  case "FINALIZADO":
                    element.locationIcon = this.prof_sucess;
                    element.status = "FINALIZADO";
                    break;
                  case "AVALIADO":
                    element.locationIcon = this.prof_sucess;
                    element.status = "AVALIADO";
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

  checkUserEndereco(id: any) {
    this.apiService.Get(`Usuario/${id}/Endereco`).then((res: any) => {
      if (res.length == 0) {
        this.alertService.info('Você ainda não cadastrou um endereço, cadastre para ficar visível para outros usuários');
        this.authService.setHasEndereco(null);
      } else {
        this.authService.setHasEndereco(res[0]);
      }
    }).catch((err) => {

      this.alertService.danger('Erro ao obter endereços');
    });
  }

  ngOnInit() {
    this.locationService.getPosition().then(pos => {
      this.authService.setHasLatLong(true)
      this.lat = pos.lat;
      this.lng = pos.lng;
      this.zoom = 20;
    });
  }

  markerClicked(marker: any) {
    this.authService.setProfissional(marker).then(() => {
      $("#right-bar").toggleClass("right-bar-show-profi");
    })
  }

  showListProf() {
    $("#right-bar").toggleClass("right-bar-show");
  }

}
