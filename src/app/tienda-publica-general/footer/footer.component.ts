import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  phone: string = "";
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
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadTiendaUsuario(this.slug);
        this.loadCategoriesByUserSlug(this.slug);
      }
    });

    this.searchSubject.subscribe(() => {
      this.filterProducts();
    });

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
  }

  obtenerDatosUsuario(slug: string) {
    const cacheKey = this.getCacheKey('footer_usuario_data');
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
    const cacheKey = this.getCacheKey('footer_tienda_data');
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

  loadCategoriesByUserSlug(slug: string) {
    const cacheKey = this.getCacheKey('footer_categories_data');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.categories_first = cachedData;
      return;
    }

    this.publicService.getCategoriesByUserSlug(slug).subscribe(
      (resp: any) => {
        this.categories_first = resp;
        this.saveToCache(cacheKey, resp);
      },
      (err: any) => {
        this.toast.error('Error al cargar las categorías', err.error.message);
      }
    );
  }

  // Resto de los métodos permanecen igual...
  filterByCategory(categoryId: string | null) {
    this.selectedCategory = categoryId;
    if (categoryId) {
      this.filteredProducts = this.products.filter(
        (product) => product.categorie_first_id === categoryId
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  filterProducts() {
    if (this.search) {
      this.filteredProducts = this.products.filter((product) =>
        product.title.toLowerCase().includes(this.search.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  onSearchChange() {
    this.searchSubject.next(this.search);
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
