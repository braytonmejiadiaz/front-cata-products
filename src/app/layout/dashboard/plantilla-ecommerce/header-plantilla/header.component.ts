import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileUserService } from '../../../../core/profile-user/profile.service';

@Component({
  selector: 'app-header-plantilla',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderPlantillaComponent {
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

  constructor(
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private profile: ProfileUserService
  ) {}


  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnInit(): void {
    this.getUserInfo();
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

  goToProduct(productId: number) {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug, 'producto', productId]);
  }
  goToHome() {
      this.router.navigate(['/dashboard/mi-tienda/ecommerce']);
  }
  goToAboutUs(){
    this.router.navigate(['/dashboard/mi-tienda/nosotros']);
  }

  navigateCart(){
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
  }

}
