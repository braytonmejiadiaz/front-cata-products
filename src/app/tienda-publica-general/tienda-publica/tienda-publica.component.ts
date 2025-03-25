import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tiendaservice } from './tienda.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { CartService } from '../../layout/dashboard/plantilla-ecommerce/cart.service';

@Component({
  selector: 'app-tienda-publica',
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent],
  templateUrl: './tienda-publica.component.html',
  styleUrl: './tienda-publica.component.scss'
})
export class TiendaPublicaComponent {
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
  popup: string = "";
  showAvatarPopup: boolean = false;
  showCartPopup: boolean = false;
  selectedProduct: any = null;
  quantity: number = 1;
  public currentIndex = 0;
  public intervalId: any;

  // Tiempo de vida del caché en milisegundos (4 horas)
  private CACHE_EXPIRATION_TIME = 14400000;

  constructor(
    private publicService: Tiendaservice,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public cartService: CartService,
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

  private clearCacheForStore(): void {
    const keys = [
      this.getCacheKey('tienda_usuario'),
      this.getCacheKey('tienda_categorias'),
      this.getCacheKey('tienda_sliders'),
      this.getCacheKey('tienda_usuario_data')
    ];

    keys.forEach(key => localStorage.removeItem(key));
  }

  // Método para verificar si un producto está en el carrito
  isProductInCart(product: any): boolean {
    const cartItems = this.cartService.getCartItems();
    return cartItems.some(item => item.product.id === product.id);
  }

  closeAvatarPopup() {
    this.showAvatarPopup = false;
    this.updatePopupCache();
  }

  private updatePopupCache() {
    localStorage.setItem('popupTimestamp', new Date().getTime().toString());
  }

  checkPopupCache() {
    const lastShown = localStorage.getItem('popupTimestamp');
    const now = Date.now();
    const twentyFourHours = 86400000;

    if (!lastShown || (now - Number(lastShown)) > twentyFourHours) {
      this.showAvatarPopup = true;
      this.updatePopupCache();
    }
  }

  ngOnInit(): void {
    this.startAutoSlide();
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadTiendaUsuario(this.slug);
        this.loadSlidersByUserSlug(this.slug);
      } else {
        this.toast.error('Error al cargar la tienda');
      }
    });

    this.searchSubject.subscribe(() => {
      this.filterProducts();
    });

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
    this.checkPopupCache();
  }

  obtenerDatosUsuario(slug: string) {
    const cacheKey = this.getCacheKey('tienda_usuario_data');
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
    const cacheKey = this.getCacheKey('tienda_usuario');
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
      this.loadCategoriesByUserSlug(this.slug!);
    } else {
      this.products = [];
      this.filteredProducts = [];
    }
  }

  loadCategoriesByUserSlug(slug: string) {
    const cacheKey = this.getCacheKey('tienda_categorias');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.processCategoriesData(cachedData);
      return;
    }

    this.publicService.getCategoriesByUserSlug(slug).subscribe(
      (resp: any) => {
        this.processCategoriesData(resp);
        this.saveToCache(cacheKey, resp);
      },
      (err: any) => {
        this.toast.error('Error al cargar las categorías', err.error.message);
      }
    );
  }

  private processCategoriesData(resp: any) {
    this.categories_first = resp.filter((category: any) => {
      return this.products.some((product) => product.categorie_first_id === category.id);
    });
  }

  loadSlidersByUserSlug(slug: string) {
    const cacheKey = this.getCacheKey('tienda_sliders');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.sliders = cachedData;
      return;
    }

    this.publicService.getSlidersByUserSlug(slug).subscribe(
      (resp: any) => {
        this.sliders = resp;
        this.saveToCache(cacheKey, resp);
      },
      (err: any) => {
        this.toast.error('Error al cargar los sliders', err.error.message || 'Error desconocido');
      }
    );
  }

  // Resto de los métodos permanecen igual...
  // [Mantén aquí todos los demás métodos sin cambios]

  // Filtra productos por categoría
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

  // Filtra productos por búsqueda
  filterProducts() {
    if (this.search) {
      this.filteredProducts = this.products.filter((product) =>
        product.title.toLowerCase().includes(this.search.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  // Escucha cambios en el buscador
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
    this.router.navigate(['/tienda', slug, 'carrito']);
  }

  getProductUrl(product: any): string {
    return `${window.location.origin}/tienda/${this.slug}/producto/${product.id}`;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product, 1);
    this.showCartPopup = true;
    this.toast.success('Producto añadido al carrito', '¡Éxito!');
  }

  closeCartPopup() {
    this.showCartPopup = false;
    this.quantity = 1;
  }

  goToCart() {
    this.closeCartPopup();
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug, 'carrito']);
  }

  removeFromCart(product: any) {
    this.cartService.removeFromCart(product);
  }

  getTotal(): number {
    return this.cartService.getCartItems().reduce((acc, item) => {
      return acc + (item.product.price_cop * item.quantity);
    }, 0);
  }

  // slider
  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  public nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.sliders.length;
  }

  public prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.sliders.length) % this.sliders.length;
  }

  public startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  public stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
