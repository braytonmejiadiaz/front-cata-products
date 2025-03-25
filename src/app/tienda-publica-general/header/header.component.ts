import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isHover = false;
  isHoverr = false;
  phone:string = "";
  products: any[] = [];
  filteredProducts: any[] = [];
  slug: string | null = null;
  search: string = '';
  searchSubject = new Subject<string>();
  usuario: any = {};
  marcas: any[] = [];
  marca_id: string = '';
  categorie_first_id: string | null = null;
  categories_first: any[] = [];
  selectedCategory: string | null = null;
  sliders: any[] = [];
  mobileMenuOpen = false;

  // Configuración de caché (8 minutos por defecto)
  private CACHE_EXPIRATION_TIME = 24400000;

  constructor(
    private publicService: Tiendaservice,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  // Métodos de caché
  private getCacheKey(prefix: string): string {
    return `${prefix}_${this.slug}`;
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
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadTiendaUsuario(this.slug);
      }
    });

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
  }

  obtenerDatosUsuario(slug: string) {
    const cacheKey = this.getCacheKey('header_usuario_data');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.usuario = cachedData;
      return;
    }

    this.publicService.getDataUsuario(slug).subscribe(
      (data: any) => {
        this.usuario = data;
        this.saveToCache(cacheKey, data);
      },
      (error: any) => {
        console.error('Error al cargar datos del usuario', error);
      }
    );
  }

  loadTiendaUsuario(slug: string) {
    const cacheKey = this.getCacheKey('header_tienda_data');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.processTiendaData(cachedData);
      return;
    }

    this.publicService.getTiendaUsuario(slug).subscribe(
      (resp: any) => {
        this.processTiendaData(resp);
        this.saveToCache(cacheKey, resp);
      },
      (err: any) => {
        this.toast.error('Error al cargar la tienda', err.error.message);
        this.filteredProducts = [];
      }
    );
  }

  private processTiendaData(resp: any) {
    if (resp && resp.productos && resp.productos.data) {
      this.products = resp.productos.data;
      this.filteredProducts = this.products;
    } else {
      this.products = [];
      this.filteredProducts = [];
    }
  }

  goToProduct(productId: number) {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug, 'producto', productId]);
  }

  goToHome() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug]);
  }

  goToAboutUs(){
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug, 'nosotros']);
  }

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda',slug,'carrito']);
  }

  getProductUrl(product: any): string {
    return `${window.location.origin}/tienda/${this.slug}/producto/${product.id}`;
  }
}
