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
  showAvatarPopup: boolean = true;
  slug: string | null = null;
  usuario: any = {};
  phone:string = "";
  products: any[] = [];
  filteredProducts: any[] = [];
  search: string = '';
  searchSubject = new Subject<string>();
  marcas: any[] = [];
  marca_id: string = '';
  categorie_first_id: string | null = null;
  categories_first: any[] = [];
  selectedCategory: string | null = null;
  sliders: any[] = []

  closeAvatarPopup() {
    this.showAvatarPopup = false;
  }
  constructor(
    private publicService: Tiendaservice,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.obtenerDatosUsuario(slug);
      }
    });

    setTimeout(() => {
      this.checkPopupCache();
    }, 300); // Pequeño retraso para evitar parpadeos
  }

  checkPopupCache() {
    const lastShown = localStorage.getItem('popupTimestamp');
    const now = new Date().getTime();

    if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      this.showAvatarPopup = true;
      localStorage.setItem('popupTimestamp', now.toString());
    }
  }



  obtenerDatosUsuario(slug: string) {
    this.publicService.getDataUsuario(slug).subscribe(
      (data: any) => {
        this.usuario = data;
      },
      (error: any) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
}
