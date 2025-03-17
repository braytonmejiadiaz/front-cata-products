import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule, ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
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

  constructor(
    private publicService: Tiendaservice,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
      this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadTiendaUsuario(this.slug);
        this.loadCategoriesByUserSlug(this.slug);
      } else {
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
        this.categories_first = resp;
      },
      (err: any) => {
        this.toast.error('Error al cargar las categorías', err.error.message);
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
    this.router.navigate(['/tienda',slug,'carrito']);
  }
  getProductUrl(product: any): string {
    return `${window.location.origin}/tienda/${this.slug}/producto/${product.id}`;
  }
}
