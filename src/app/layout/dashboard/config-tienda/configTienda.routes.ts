import { Routes } from "@angular/router";
import { ConfigTiendaComponent } from "./config-tienda.component";
import { CodigoqrEnlaceComponent } from "./codigoqr-enlace/codigoqr-enlace.component";
import { InfoGeneralComponent } from "./info-general/info-general.component";
import { PopUpComponent } from "./pop-up/pop-up.component";



const configTiendaRoutes: Routes = [
  {
    path: '',
    component: ConfigTiendaComponent,
    children:[
      {
        path:'url-qr',
        component: CodigoqrEnlaceComponent
      },
      {
        path:'informacion-general',
        component: InfoGeneralComponent
      },
      {
        path:'ajustes-generales',
        component: PopUpComponent
      }
    ]
  }
]
export {configTiendaRoutes};
