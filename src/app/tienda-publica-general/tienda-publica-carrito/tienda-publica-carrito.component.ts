import { Component } from '@angular/core';
import { CartService } from '../../layout/dashboard/plantilla-ecommerce/cart.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import * as utf8 from 'utf8';



@Component({
  selector: 'app-tienda-publica-carrito',
  imports: [FormsModule, FooterComponent, HeaderComponent, CommonModule, ],
  templateUrl: './tienda-publica-carrito.component.html',
  styleUrl: './tienda-publica-carrito.component.scss'
})
export class TiendaPublicaCarritoComponent {
  cartItems: any[] = [];
  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  metodoPago: string = '';
  ciudad: string = '';
  comentario: string = '';
  usuario: any = {};

  constructor(private cartService: CartService, private router: Router,
    private route: ActivatedRoute,
    private tienda: Tiendaservice, private toast: ToastrService) {
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
      }
    );
  }
  finalizarCompra() {
    if (!this.nombre || !this.direccion || !this.telefono || !this.metodoPago || !this.ciudad) {
      this.toast.error('Por favor, completa todos los campos requeridos antes de finalizar la compra.');
      return;
    }

    const purchaseData = {
      user_id: this.usuario.id,
      items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      total_price: this.getTotal(),
      nombre: this.nombre,
      direccion: this.direccion,
      ciudad: this.ciudad,
      telefono: this.telefono,
      metodo_pago: this.metodoPago,
      comentario: this.comentario
    };


  this.cartService.savePurchase(purchaseData).subscribe(
      (response: any) => {
          this.toast.success('Compra registrada con éxito');
          this.clearCart();
      },
      (error: any) => {
          this.toast.error('Error al registrar la compra');
      }
  );


      let mensaje = `🛒 *Detalles del Pedido* 🛒\n\n`;
      mensaje += `👤 *Nombre:* ${this.nombre}\n`;
      mensaje += `🏠 *Dirección de entrega:* ${this.direccion}\n`;
      mensaje += `🌆 *Ciudad:* ${this.ciudad}\n`;
      mensaje += `📱 *Teléfono:* ${this.telefono}\n`;
      mensaje += `💸 *Método de pago:* ${this.metodoPago}\n\n`;
      mensaje += `📦 *Productos:*\n`;

      this.cartItems.forEach((item) => {
        mensaje += `➡️ ${item.product.title} (${item.quantity} x ${item.product.price_cop} COP)\n`;
      });

      mensaje += `\n💰 *Total:* ${this.getTotal()} COP\n\n`;
      mensaje += `📝 *Comentarios adicionales:*\n${this.comentario || "Ninguno"}\n\n`;
      mensaje += `¡Gracias por tu compra! 🎉`;

    // Codificación especial para WhatsApp
    const encodedMessage = this.encodeWhatsAppText(mensaje);

    const url = `https://wa.me/${this.usuario.phone}?text=${encodedMessage}`;
    window.open(url, '_blank');
    this.clearCart();
  }

  private encodeWhatsAppText(text: string): string {
    return encodeURIComponent(text)
      .replace(/\*/g, '%2A')  // Codificar asteriscos para mantener las negritas
      .replace(/!/g, '%21')   // Codificar signos de exclamación
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
  }

  navigateCart() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug, 'carrito']);
  }

  goToHome() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.router.navigate(['/tienda', slug]);
  }
}
