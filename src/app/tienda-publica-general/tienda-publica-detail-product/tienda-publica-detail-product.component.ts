import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../layout/dashboard/plantilla-ecommerce/cart.service';
import { FormsModule } from '@angular/forms';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tienda-publica-detail-product',
  imports: [FormsModule, FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './tienda-publica-detail-product.component.html',
  styleUrl: './tienda-publica-detail-product.component.scss'
})
export class TiendaPublicaDetailProductComponent {

  phone:string = "";
  productId: string | null = null;
  product: any = null;
  isLoading: boolean = true;
  quantity: number = 1;
  usuario: any = {};

  constructor(
    private route: ActivatedRoute,
    private tiendaService: Tiendaservice,
    private toastr: ToastrService,
    private cartService: CartService,
    private routing: Router,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductDetails(this.productId);
    } else {
      this.toastr.error('ID de producto no válido');
    }
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
  }

  obtenerDatosUsuario(slug: string) {
    this.tiendaService.getDataUsuario(slug).subscribe(
      (data: any) => {
        this.usuario = data;
      },
      (error: any) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.tiendaService.getProductById(productId).subscribe({
      next: (response: any) => {
        this.product = response.product;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.toastr.error('Error al cargar el producto', error.error.message || 'Error desconocido');
      }
    });
  }

  // Incrementar la cantidad
  increaseQuantity() {
    this.quantity++;
  }

  // Decrementar la cantidad
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Añadir al carrito
  addToCart(product: any, quantity: number) {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.cartService.addToCart(product, quantity);
    this.toastr.success('Producto añadido al carrito', '¡Éxito!');
    this.routing.navigate(['/tienda',slug,'carrito']);
  }

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.routing.navigate(['/tienda',slug,'carrito']);
  }

  // Comprar por WhatsApp
  buyOnWhatsApp(product: any, quantity: number) {
    if (!this.usuario.phone) {
      this.toastr.error('No se encontró el número de teléfono del usuario.');
      return;
    }

    const message = `Hola, quiero comprar ${quantity} unidad(es) de ${product.title} (${product.price_cop} COP).`;
    const url = `https://wa.me/${this.usuario.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  goToHome() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.routing.navigate(['/tienda', slug]);
  }

}
