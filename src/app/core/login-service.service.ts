import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of, tap, throwError, finalize, Observable } from 'rxjs';
import { URL_SERVICIOS } from '../config/config';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token: string = '';
  user: any;

  constructor(
    public http: HttpClient,
    public router: Router
  ) {
    this.initAuth();
  }


  initAuth() {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (token) {
      this.token = token;
      try {
        this.user = userData ? JSON.parse(userData) : null;
      } catch (error) {
        this.user = null;
      }
    }
  }


  login(email: string, password: string) {
    let URL = URL_SERVICIOS + "/auth/login";
    return this.http.post(URL, { email, password }).pipe(
      map((resp: any) => {
        const result = this.saveSessionStorage(resp);
        return result;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }



  saveSessionStorage(resp: any) {
    if (resp && resp.access_token) {
        sessionStorage.setItem("token", resp.access_token);
        sessionStorage.setItem("user", JSON.stringify(resp.user));
        return true;
    }
    return false;
}

register(data: any): Observable<any> {
  const URL = `${URL_SERVICIOS}/auth/register`;
  return this.http.post(URL, data).pipe(
      catchError((error) => {
          console.error('Error en el registro:', error);
          return throwError(error);
      })
  );
}


  getPlans() {
    const URL = `${URL_SERVICIOS}/auth/plans`;  // URL de los planes en Laravel
    return this.http.get(URL).pipe(
      catchError((err) => {
        return of([]); // Retornar un arreglo vacío en caso de error
      })
    );
  }



  verifiedAuth(data: any) {
    let URL = URL_SERVICIOS + "/auth/verified_auth";
    return this.http.post(URL, data);
  }

  verifiedMail(data: any) {
    let URL = URL_SERVICIOS + "/auth/verified_email";
    return this.http.post(URL, data);
  }

  verifiedCode(data: any) {
    let URL = URL_SERVICIOS + "/auth/verified_code";
    return this.http.post(URL, data);
  }

  verifiedNewPassword(data: any) {
    let URL = URL_SERVICIOS + "/auth/verified_password";
    return this.http.post(URL, data);
  }

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    this.user = null;
    this.token = '';

    setTimeout(() => {

      this.router.navigateByUrl("/ingresar");

    }, 100);
  }


}
