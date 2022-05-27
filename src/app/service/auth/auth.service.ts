import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = new BehaviorSubject(undefined);
  authToken = new BehaviorSubject(undefined);
  hasEndereco = new BehaviorSubject(undefined);
  hasLatLong = new BehaviorSubject(undefined);
  profissional = new BehaviorSubject(undefined);
  profissionais = new BehaviorSubject(undefined);
  orcamento = new BehaviorSubject(undefined);

  constructor(private router: Router) { }

  async loginUser(user: any) {
    await localStorage.setItem('@bairrista:currentUser', JSON.stringify(user));
    await this.authToken.next(user.access_token)
    await this.currentUser.next(user);
    this.router.navigate(['principal']);
  }

  async saveUser(user: any) {
    await localStorage.setItem('@bairrista:currentUser', JSON.stringify(user));
    await this.authToken.next(user.access_token);
    await this.currentUser.next(user);
  }

  async saveUserOnly(user: any) {
    var currentUser = localStorage.getItem('@bairrista:currentUser');
    if (currentUser) {
      user.access_token = JSON.parse(currentUser).access_token;
      await localStorage.setItem('@bairrista:currentUser', JSON.stringify(user));
      await this.currentUser.next(user);
    }
  }


  async logoutUser() {
    await localStorage.clear();
    await this.authToken.next(undefined);
    await this.currentUser.next(undefined);
    this.router.navigate(['login']);
  }



  async setHasEndereco(text: any) {
    this.hasEndereco.next(text);
  }

  async setHasLatLong(text: any) {
    this.hasLatLong.next(text);
  }


  async setProfissional(text: any) {
    this.profissional.next(text);
  }

  async setProfissionais(text: any) {
    this.profissionais.next(text);
  }


  async setOrcamento(text: any) {
    this.orcamento.next(text);
  }
}
