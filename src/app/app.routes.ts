import { Routes } from '@angular/router';
import { TiendaPublicaComponent } from './tienda-publica-general/tienda-publica/tienda-publica.component';
import { TiendaPublicaDetailProductComponent } from './tienda-publica-general/tienda-publica-detail-product/tienda-publica-detail-product.component';
import { TiendaPublicaCarritoComponent } from './tienda-publica-general/tienda-publica-carrito/tienda-publica-carrito.component';
import { AboutUsComponent } from './tienda-publica-general/about-us/about-us.component';
import { ContactPageComponent } from './tienda-publica-general/contact-page/contact-page.component';


export const routes: Routes = [
  {
    path:'ingresar',
    loadComponent:() => import('./core/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path:'registro',
    loadComponent:() => import('./core/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path:'',
    redirectTo:'ingresar',
    pathMatch:'full'
  },
  {
    path:'dashboard',
    loadChildren:() => import('./layout/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'tienda/:slug',
    component: TiendaPublicaComponent,


  },
  {
    path: 'tienda/:slug/producto/:id',
    component: TiendaPublicaDetailProductComponent
  },
  {
    path: 'tienda/:slug/carrito',
    component: TiendaPublicaCarritoComponent
  },
  {
    path: 'tienda/:slug/nosotros',
    component: AboutUsComponent
  },
  {
    path: 'tienda/:slug/contacto',
    component: ContactPageComponent
  },

];
