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

  phone: string = "";
  productId: string | null = null;
  product: any = null;
  isLoading: boolean = true;
  quantity: number = 1;
  usuario: any = {};
  showImagePopup: boolean = false;
  selectedImage: string | null = null;
  selectedVariation: any = null; // Nueva propiedad para la variación seleccionada

  constructor(
    private route: ActivatedRoute,
    private tiendaService: Tiendaservice,
    private toastr: ToastrService,
    private cartService: CartService,
    private routing: Router,
  ) {}

  selectImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  openImagePopup() {
    this.showImagePopup = true;
  }

  closeImagePopup() {
    this.showImagePopup = false;
  }

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
        console.log('Respuesta del backend:', response); // Verifica la respuesta
        this.product = response.product;
        this.product.tags = JSON.parse(this.product.tags);
        this.isLoading = false;

        // Verifica si el producto tiene imágenes adicionales
        if (!this.product.images) {
          this.product.images = []; // Inicializa como un array vacío si no hay imágenes
        }

        // Agrega la imagen principal como la primera miniatura
        this.product.images.unshift({
          id: 0, // Usamos un ID ficticio para la imagen principal
          imagen: this.product.imagen,
        });

        // Si el producto tiene variaciones, selecciona la primera por defecto
        if (this.product.variations && this.product.variations.length > 0) {
          this.selectedVariation = this.product.variations[0];
        }
      },
      error: (error: any) => {
        console.error('Error al cargar el producto:', error);
        this.isLoading = false;
        this.toastr.error('Error al cargar el producto', error.error.message || 'Error desconocido');
      },
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

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.routing.navigate(['/tienda', slug, 'carrito']);
  }


  goToHome() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.routing.navigate(['/tienda', slug]);
  }



  // Añadir al carrito
addToCart(product: any, quantity: number) {
  const slug = this.route.snapshot.paramMap.get('slug');

  // Si el producto tiene variaciones, asegúrate de que se haya seleccionado una
  if (product.variations && product.variations.length > 0 && !this.selectedVariation) {
    this.toastr.error('Por favor, selecciona una variación antes de añadir al carrito.');
    return;
  }

  // Calcular el precio total (usar solo el precio de la variación si existe)
  const price = this.selectedVariation
    ? this.selectedVariation.add_price // Usar solo el precio de la variación
    : product.price_cop; // Usar el precio base si no hay variación

  // Crear el objeto del producto para el carrito
  const productToAdd = {
    ...product,
    price_cop: price, // Precio total
    selectedVariation: this.selectedVariation, // Incluir la variación seleccionada
  };

  // Añadir el producto al carrito
  this.cartService.addToCart(productToAdd, quantity);
  this.toastr.success('Producto añadido al carrito', '¡Éxito!');
  this.routing.navigate(['/tienda', slug, 'carrito']);
}

// Comprar por WhatsApp
buyOnWhatsApp(product: any, quantity: number) {
  if (!this.usuario.phone) {
    this.toastr.error('No se encontró el número de teléfono del usuario.');
    return;
  }

  // Calcular el precio total (usar solo el precio de la variación si existe)
  const price = this.selectedVariation
    ? this.selectedVariation.add_price // Usar solo el precio de la variación
    : product.price_cop; // Usar el precio base si no hay variación

  // Formatear el precio manualmente
  const formattedPrice = price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  // Crear el mensaje con el nombre de la variación si existe
  const variationText = this.selectedVariation
    ? ` (Variación: ${this.selectedVariation.propertie.name})`
    : '';

  const message = `Hola, quiero comprar ${quantity} unidad(es) de ${product.title}${variationText} (${formattedPrice}).`;
  const url = `https://wa.me/${this.usuario.phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
}
