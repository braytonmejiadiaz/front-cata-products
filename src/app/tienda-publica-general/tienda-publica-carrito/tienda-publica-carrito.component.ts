import { Component, } from '@angular/core';
import { CartService } from '../../layout/dashboard/plantilla-ecommerce/cart.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tienda-publica-carrito',
  imports: [FormsModule, FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './tienda-publica-carrito.component.html',
  styleUrl: './tienda-publica-carrito.component.scss'
})
export class TiendaPublicaCarritoComponent {
  cartItems: any[] = [];
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  metodoPago: string = '';
  ciudad:string = '';
  comentario: string = '';
  usuario: any = {};

  constructor(private cartService: CartService, private router: Router,
    private route: ActivatedRoute ,
    private tienda:Tiendaservice, private toast: ToastrService) {
    this.cartItems = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.obtenerDatosUsuario(slug);
    });
  }

  // Calcular el total del carrito
  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.product.price_cop * item.quantity, 0);
  }

  // Eliminar un producto del carrito
  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  // Limpiar el carrito
  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
  }
  obtenerDatosUsuario(slug: string) {
    this.tienda.getDataUsuario(slug).subscribe(
      (data: any) => {
        this.usuario = data;
      },
      (error: any) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  finalizarCompra() {
    if (!this.nombre || !this.direccion || !this.telefono || !this.metodoPago || !this.ciudad) {
      this.toast.error('Por favor, completa todos los campos requeridos antes de finalizar la compra.');
      return;
    }

    // Crear el mensaje con los detalles del pedido
    let mensaje = `🛒 *Detalles del Pedido* 🛒\n\n`;
    mensaje += `👤 *Nombre:* ${this.nombre}\n`;
    mensaje += `🏠 *Dirección de entrega:* ${this.direccion}\n`;
    mensaje += `🏠 *Ciudad:* ${this.ciudad}\n`;
    mensaje += `📞 *Teléfono:* ${this.telefono}\n`;
    mensaje += `💳 *Método de pago:* ${this.metodoPago}\n\n`;
    mensaje += `📦 *Productos:*\n`;

    this.cartItems.forEach((item) => {
      mensaje += `➡️ ${item.product.title} (${item.quantity} x ${item.product.price_cop} COP)\n`;
    });

    mensaje += `\n💰 *Total:* ${this.getTotal()} COP\n\n`;
    mensaje += `📝 *Comentarios adicionales:*\n${this.comentario || "Ninguno"}\n\n`;
    mensaje += `¡Gracias por tu compra! 🎉`;

    // Codificar el mensaje para la URL de WhatsApp
    const encodedMessage = encodeURIComponent(mensaje);

    // Abrir WhatsApp en una nueva pestaña
    const url = `https://wa.me/${this.usuario.phone}?text=${encodedMessage}`;

    window.open(url, '_blank');

    // Limpiar el carrito después de finalizar la compra
    this.clearCart();
  }

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda',slug,'carrito']);
  }

  goToHome() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug]);
  }
}
