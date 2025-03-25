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

  constructor(
    public productService: ProductService,
    private toast: ToastrService,
    private slidersService: SlidersService,
    private router: Router,
    private profile: ProfileUserService

  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.startAutoSlide();
    this.listProducts();
    this.configAll();
    this.loadSliders();

    //buscador automático
    this.searchSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.filterProducts();
      });

  }

  getUserInfo() {
    this.profile.showUsers().subscribe(
      (response: any) => {
        this.usuario = response;
        console.log(this.usuario)
      },
      (error) => {
        this.toast.error('Error al cargar la información del usuario');
      }
    );
  }
  // Método para cargar los sliders
  loadSliders() {
    this.slidersService.listSliders(1, '').subscribe(
      (resp: any) => {
        this.sliders = resp.sliders;
      },
      (err: any) => {
        this.toast.error('Error al cargar los sliders', err.error.message);
      }
    );
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_first = [{ id: null, name: 'Todos' }, ...this.categories_first];
    });
  }

  listProducts(page: number = 1) {
    const data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
    };

    this.productService.listProducts(page, data).subscribe(
      (resp: any) => {
        this.products = resp.products.data;
        this.filteredProducts = this.products;
      },
      (err: any) => {
        this.toast.error('Error al cargar los productos', err.error.message);
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
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/producto', productId]);
  }


  navigateCart(){
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
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
