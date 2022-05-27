import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Global } from "../../global";
import { AlertService } from '@full-fledged/alerts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  userData: any;
  constructor(private router: Router,
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private http: HttpClient,
    public global: Global,
    private alertService: AlertService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });

  }

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
    await this.afAuth.signOut();
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

  //login google

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        console.log(res)
        // this.router.navigate(['principal']);
      }
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          // this.router.navigate(['principal']);
        });

        this.SetUserData(result.user);
      })
      .catch((error: any) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    console.log(userData);
    this.checkUserExiste(userData)
    return userRef.set(userData, {
      merge: true,
    });
  }


  checkUserExiste(userData: any) {
    var obj = {
      "nome": userData.displayName.split(' ')[0],
      "sobrenome": userData.displayName.split(' ')[1],
      "cpf": "",
      "email": userData.email,
      "telefone": "",
      "profissao": "",
      "senha": userData.uid,
      "tipo_usuario": '1'
    }
    debugger
    this.http.get(`${this.global.apiUrl}${`Usuario?email=${userData.email}`}`,
      {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")
      })
      .subscribe(
        (res: any) => {
          console.log(res)
          if (res.length == 0) {
            this.alertService.info('Cadastrando email');
            this.saveNewUser(obj);
          } else {
            this.alertService.warning('ja cadastrado');
            this.loginSocial(obj);
          }
        },
        err => {
          this.alertService.danger('Erro ao cadastrar usuario')
        }
      );
  }

  saveNewUser(obj: any) {
    this.http.post(`${this.global.apiUrl}${`Usuario/Google`}`, JSON.stringify(obj),
      {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")
      }).subscribe((res: any) => {
        console.log(res)
        this.loginSocial(obj);
      })
  }


  loginSocial(obj_: any) {
    var obj = {
      login: obj_.email,
      senha: this.global.MD5(obj_.senha)
    };
    this.http.post(`${this.global.apiUrl}${`Auth/SocialLogin`}`, JSON.stringify(obj),
      {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")
      }).subscribe(
        res => {
          this.loginUser(res)
        },
        err => {
          this.alertService.danger('Erro ao realizar login')
        }
      );
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
