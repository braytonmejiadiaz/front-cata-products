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
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, ],
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

  constructor(
    private publicService: Tiendaservice,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public cartService: CartService,
  ) {}

  // Método para verificar si un producto está en el carrito
  isProductInCart(product: any): boolean {
    const cartItems = this.cartService.getCartItems();
    return cartItems.some(item => item.product.id === product.id);
  }

  closeAvatarPopup() {
    this.showAvatarPopup = false;
    this.updatePopupCache(); // Actualizar caché al cerrar manualmente
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
    this.publicService.getDataUsuario(slug).subscribe(
      (data: any) => {
        this.usuario = data;
      },
      (error: any) => {
      }
    );
  }

  loadTiendaUsuario(slug: string) {
    this.publicService.getTiendaUsuario(slug).subscribe(
      (resp: any) => {
        if (resp && resp.productos && resp.productos.data) {
          this.products = resp.productos.data; // Accede a resp.productos.data
          this.filteredProducts = this.products; // Inicializa filteredProducts
          this.loadCategoriesByUserSlug(slug); // Cargar categorías después de obtener los productos
        } else {
          this.products = [];
          this.filteredProducts = [];
        }
      },
      (err: any) => {
        this.toast.error('Error al cargar la tienda', err.error.message);
        this.filteredProducts = [];
      }
    );
  }

  loadCategoriesByUserSlug(slug: string) {
    this.publicService.getCategoriesByUserSlug(slug).subscribe(
      (resp: any) => {
        // Filtrar categorías que tienen productos
        this.categories_first = resp.filter((category: any) => {
          return this.products.some((product) => product.categorie_first_id === category.id);
        });
      },
      (err: any) => {
        this.toast.error('Error al cargar las categorías', err.error.message);
      }
    );
  }

  loadSlidersByUserSlug(slug: string) {
    this.publicService.getSlidersByUserSlug(slug).subscribe(
      (resp: any) => {
        this.sliders = resp;
      },
      (err: any) => {
        this.toast.error('Error al cargar los sliders', err.error.message || 'Error desconocido');
      }
    );
  }

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
    this.stopAutoSlide(); // Detener el carrusel al destruir el componente
  }

  // Cambiar al siguiente slide
  public nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.sliders.length;
  }

  // Cambiar al slide anterior
  public prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.sliders.length) % this.sliders.length;
  }

  // Iniciar el cambio automático
  public startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }

  // Detener el cambio automático
  public stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
