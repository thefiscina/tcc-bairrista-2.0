import { Http, Response } from '@angular/http';
import { IAppConfig } from '../models/app-config.model';
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {

  static settings: IAppConfig;

  constructor(private http: Http) { }

  load() {
    const jsonFile = `../../assets/config/config.dev.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: Response) => {
        AppConfig.settings = <IAppConfig>response.json();
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
}
