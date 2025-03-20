import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Tiendaservice } from '../tienda-publica/tienda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pop-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent {
  popup: string = "";
  showAvatarPopup: boolean = false;
  slug: string | null = null;
  usuario: any = {};


  closeAvatarPopup() {
    this.showAvatarPopup = false;
  }
  constructor(
    private publicService: Tiendaservice,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.obtenerDatosUsuario(slug);
      }
    });


  }

// En tu método obtenerDatosUsuario
obtenerDatosUsuario(slug: string) {
  this.publicService.getDataUsuario(slug).subscribe({
    next: (data: any) => {
      this.usuario = data;
    },

  });
}

}
