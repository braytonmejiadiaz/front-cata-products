import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../plantilla-ecommerce/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent {
  purchases: any[] = [];
  loading: boolean = true;

  constructor(private tienda: CartService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    this.tienda.getPurchases().subscribe({
      next: (data: any) => {
        this.purchases = data.data || data; // Ajusta según la estructura de tu API
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al obtener las compras:', error);
        this.toast.error('Error al obtener las compras');
        this.loading = false;
      }
    });
  }
}
