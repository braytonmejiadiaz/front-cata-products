import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, catchError, throwError } from 'rxjs';
import { URL_SERVICIOS } from '../../config/config';


@Injectable({
  providedIn: 'root'
})
export class Tiendaservice {

  constructor(private http:HttpClient){}

  getDataUsuario(slug: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/usuario/${slug}`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los productos de una tienda por su slug.
   * @param slug El slug de la tienda.
   */
  getTiendaUsuario(slug: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/tienda/${slug}`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los productos por el slug de un usuario.
   * @param slug El slug del usuario.
   */
  getProductosBySlug(slug: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/productos/${slug}`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los productos por el ID de un usuario.
   * @param userId El ID del usuario.
   */
  getProductsByUserId(userId: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/user/${userId}/products`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los productos por el slug de un usuario.
   * @param slug El slug del usuario.
   */
  getProductsByUserSlug(slug: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/user/${slug}/products`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los productos por el slug de un usuario.
   * @param slug El slug del usuario.
   */
  getCategoriesByUserSlug(slug: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/tienda/${slug}/categories`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los sliders de una tienda por su slug.
   * @param slug El slug de la tienda.
   */
  getSlidersByUserSlug(slug: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/tienda/${slug}/sliders`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  getProductById(productId: string): Observable<any> {
    const URL = `${URL_SERVICIOS}/products/${productId}`;
    return this.http.get(URL).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

}
