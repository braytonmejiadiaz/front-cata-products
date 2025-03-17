import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-product',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent implements OnInit {
  products: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;
  isLoading$: any;
  marcas: any = [];
  marca_id: string = '';
  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];

  constructor(
    public productService: ProductService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.listProducts();
    this.isLoading$ = this.productService.isLoading$;
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    });
  }

  listProducts(page = 1) {
    let data = {
      search: this.search,
      brand_id: this.marca_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
    };
    this.productService.listProducts(page, data).subscribe(
      (resp: any) => {
        this.products = resp.products.data;
        this.totalPages = resp.total;
        this.currentPage = page;
      },
      (err: any) => {
        this.toast.error("API RESPONSE - COMUNIQUESE CON EL DESARROLLADOR", err.error.message);
      }
    );
  }

  changeDepartamento() {
    this.categories_seconds_backups = this.categories_seconds.filter((item: any) =>
      item.categorie_second_id == this.categorie_first_id
    );
  }

  changeCategorie() {
    this.categories_thirds_backups = this.categories_thirds.filter((item: any) =>
      item.categorie_second_id == this.categorie_second_id
    );
  }

  searchTo() {
    this.listProducts();
  }

  loadPage($event: any) {
    this.listProducts($event);
  }

  deleteProduct(product: any) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(product.id).subscribe(
        (resp: any) => {
          const INDEX = this.products.findIndex((item: any) => item.id === product.id);
          if (INDEX !== -1) {
            this.products.splice(INDEX, 1);
          }
          this.toast.success("Producto eliminado con éxito");
        },
        (err: any) => {
          this.toast.error("Error al eliminar el producto", err);
        }
      );
    }
  }
}
