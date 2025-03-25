import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-about-us',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  phone: string = "";
  products: any[] = [];
  filteredProducts: any[] = [];
  slug: string | null = null;
  search: string = '';
  searchSubject = new Subject<string>();
  usuario: any = {};

  // Configuración de caché (8 horas por defecto)
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

  ngOnInit(): void {
    console.log('Inicializando componente AboutUsComponent');
    this.route.params.subscribe((params) => {
      console.log('Parámetros de la ruta:', params);
      this.slug = params['slug'];
      if (this.slug) {
        console.log('Slug obtenido:', this.slug);
        this.loadTiendaUsuario(this.slug);
      } else {
        console.error('No se encontró el slug en la URL');
      }
    });

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
  }

  obtenerDatosUsuario(slug: string) {
    const cacheKey = this.getCacheKey('about_usuario_data');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.usuario = cachedData;
      console.log('Datos del usuario cargados desde caché:', this.usuario);
      return;
    }

    this.publicService.getDataUsuario(slug).subscribe(
      (data: any) => {
        this.usuario = data;
        this.saveToCache(cacheKey, data);
        console.log('Datos del usuario obtenidos del servidor:', this.usuario);
      },
      (error: any) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  loadTiendaUsuario(slug: string) {
    const cacheKey = this.getCacheKey('about_tienda_data');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.processTiendaData(cachedData);
      console.log('Datos de tienda cargados desde caché:', cachedData);
      return;
    }

    console.log('Cargando tienda del usuario con slug:', slug);
    this.publicService.getTiendaUsuario(slug).subscribe(
      (resp: any) => {
        console.log('Respuesta del servicio:', resp);
        this.processTiendaData(resp);
        this.saveToCache(cacheKey, resp);
      },
      (err: any) => {
        console.error('Error al cargar la tienda:', err);
        this.toast.error('Error al cargar la tienda', err.error.message);
        this.filteredProducts = [];
      }
    );
  }

  private processTiendaData(resp: any) {
    if (resp && resp.productos && resp.productos.data) {
      this.products = resp.productos.data;
      this.filteredProducts = this.products;
      console.log('Productos cargados:', this.products);
    } else {
      console.error('La respuesta no tiene la estructura esperada:', resp);
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

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda',slug,'carrito']);
  }

  getProductUrl(product: any): string {
    return `${window.location.origin}/tienda/${this.slug}/producto/${product.id}`;
  }
}
