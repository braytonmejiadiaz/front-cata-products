import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../tienda/service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SlidersService } from '../../tienda/sliders/service/sliders.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderPlantillaComponent } from "../header-plantilla/header.component";
import { ProfileUserService } from '../../../../core/profile-user/profile.service';
import { FooterPlantillaComponent } from "../footer-plantilla/footer.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule, HeaderPlantillaComponent, FooterPlantillaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  products: any[] = [];
  filteredProducts: any[] = [];
  search: string = '';
  searchSubject = new Subject<string>();
  marcas: any[] = [];
  marca_id: string = '';
  categorie_first_id: string | null = null;
  categories_first: any[] = [];
  selectedCategory: string | null = null;
  sliders: any[] = [];
  usuario: any = {};
  public currentIndex = 0;
  public intervalId: any;

  // Configuración de caché (8 horas por defecto)
  private CACHE_EXPIRATION_TIME = 24400000;

  constructor(
    public productService: ProductService,
    private toast: ToastrService,
    private slidersService: SlidersService,
    private router: Router,
    private profile: ProfileUserService
  ) {}

  // Métodos de caché
  private getCacheKey(prefix: string): string {
    return `${prefix}_home`;
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
    this.getUserInfo();
    this.startAutoSlide();
    this.listProducts();
    this.configAll();
    this.loadSliders();

    // Buscador automático
    this.searchSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.filterProducts();
      });
  }

  getUserInfo() {
    const cacheKey = this.getCacheKey('user_info');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.usuario = cachedData;
      return;
    }

    this.profile.showUsers().subscribe(
      (response: any) => {
        this.usuario = response;
        this.saveToCache(cacheKey, response);
      },
      (error) => {
        this.toast.error('Error al cargar la información del usuario');
      }
    );
  }

  loadSliders() {
    const cacheKey = this.getCacheKey('sliders');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.sliders = cachedData;
      return;
    }

    this.slidersService.listSliders(1, '').subscribe(
      (resp: any) => {
        this.sliders = resp.sliders;
        this.saveToCache(cacheKey, resp.sliders);
      },
      (err: any) => {
        this.toast.error('Error al cargar los sliders', err.error.message);
      }
    );
  }

  configAll() {
    const cacheKey = this.getCacheKey('config');
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.marcas = cachedData.brands;
      this.categories_first = [{ id: null, name: 'Todos' }, ...cachedData.categories_first];
      return;
    }

    this.productService.configAll().subscribe((resp: any) => {
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_first = [{ id: null, name: 'Todos' }, ...this.categories_first];
      this.saveToCache(cacheKey, { brands: resp.brands, categories_first: resp.categories_first });
    });
  }

  listProducts(page: number = 1) {
    const cacheKey = this.getCacheKey(`products_${page}_${this.search}_${this.marca_id}_${this.categorie_first_id}`);
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      this.products = cachedData.products;
      this.filteredProducts = cachedData.products;
      return;
    }

    const data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
    };

    this.productService.listProducts(page, data).subscribe(
      (resp: any) => {
        this.products = resp.products.data;
        this.filteredProducts = this.products;
        this.saveToCache(cacheKey, { products: resp.products.data });
      },
      (err: any) => {
        this.toast.error('Error al cargar los productos', err.error.message);
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
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/producto', productId]);
  }

  navigateCart() {
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
  }

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
