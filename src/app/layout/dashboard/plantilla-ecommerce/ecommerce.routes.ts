import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NosotrosComponent } from "./nosotros/nosotros.component";
import { ContactoComponent } from "./contacto/contacto.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { CarritoComponent } from "./carrito/carrito.component";
import { EcommerceComponent } from "./ecommerce.component";



const ecommerceRoutes: Routes = [
  {
    path: 'ecommerce',
    component: EcommerceComponent,
    children:[
      {
        path: '',
        component: HomeComponent
      },
      {
        path:'nosotros',
        component: NosotrosComponent
      },
      {
        path:'producto/:id',
        component: ProductDetailComponent
      },
      {
        path:'contacto',
        component: ContactoComponent
      },
      {
        path:'carrito',
        component: CarritoComponent
      },

    ]
  },
  {
    path: '',
    redirectTo: 'ecommerce',
    pathMatch: 'full'
  }

]
export {ecommerceRoutes};
