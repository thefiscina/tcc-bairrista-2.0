import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';
declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  login: any = {};
  capsLock: any = false;
  capsLock2: any = false;
  seePass: any = false;
  step: any = 1;
  register: any = {};
  loadingButton: any = false;
  pular: any = false;
  validarEmail: any = false;
  expiredMail: any = false;
  showAlert: any = false;

  //erros
  nomeErro: any = false;
  sobrenomeErro: any = false;
  emailErro: any = false;
  alertEmail: any = "Por favor, insira o seu e-mail.";
  cpfInvalid: any = true;
  telefoneError: any = false;
  regexTelefone = /^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
  profissaoErro: any = false;
  cadastroSucesso: any = false;
  senhaErro: any = false;
  alertSenha: any = "Por favor, insira sua senha";
  confirmPassword: any = "";

  listaProfissao: any = [];

  listaProfissaoFilter: any = [];


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public apiService: ApiService,
    public global: Global,
    private authService: AuthService,
    private http: HttpClient,
    private alertService: AlertService
  ) {

  }

  ngOnInit() {
    this.getlists();
  }

  getlists() {
    this.getProfissao();
  }

  async nextStep() {
    if (this.step == 1) {
      this.nomeErro = false;
      this.sobrenomeErro = false;
      if (this.register.nome == null || this.register.nome == "") {
        this.nomeErro = true;
        this.loadingButton = false;
        this.alertService.danger('Nome obrigatório');
        return;
      }
      if (this.register.sobrenome == null || this.register.sobrenome == "") {
        this.sobrenomeErro = true;
        this.loadingButton = false;
        this.alertService.danger('Sobrenome obrigatório');
        return;
      }
      this.register.tipo_usuario == '1';

      this.step = this.step + 1;
      this.loadingButton = false;

    } else
      if (this.step == 2) {
        this.cpfInvalid = true;
        this.emailErro = false;
        this.telefoneError = false;
        if (this.register.cpf == null || this.register.cpf == "") {
          this.cpfInvalid = false;
          this.loadingButton = false;
          this.alertService.danger('CPF obrigatório');
          return;
        }

        if (this.register.email == null || this.register.email == "") {
          this.emailErro = true;
          this.loadingButton = false;
          this.alertEmail = "Por favor, insira o seu e-mail.";
          this.alertService.danger('E-mail obrigatório');
          return;
        }

        if (this.register.telefone == null || this.register.telefone == "") {
          this.telefoneError = true;
          this.loadingButton = false;
          this.alertService.danger('Telefone obrigatório');
          return;
        }

        if (!this.regexTelefone.test(this.register.telefone)) {
          this.telefoneError = true;
          this.loadingButton = false;
          this.alertService.danger('Telefone inválido');
          return;
        }

        this.step = this.step + 1;
        this.loadingButton = false;

      } else if (this.step == 3) {
        this.profissaoErro = false;
        if (this.register.profissao == null || this.register.profissao == "") {
          this.profissaoErro = true;
          this.loadingButton = false;
          this.alertService.danger('Profissão inválida');
          return;
        }
        this.step = this.step + 1;
        this.loadingButton = false;
      } else
        if (this.step == 4) {
          this.senhaErro = false;
          if (this.register.senha == null || this.register.senha == "") {
            this.senhaErro = true;
            this.alertSenha = "Favor inserir a senha";
            this.loadingButton = false;
            this.alertService.danger('Favor inserir a senha');

            return;
          }

          if (this.register.senha != this.confirmPassword) {
            this.senhaErro = true;
            this.alertSenha = "Senhas não condizem.";
            this.alertService.danger('Senhas não condizem');
            this.loadingButton = false;
            return;
          }
          // this.step = this.step + 1;
          this.loadingButton = true;
          var obj = Object.assign({}, this.register);
          obj.senha = this.global.MD5(obj.senha);
          this.finalizarCadastro(obj);
        }
  }

  closeAlert() {
    this.showAlert = false;
  }

  finalizarCadastro(obj: any) {
    this.apiService.PostPublic(`Usuario`, obj).then((res: any) => {
      this.alertService.success('Sucesso ao realizar cadastro');
      this.loadingButton = false;
      this.router.navigate(['login']);
    }).catch((err) => {
      this.cadastroSucesso = false;
      this.loadingButton = false;
      this.alertService.danger('Houve um erro ao criar seu cadastro');
    });
  }

  getProfissao() {
    this.apiService.Get(`Profissao`).then((res: any) => {
      this.listaProfissao = res;
    }).catch((err) => { });
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

  validarCPF(inputCPF: any) {
    if (!inputCPF) {
      this.cpfInvalid = false;
      return false;
    }
    var soma = 0;
    var resto;
    if (inputCPF == '00000000000') return false;
    for (var i = 1; i <= 9; i++) soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputCPF.substring(9, 10))) {
      this.cpfInvalid = false;
      return false;
    }

    soma = 0;
    for (i = 1; i <= 10; i++) soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputCPF.substring(10, 11))) {
      this.cpfInvalid = false;
      return false;
    }

    this.cpfInvalid = true;
    return false;
  }

  doFilter() {
    if (this.register.profissao) {
      var texto = this.register.profissao.toLowerCase();
      this.listaProfissaoFilter = this.listaProfissao.filter((x: any) => x.nome.toLowerCase().includes(texto))
    } else {
      this.listaProfissaoFilter = [];
    }
  }


}
