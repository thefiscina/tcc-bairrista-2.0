import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "../global";
import { Router } from "@angular/router";
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { AuthService } from "./auth/auth.service";

@Injectable()
export class ApiService {
    currentUser: any;
    headerOptions: any;
    headers = new Headers();
    constructor(
        private http: HttpClient,
        public global: Global,
        public router: Router,
        private http_: Http,
        private authService: AuthService,
    ) {

    }

    Get(path: any) {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.global.apiUrl}${path}`,
                {
                    headers: new HttpHeaders()
                        .set("Content-Type", "application/json")
                        .set("Authorization", `Bearer ${this.authService.authToken.value}`)
                })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    Delete(path: any) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${this.global.apiUrl}${path}`,
                {
                    headers: new HttpHeaders()
                        .set("Content-Type", "application/json")
                        .set("Authorization", `Bearer ${this.authService.authToken.value}`)
                })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    Post(path: any, body: any) {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.global.apiUrl}${path}`, JSON.stringify(body),
                {
                    headers: new HttpHeaders()
                        .set("Content-Type", "application/json")
                        .set("Authorization", `Bearer ${this.authService.authToken.value}`)
                })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    Put(path: any, body: any) {
        return new Promise((resolve, reject) => {
            this.http.put(`${this.global.apiUrl}${path}`, JSON.stringify(body),
                {
                    headers: new HttpHeaders()
                        .set("Content-Type", "application/json")
                        .set("Authorization", `Bearer ${this.authService.authToken.value}`)
                })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }

    PostPublic(path: any, body: any) {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.global.apiUrl}${path}`, JSON.stringify(body),
                {
                    headers: new HttpHeaders()
                        .set("Content-Type", "application/json")
                })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
    

}
