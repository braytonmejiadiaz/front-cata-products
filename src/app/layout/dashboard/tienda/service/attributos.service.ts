import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { LoginService } from '../../../../core/login-service.service';
import { URL_SERVICIOS } from '../../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class AttributosService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: LoginService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  configAll(){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}` });
    let URL = URL_SERVICIOS+"/admin/variations/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showProduct(product_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/products/"+product_id;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listSpecification(product_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/specifications?product_id="+product_id;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createSpecification(data:any){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/specifications";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateSpecification(specification_id:string,data:any){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/specifications/"+specification_id;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteSpecification(specification_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/specifications/"+specification_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  // VARIACIONES
  listVariations(product_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/variations?product_id="+product_id;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  createVariations(data:any){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/variations";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateVariations(variation_id:string,data:any){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/variations/"+variation_id;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteVariations(variation_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/variations/"+variation_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // VARIACIONES ANIDADAS
  listVariationsAnidadas(product_id:string,product_variation_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/anidado_variations?product_id="+product_id+"&product_variation_id="+product_variation_id;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  createVariationsAnidadas(data:any){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/anidado_variations";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateVariationsAnidadas(variation_id:string,data:any){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/anidado_variations/"+variation_id;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteVariationsAnidadas(variation_id:string){
    this.isLoadingSubject.next(true);
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    let URL = URL_SERVICIOS+"/admin/anidado_variations/"+variation_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
