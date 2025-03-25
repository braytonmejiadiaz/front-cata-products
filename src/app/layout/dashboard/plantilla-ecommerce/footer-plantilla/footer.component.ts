import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileUserService } from '../../../../core/profile-user/profile.service';

@Component({
  selector: 'app-footer-plantilla',
  imports: [CommonModule, FormsModule, ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterPlantillaComponent {
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
private profile: ProfileUserService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.searchSubject.subscribe(() => {
      this.filterProducts();
    });

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
  }


  obtenerDatosUsuario(slug: string) {
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



  // loadCategoriesByUserSlug(slug: string) {
  //   this.profile.getCategoriesByUserSlug(slug).subscribe(
  //     (resp: any) => {
  //       this.categories_first = resp;
  //     },
  //     (err: any) => {
  //       this.toast.error('Error al cargar las categorías', err.error.message);
  //     }
  //   );
  // }



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
