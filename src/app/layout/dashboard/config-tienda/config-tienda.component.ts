import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../core/login-service.service';
import { ProfileUserService } from '../../../core/profile-user/profile.service';

@Component({
  selector: 'app-config-tienda',
  imports: [CommonModule, RouterModule],
  templateUrl: './config-tienda.component.html',
  styleUrl: './config-tienda.component.scss'
})
export class ConfigTiendaComponent {

  name:string = "";

  isSubMenuOpen: { [key: string]: boolean } = {};

  toggleSubMenu(subMenu: string) {
    this.isSubMenuOpen[subMenu] = !this.isSubMenuOpen[subMenu];
  }

   constructor(public profileClient: ProfileUserService,  ){
        this.profileClient.showUsers().subscribe((resp:any) =>{
          this.name = resp.name
        })
      }
}
