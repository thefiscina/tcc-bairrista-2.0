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

@Component({
  selector: 'app-modal-edit-user',
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.css']
})
export class ModalEditUserComponent implements OnInit {
  global_: any;
  loading: any = false;
  ticket: any = {};
  user: any;
  seeEdit: any;
  listsEstate: any = [];
  listsCity: any = [];
  cpfInvalid: any = false;

  listSexo: any = [];
  listaEnderecos: any = [];
  cadastarEnderecos: any = false;
  loadingButton: any = false;
  endereco: any = {};

  cepErro: any = false;
  logradouroErro: any = false;
  bairroErro: any = false;
  estadoErro: any = false;
  cidadeErro: any = false;


  listaProfissao: any = [];
  listaProfissaoFilter: any = [];
  nomeErro: any = false;
  sobrenomeErro: any = false;
  telefoneError: any = false;
  regexTelefone = /^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
  profissaoErro: any = false;
  emailErro: any = false;
  alertEmail: any = "Por favor, insira o seu e-mail.";

  constructor(private router: Router,
    public apiService: ApiService,
    private authService: AuthService,
    private viacep: NgxViacepService,
    private alertService: AlertService,
    public global: Global,
    public dialogRef: MatDialogRef<ModalEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.getUserCliente();
  }

  getUserCliente() {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = Object.assign({}, res);
        this.getEnderecos(this.user.id);
      }
      this.getStates();
      this.getProfissao();
    });
  }

  getEnderecos(id: any) {
    this.apiService.Get(`Usuario/${id}/Endereco`).then((res: any) => {
      if (res.length == 0) {
        this.endereco = {};
        this.authService.setHasEndereco(null);
      } else {
        this.user.enderecos = res;

        this.endereco = res[0];
        this.authService.setHasEndereco(res[0]);
        this.endereco.estado_id = res[0].estado_id.toString();
        this.endereco.cidade_id = res[0].cidade_id.toString();
        localStorage.setItem('@bairrista:currentUser', JSON.stringify(this.user));
      }
    }).catch((err) => {
      this.showAlertErro('Erro ao obter endereços');
    });
  }

  showAlertErro(msg: any) {
    this.alertService.danger(`${msg}`);
  }

  searchCep() {
    if (this.endereco.cep != null && this.endereco.cep != "" && this.endereco.cep.length == 8) {
      this.getCep(this.endereco.cep)
    }
  }

  selectState(estado_id: any) {
    if (estado_id != null && estado_id != 0) {
      this.getCidades(estado_id);
    } else {
      this.endereco.cidade_id = 0;
    }
  }

  getStates() {
    this.apiService.Get('Estado').then((res) => {
      this.listsEstate = res;
      this.listsEstate.unshift({
        "nome": "Estado",
        id: 0
      });
      if (this.endereco.estado_id != null && this.endereco.estado_id != 0) {
        this.getCidades(this.endereco.estado_id);
      }
    }).catch((err) => {
      this.loading = false;
    });
  }

  getCidades(id_estado: any, localidade = "") {
    this.apiService.Get(`Estado/${id_estado}/Municipio`).then((res) => {
      this.listsCity = res;
      this.listsCity.unshift({
        "nome": "Cidade",
        id: 0
      });
      if (localidade != "") {
        let verfiCidade = this.listsCity.filter((x: any) => x.nome == localidade.toUpperCase());
        if (verfiCidade.length > 0) {
          this.endereco.cidade_id = verfiCidade[0].id.toString();
        }
      }
    }).catch((err) => {
      this.loading = false;
    });
  }

  getCep(cep: any) {
    this.viacep
      .buscarPorCep(cep)
      .pipe(
        catchError((error: CEPError) => {

          return EMPTY;
        })
      )
      .subscribe((endereco: Endereco) => {
        this.endereco.logradouro = endereco.logradouro;
        this.endereco.bairro = endereco.bairro;
        if (endereco.uf) {
          let verfiEstado = this.listsEstate.filter((x: any) => x.sigla == endereco.uf.toUpperCase());
          if (verfiEstado.length > 0) {
            this.endereco.estado_id = verfiEstado[0].id.toString();
            this.getCidades(this.endereco.estado_id, endereco.localidade);
          }
        }
      });
  }

  submitUser() {
    var obj = { ...this.user };
    if (obj.telefone.celular == "" || obj.telefone.celular == null) {
      this.showAlertErro(`Favor preencher o campo telefone`)
      return;
    }



    if (!this.regexTelefone.test(obj.telefone.celular)) {
      this.showAlertErro({
        body: `Campo telefone inválido`,
        title: 'Erro'
      });
      return;
    }
    obj.telefone = {
      codigo_pais: "55",
      codigo_area: obj.telefone.celular.substring(0, 2),
      numero: obj.telefone.celular.substring(2)
    };

    if (obj.data == "" || obj.data == null) {
      this.showAlertErro({
        body: `Favor preencher data de nascimento`,
        title: 'Erro'
      });
      return;
    } else {
      let nova_data = obj.data.split('/')[2] + "-" + obj.data.split('/')[1] + "-" + obj.data.split('/')[0];
      if (new Date(nova_data + "T00:00:00").toString() == "Invalid Date") {
        this.showAlertErro({
          body: `Favor preencher o campo data nascimento com uma data válida`,
          title: 'Erro'
        });
        return;
      }
      obj.data_nascimento = nova_data;
    }
    delete obj.sexo;
    delete obj.telefone.celular;
    delete obj.imagem_link;
    this.sendUser(obj)
  }

  sendUser(obj: any) {
    this.loading = true;
    this.apiService.Put('Usuario/{id}', obj).then((res) => {
      this.alertService.success(`Sucesso ao editar`);
      this.loading = false;
      this.getUserCliente();
    }).catch((err) => {
      this.loading = false;
      this.showAlertErro(`Erro: ${err.error}`);
    });
  }

  voltarEditUser() {
    this.dialogRef.close();
  }

  salvarEndereco() {
    if (this.loadingButton) {
      return;
    }
    this.cepErro = false;
    this.logradouroErro = false;
    this.bairroErro = false;
    this.estadoErro = false;
    this.cidadeErro = false;
    this.loadingButton = true;

    if (this.endereco.cep == null || this.endereco.cep == "") {
      this.cepErro = true;
      this.loadingButton = false;
      return;
    }

    if (this.endereco.logradouro == null || this.endereco.logradouro == "") {
      this.logradouroErro = true;
      this.loadingButton = false;
      return;
    }

    if (this.endereco.bairro == null || this.endereco.bairro == "") {
      this.bairroErro = true;
      this.loadingButton = false;
      return;
    }

    if (this.endereco.estado_id == null || this.endereco.estado_id == 0) {
      this.estadoErro = true;
      this.loadingButton = false;
      return;
    }

    if (this.endereco.cidade_id == null || this.endereco.cidade_id == 0) {
      this.cidadeErro = true;
      this.loadingButton = false;
      return;
    }

    this.endereco.estado = this.listsEstate.filter((x: any) => x.id == this.endereco.estado_id)[0].nome;
    this.endereco.cidade = this.listsCity.filter((x: any) => x.id == this.endereco.cidade_id)[0].nome;
    if (this.endereco.id != null && this.endereco.id > 0) {
      this.endereco.usuario_id = this.user.id;
      this.apiService.Put(`Endereco/${this.endereco.id}`, this.endereco).then((res: any) => {
        this.loadingButton = false;
        this.alertService.success(`Sucesso ao salvar endereço`);
        this.getEnderecos(this.user.id);
      }).catch((err) => {
        this.loadingButton = false;

        this.showAlertErro('Houve um erro ao tentar cadastrar endereço');
      });

    } else {
      this.apiService.Post(`Usuario/${this.user.id}/Endereco`, this.endereco).then((res: any) => {
        this.loadingButton = false;
        this.alertService.success(`Sucesso ao salvar endereço`);
        this.getEnderecos(this.user.id);
      }).catch((err) => {
        this.loadingButton = false;

        this.showAlertErro('Houve um erro ao tentar cadastrar endereço');
      });
    }
  }

  salvarUsuario() {
    this.nomeErro = false;
    this.sobrenomeErro = false;
    this.emailErro = false;
    this.telefoneError = false;
    if (this.user.nome == null || this.user.nome == "") {
      this.nomeErro = true;
      this.loadingButton = false;
      return;
    }
    if (this.user.sobrenome == null || this.user.sobrenome == "") {
      this.sobrenomeErro = true;
      this.loadingButton = false;
      return;
    }

    if (this.user.email == null || this.user.email == "") {
      this.emailErro = true;
      this.loadingButton = false;
      this.alertEmail = "Por favor, insira o seu e-mail.";
      return;
    }

    if (this.user.telefone == null || this.user.telefone == "") {
      this.telefoneError = true;
      this.loadingButton = false;
      return;
    }

    if (!this.regexTelefone.test(this.user.telefone)) {
      this.telefoneError = true;
      this.loadingButton = false;
      return;
    }

    // this.profissaoErro = false;
    // if (this.user.profissao == null || this.user.profissao == "") {
    //   this.profissaoErro = true;
    //   this.loadingButton = false;
    //   return;
    // }

    this.apiService.Put(`Usuario/${this.user.id}`, this.user).then((res: any) => {
      this.loadingButton = false;
      this.alertService.success(`Sucesso ao salvar dados`);
      this.getUsuarioId(this.user.id);
    }).catch((err) => {
      this.loadingButton = false;
      this.showAlertErro('Houve um erro ao tentar atualizar dados');
    });

  }

  getUsuarioId(id: any) {
    this.apiService.Get(`Usuario/${id}`).then((res: any) => {
      this.authService.saveUserOnly(res);
    }).catch((err) => {
      this.showAlertErro('Erro ao obter endereços');
    });
  }

  getProfissao() {
    this.apiService.Get(`Profissao`).then((res: any) => {
      this.listaProfissao = res;
    }).catch((err) => { });
  }

  doFilter() {
    if (this.user.profissao) {
      var texto = this.user.profissao.toLowerCase();
      this.listaProfissaoFilter = this.listaProfissao.filter((x: any) => x.nome.toLowerCase().includes(texto))
    } else {
      this.listaProfissaoFilter = [];
    }
  }

  countLettersChange(event: any) {
    const pattern = /^[a-zA-Z\s]*$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  countChange(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  fechar() {
    this.dialogRef.close();
  }

}
