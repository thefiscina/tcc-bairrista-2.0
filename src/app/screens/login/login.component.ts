import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';
import { Global } from 'src/app/global';
import { ApiService } from 'src/app/service/apiServices';
import { AuthService } from 'src/app/service/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  login: any = {};
  capsLock: any = false;
  seePass: any = false;
  erroLogin: any = false;
  loading: any = false;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public apiService: ApiService,
    public global: Global,
    public authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    let that = this;
    var senha: any;
    senha = document.getElementById("senha_bairrista");
    try {
      senha.addEventListener("keyup", function (event: any) {
        if (event.getModifierState("CapsLock")) {
          that.capsLock = true;
        } else {
          that.capsLock = false;
        }
      });

    } catch (error) { }

  }


  loginUser() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.erroLogin = false;
    if (this.login.cpf == null || this.login.cpf == "") {
      this.erroLogin = true;
      this.loading = false;
      return;
    }

    if (this.login.password_ == null || this.login.password_ == "") {
      this.erroLogin = true;
      this.loading = false;
      return;
    }

    var obj = Object.assign({}, this.login);

    obj.login = this.login.cpf;
    obj.senha = this.global.MD5(this.login.password_);

    delete obj.password_;
    delete obj.cpf;

    this.apiService.PostPublic(`Auth`, obj).then((res: any) => {
      this.loading = false;
      this.authService.loginUser(res);
    }).catch((err) => {
      this.loading = false;
      this.alertService.danger('Erro ao tentar realizar login');
    });
  }

}
