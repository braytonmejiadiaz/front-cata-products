import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../tienda/service/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, FormsModule ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit{

  productId: string | null = null;
  product: any = null;
  isLoading: boolean = true;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
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
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.productService.showProduct(productId).subscribe({
      next: (response: any) => {
        this.product = response.product;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.toastr.error('Error al cargar el producto', error.message);
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
    this.cartService.addToCart(product, quantity); // Añade el producto al carrito
    this.toastr.success('Producto añadido al carrito', '¡Éxito!');
    this.routing.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
  }

  navigateCart(){
    this.routing.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
  }
  // Comprar por WhatsApp
  buyOnWhatsApp(product: any, quantity: number) {
    const message = `Hola, quiero comprar ${quantity} unidad(es) de ${product.title} (${product.price_usd} USD).`;
    const url = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
