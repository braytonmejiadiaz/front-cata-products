import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,  } from '@angular/router';
import { HeaderPlantillaComponent } from "../header-plantilla/header.component";
import { FooterPlantillaComponent } from "../footer-plantilla/footer.component";

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule, HeaderPlantillaComponent, FooterPlantillaComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {
  cartItems: any[] = [];
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  metodoPago: string = '';
  comentario: string = '';

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems = this.cartService.getCartItems(); // Obtiene los productos del carrito
  }

  // Calcular el total del carrito
  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.product.price_usd * item.quantity, 0);
  }

  // Eliminar un producto del carrito
  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  // Limpiar el carrito
  clearCart() {
    this.cartService.clearCart();
    this.cartItems = []; // Actualiza la lista local
  }

  // Finalizar compra y enviar información por WhatsApp
  finalizarCompra() {
    // Crear el mensaje con los detalles del pedido
    let mensaje = `Hola, quiero finalizar mi compra con los siguientes detalles:\n\n`;
    mensaje += `*Nombre:* ${this.nombre}\n`;
    mensaje += `*Dirección de entrega:* ${this.direccion}\n`;
    mensaje += `*Teléfono:* ${this.telefono}\n`;
    mensaje += `*Método de pago:* ${this.metodoPago}\n\n`;
    mensaje += `*Productos:*\n`;

    this.cartItems.forEach((item) => {
      mensaje += `- ${item.product.title} (${item.quantity} x ${item.product.price_usd} USD)\n`;
    });

    mensaje += `\n*Total:* ${this.getTotal()} USD\n\n`;
    mensaje += `*Comentarios adicionales:*\n${this.comentario || "Ninguno"}`;

    // Codificar el mensaje para la URL de WhatsApp
    const url = `https://wa.me/1234567890?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(url, '_blank');

    // Limpiar el carrito después de finalizar la compra
    this.clearCart();
  }
  navigateCart(){
    this.router.navigate(['/dashboard/mi-tienda/ecommerce/carrito']);
  }
}
