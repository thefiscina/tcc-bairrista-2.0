import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
declare var Chart: any;
declare var $: any;
@Component({
  selector: 'app-modal-rendimentos',
  templateUrl: './modal-rendimentos.component.html',
  styleUrls: ['./modal-rendimentos.component.scss']
})
export class ModalRendimentosComponent implements OnInit {
  global_: any;
  loading: any = false;
  user: any = {};
  totalAvaliacoes_: any = 0;
  totalAvaliacoesFeitas_: any = 0;
  trabalhosRecusados: any = 0;
  trabalhosAceitos: any = 0;
  @ViewChild('myChart', { read: ElementRef, static: false }) myChart: ElementRef | any;

  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialogRef: MatDialogRef<ModalRendimentosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.authService.currentUser.subscribe(res => {
      if (res != null) {
        this.user = res;
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.initChart();
    }, 1000);
  }

  initChart() {
    this.getOrcamentoSolicitados(`PENDENTE`);
    this.getOrcamentoRecebidos(`PENDENTE`);
    this.totalAvaliacoes();
    this.totalAvaliacoesFeitas();

    // const barChart = $('#barChart')[0].getContext('2d');
    // const lineChart = $('#lineChart')[0].getContext('2d');
    // const myChart = new Chart(barChart, {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [{
    //       label: 'Quantidade de orçamentos por mês',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true
    //       }
    //     }
    //   }
    // });
    // const myChart2 = new Chart(lineChart, {
    //   type: 'line',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [{
    //       label: 'Orçamentos aceitos',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255, 99, 132, 1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true
    //       }
    //     }
    //   }
    // });
  }

  fechar() {
    this.dialogRef.close();
  }


  showAlertErro(msg: any) {
    this.alertService.danger(`${msg}`);
  }

  getOrcamentoSolicitados(status: any) {
    const barChart = $('#barChart')[0].getContext('2d');
    this.apiService.Get(`Graficos/${this.user.id}/OrcamentoSolicitados`).then((res: any) => {

      var lineChartLabels = ['PENDENTE', 'RECUSADO', "APROVADO", "AGUARDANDO CLIENTE", "RECUSADO PELO PROFISSIONAL", "FINALIZADO"];
      var dataSet = [];
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'PENDENTE').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'RECUSADO').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'APROVADO').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'AGUARDANDO_CLIENTE').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'RECUSADO_PROFISSIONAL').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'FINALIZADO').length)

      const myChart2 = new Chart(barChart, {
        type: 'bar',
        data: {
          labels: lineChartLabels,
          datasets: [{
            label: 'Orçamentos Solicitados',
            data: dataSet,
            backgroundColor: [
              '#fdb448ed',
              '#c91c1ce6',
              '#74c045',
              '#fdb44887',
              '#c91c1ce6',
              '#74c04591'
            ],
            borderColor: [
              '#fdb448ed',
              '#c91c1ce6',
              '#74c045',
              '#fdb44887',
              '#c91c1ce6',
              '#74c04591'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }).catch((err) => {
      this.alertService.danger('Erro ao obter endereços');
    });
  }

  getOrcamentoRecebidos(status: any) {
    const barChart = $('#barChart2')[0].getContext('2d');
    this.apiService.Get(`Graficos/${this.user.id}/OrcamentoRecebidos`).then((res: any) => {

      var lineChartLabels = ['PENDENTE', 'RECUSADO', "APROVADO", "AGUARDANDO CLIENTE", "RECUSADO PELO PROFISSIONAL", "FINALIZADO"];
      var dataSet = [];
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'PENDENTE').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'RECUSADO').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'APROVADO').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'AGUARDANDO_CLIENTE').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'RECUSADO_PROFISSIONAL').length)
      dataSet.push(res.filter((x: any) => x.status_orcamento == 'FINALIZADO').length)
      this.trabalhosRecusados = res.filter((x: any) => x.status_orcamento == 'RECUSADO_PROFISSIONAL').length + res.filter((x: any) => x.status_orcamento == 'RECUSADO').length;
      this.trabalhosAceitos = res.filter((x: any) => x.status_orcamento == 'PENDENTE').length + res.filter((x: any) => x.status_orcamento == 'AGUARDANDO_CLIENTE').length;
      const myChart2 = new Chart(barChart, {
        type: 'bar',
        data: {
          labels: lineChartLabels,
          datasets: [{
            label: 'Orçamentos Recebidos',
            data: dataSet,
            backgroundColor: [
              '#fdb448ed',
              '#c91c1ce6',
              '#74c045',
              '#fdb44887',
              '#c91c1ce6',
              '#74c04591'
            ],
            borderColor: [
              '#fdb448ed',
              '#c91c1ce6',
              '#74c045',
              '#fdb44887',
              '#c91c1ce6',
              '#74c04591'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }).catch((err) => {
      this.alertService.danger('Erro ao obter endereços');
    });
  }

  totalAvaliacoes() {
    this.apiService.Get(`Graficos/Avaliacoes?usuario_id=${this.user.id}`).then((res: any) => {
      this.totalAvaliacoes_ = res.length;
    }).catch((err) => {
      this.alertService.danger('Erro ao obter avaliacoes');
    });
  }

  totalAvaliacoesFeitas() {
    this.apiService.Get(`Graficos/Avaliacoes?usuario_avaliacao_id=${this.user.id}`).then((res: any) => {
      this.totalAvaliacoesFeitas_ = res.length;
    }).catch((err) => {
      this.alertService.danger('Erro ao obter avaliacoes');
    });
  }
}
