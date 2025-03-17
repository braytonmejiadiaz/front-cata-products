import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { CreateProductComponent } from "./tienda/create-product/create-product.component";
import { EditProductComponent } from "./tienda/edit-product/edit-product.component";
import { CreateVariationSpecificationsComponent } from "./tienda/attributes-anidado/create-variation-specifications/create-variation-specifications.component";
import path from "path";


const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path:'crear-producto',
        component:CreateProductComponent,
      },
      {
        path:'lista-productos',
        loadComponent: () => import('./tienda/list-product/list-product.component').then((m) => m.ListProductComponent),

      },
      {
        path:'producto/edit/:id',
        component:EditProductComponent
      },
      {
        path:'producto/variations-specifications/:id',
        component: CreateVariationSpecificationsComponent,
      },

      {
        path:'importar-productos',
        loadComponent: () => import('./tienda/import-product/import-product.component').then((m) => m.ImportProductComponent),

      },
      {
        path: 'categories',
        loadChildren: () => import('./tienda/categories/categories.routes').then((m) => m.categoriesRoutes),
      },
      {
        path: 'attributes',
        loadChildren: () => import('./tienda/attributes/attributes-routing.module').then((m) => m.Attributesroutes),
      },
      {
        path: 'brands',
        loadChildren: () => import('./tienda/brands/brands-routing.module').then((m) => m.brandroutes),
      },
      {
        path: 'mi-tienda',
        loadChildren: () => import('./plantilla-ecommerce/ecommerce.routes').then((m) => m.ecommerceRoutes),
      },
      {
        path: 'slider',
        loadChildren: () => import('./tienda/sliders/sliders-routing.module').then((m) => m.Slidersroutes),
      },
      {
        path: 'mi-perfil',
        loadComponent: () => import('../../core/profile-user/profile-user.component').then((m) => m.ProfileUserComponent),
      },
      {
        path: 'preferencias',
        loadChildren: () => import('./config-tienda/configTienda.routes').then((m) => m.configTiendaRoutes),
      }

    ]
  }

]
export {dashboardRoutes};
