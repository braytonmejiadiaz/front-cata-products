import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileUserService } from '../../../../core/profile-user/profile.service';

@Component({
  selector: 'app-header-plantilla',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderPlantillaComponent {
  isHover = false;
  isHoverr = false;
  phone: string = "";
  slug: string | null = null;
  usuario: any = {};
  mobileMenuOpen = false;

  // Configuración de caché (8 horas por defecto)
  private CACHE_EXPIRATION_TIME = 24400000;

  constructor(
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private profile: ProfileUserService
  ) {}

  // Métodos de caché
  private getCacheKey(prefix: string): string {
    return `${prefix}_header_plantilla`;
  }

  private getFromCache(key: string): any {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;

    const { data, timestamp } = JSON.parse(cachedData);
    const now = new Date().getTime();

    if (now - timestamp > this.CACHE_EXPIRATION_TIME) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  }

  private saveToCache(key: string, data: any): void {
    const cacheData = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    const cacheKey = this.getCacheKey('user_info');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.usuario = cachedData;
      console.log('Datos de usuario cargados desde caché', this.usuario);
      return;
    }

    this.profile.showUsers().subscribe(
      (response: any) => {
        this.usuario = response;
        this.saveToCache(cacheKey, response);
        console.log('Datos de usuario obtenidos del servidor', this.usuario);
      },
      (error) => {
        this.toast.error('Error al cargar la información del usuario');
      }
    );
  }
  goToHome() {
    this.router.navigate(['/dashboard/mi-tienda/ecommerce']);
  }

  goToAboutUs() {
    this.router.navigate(['/dashboard/mi-tienda/nosotros']);
  }

  navigateCart() {
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
  }
}
