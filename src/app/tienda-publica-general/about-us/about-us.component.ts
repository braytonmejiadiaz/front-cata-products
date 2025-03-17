import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ActivatedRoute, Router,  } from '@angular/router';
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
  sliders: any[] = []; // Variable para almacenar los sliders

  constructor(
    private publicService: Tiendaservice,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('Inicializando componente TiendaPublicaComponent');
    this.route.params.subscribe((params) => {
      console.log('Parámetros de la ruta:', params);
      this.slug = params['slug'];
      if (this.slug) {
        console.log('Slug obtenido:', this.slug);
        this.loadTiendaUsuario(this.slug);
        this.loadCategoriesByUserSlug(this.slug);
        this.loadSlidersByUserSlug(this.slug);
      } else {
        console.error('No se encontró el slug en la URL');
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
        console.log(this.usuario); // Muestra los datos en la consola
      },
      (error: any) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  loadTiendaUsuario(slug: string) {
    console.log('Cargando tienda del usuario con slug:', slug);
    this.publicService.getTiendaUsuario(slug).subscribe(
      (resp: any) => {
        console.log('Respuesta del servicio:', resp);
        if (resp && resp.productos && resp.productos.data) {
          this.products = resp.productos.data; // Accede a resp.productos.data
          this.filteredProducts = this.products; // Inicializa filteredProducts
          console.log('Productos cargados:', this.products);
        } else {
          console.error('La respuesta no tiene la estructura esperada:', resp);
          this.products = [];
          this.filteredProducts = [];
        }
      },
      (err: any) => {
        console.error('Error al cargar la tienda:', err);
        this.toast.error('Error al cargar la tienda', err.error.message);
        this.filteredProducts = [];
      }
    );
  }

  loadCategoriesByUserSlug(slug: string) {
    this.publicService.getCategoriesByUserSlug(slug).subscribe(
      (resp: any) => {
        console.log('Categorías cargadas:', resp);
        this.categories_first = resp;
      },
      (err: any) => {
        console.error('Error al cargar las categorías:', err);
        this.toast.error('Error al cargar las categorías', err.error.message);
      }
    );
  }

  loadSlidersByUserSlug(slug: string) {
    this.publicService.getSlidersByUserSlug(slug).subscribe(
      (resp: any) => {
        console.log('Sliders cargados:', resp);
        this.sliders = resp;
      },
      (err: any) => {
        console.error('Error al cargar los sliders:', err);
        this.toast.error('Error al cargar los sliders', err.error.message || 'Error desconocido');
      }
    );
  }

  // Filtra productos por categoría
  filterByCategory(categoryId: string | null) {
    this.selectedCategory = categoryId; // Resalta la categoría seleccionada

    if (categoryId) {
      this.filteredProducts = this.products.filter(
        (product) => product.categorie_first_id === categoryId
      );
    } else {
      this.filteredProducts = this.products; // Si no hay categoría seleccionada, muestra todos
    }
  }

  // Filtra productos por búsqueda
  filterProducts() {
    if (this.search) {
      this.filteredProducts = this.products.filter((product) =>
        product.title.toLowerCase().includes(this.search.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products; // Si no hay búsqueda, muestra todos
    }
  }

  // Escucha cambios en el buscador
  onSearchChange() {
    this.searchSubject.next(this.search);
  }

  goToProduct(productId: number) {
    const slug = this.route.snapshot.paramMap.get('slug'); // Obtén el slug de la URL actual
    this.router.navigate(['/tienda', slug, 'producto', productId]);
  }
  goToHome() {
    const slug = this.route.snapshot.paramMap.get('slug'); // Obtén el slug de la URL actual
    this.router.navigate(['/tienda', slug]); // Navega a la página de inicio de la tienda
  }

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda',slug,'carrito']);
  }
  getProductUrl(product: any): string {
    return `${window.location.origin}/tienda/${this.slug}/producto/${product.id}`;
  }
}
