import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>(this.getStoredCartItems());
  constructor(private http: HttpClient,   public router: Router) {}

  // Obtener los elementos del carrito
  getCartItems() {
    return this.cartItems.getValue();
  }

  // Añadir un producto al carrito
  addToCart(product: any, quantity: number) {
    const currentCart = this.getCartItems();

    // Buscar si el producto ya está en el carrito
    const existingItem = currentCart.find((item) => {
      // Si el producto tiene variaciones, comparar también la variación
      if (product.selectedVariation) {
        return (
          item.product.id === product.id &&
          item.selectedVariation &&
          item.selectedVariation.id === product.selectedVariation.id
        );
      } else {
        // Si no tiene variaciones, solo comparar el ID del producto
        return item.product.id === product.id && !item.selectedVariation;
      }
    });

    if (existingItem) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no, añadir el producto al carrito
      currentCart.push({ product, quantity, selectedVariation: product.selectedVariation });
    }

    this.cartItems.next(currentCart);
    this.storeCartItems(currentCart); // Guardar en sessionStorage
  }

  // Eliminar un producto del carrito
  removeFromCart(index: number) {
    const currentCart = this.getCartItems();
    currentCart.splice(index, 1);
    this.cartItems.next(currentCart);
    this.storeCartItems(currentCart); // Actualizar sessionStorage
  }

  // Vaciar el carrito
  clearCart() {
    this.cartItems.next([]);
    this.storeCartItems([]); // Limpiar sessionStorage
  }

  // Guardar los elementos del carrito en sessionStorage
  private storeCartItems(cartItems: any[]) {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  // Obtener los elementos del carrito desde sessionStorage
  private getStoredCartItems(): any[] {
    const storedItems = sessionStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  }

  savePurchase(purchaseData: any) {
    let URL = URL_SERVICIOS + "/purchases";
    return this.http.post( URL, purchaseData);
  }

  getPurchases() {
    let URL = URL_SERVICIOS + "/api/purchases";
    return this.http.get(URL, {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
}
}
