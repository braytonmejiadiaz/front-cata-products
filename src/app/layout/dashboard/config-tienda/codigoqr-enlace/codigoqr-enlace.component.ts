import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../core/login-service.service';
import { ProfileUserService } from '../../../../core/profile-user/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-codigoqr-enlace',
  imports: [CommonModule, FormsModule, QRCodeModule],
  templateUrl: './codigoqr-enlace.component.html',
  styleUrl: './codigoqr-enlace.component.scss'
})
export class CodigoqrEnlaceComponent {


  qrData: string = '';
  store_name: string = "";
  slug: string = "";
  storeUrl: string = "";

  constructor(public profileClient: ProfileUserService, private toast: ToastrService,
    private authService: LoginService, private qrCodeService: ProfileUserService) {
    this.profileClient.showUsers().subscribe((resp: any) => {
      this.store_name = resp.store_name;
      this.slug = resp.slug;
      this.popup_preview = resp.popup;
      this.storeUrl = `http://localhost:4200/tienda/${this.slug}`;
      this.qrData = this.storeUrl;
    });
  }

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }

  copyUrl() {
    const input = document.createElement('input');
    input.value = this.storeUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    this.toast.success("URL copiada al portapapeles: " + this.storeUrl)
  }

  popup_preview: any = "https://tucartaya.com/wp-content/uploads/2024/12/upload-media.png";

  imagen_previsualiza: any = "https://tucartaya.com/wp-content/uploads/2024/12/upload-media.png";

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toast.error("Validacion", "El archivo no es una imagen");
      return;
    }

    let file = $event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imagen_previsualiza = reader.result;
    };
  }

  downloadQRCode() {
    const canvas = document.querySelector('canvas'); // Selecciona el canvas generado por el QR
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      link.click();
    }
  }

}
