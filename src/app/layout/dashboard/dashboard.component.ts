import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../core/login-service.service';
import { ProfileUserService } from '../../core/profile-user/profile.service';



@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,  RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isSubMenuOpen: { [key: string]: boolean } = {
    productos: false,
    categorias: false,
    atributos: false,
    marcas: false,
    sliders: false,
    preferencias: false
  };
  isSidebarOpen: boolean = false;


  // Alternar la visibilidad del sidebar en móviles
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Alternar la visibilidad de los submenús
  toggleSubMenu(menu: string) {
    this.isSubMenuOpen[menu] = !this.isSubMenuOpen[menu];
  }

  // Cerrar todos los submenús
  closeAllSubMenus() {
    for (const key in this.isSubMenuOpen) {
      this.isSubMenuOpen[key] = false;
    }
  }

  // Método para manejar clics en enlaces
  onLinkClick() {
    this.closeAllSubMenus();
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }


  avatar: string = "";
  name:string = "";


  constructor(public profileClient: ProfileUserService, private toast: ToastrService ,
      private authService: LoginService , private qrCodeService: ProfileUserService  ){
      this.profileClient.showUsers().subscribe((resp:any) =>{
        this.name = resp.name
        this.avatar = resp.avatar


      })
    }

}
