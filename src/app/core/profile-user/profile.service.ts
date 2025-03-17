import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { LoginService } from '../login-service.service';
import { URL_SERVICIOS } from '../../config/config';


@Injectable({
  providedIn: 'root'
})
export class ProfileUserService {
  constructor(
    private http: HttpClient,
    public authservice: LoginService,
  ) {   }

  updateProfile(data:any){
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/profile_client/";
    return this.http.put(URL,data,{headers: headers})
  }

  getInfoProfile(){
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/profile_client/";
    return this.http.get(URL,{headers: headers})
  }

  showUsers(){
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/profile_client/me";
    return this.http.get(URL,{headers: headers})
  }

  deletePopupImage() {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/delete_popup/";
    return this.http.delete(URL,{headers: headers})
  }


  private qrCodeSubject = new BehaviorSubject<string>('');
  qrCode$ = this.qrCodeSubject.asObservable();

  setQRCode(qrCode: string) {
    this.qrCodeSubject.next(qrCode);
  }

  getQRCode(): string {
    return this.qrCodeSubject.value;
  }


}
