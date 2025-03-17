import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../../core/login-service.service';
import { ProfileUserService } from '../../../../core/profile-user/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent {

    qrData: string = '';
    name:string = "";
    surname:string = "";
    email:string = "";
    phone:string = "";
    store_name:string = "";
    address:string = "";
    avatar: string = "";
    fb: string = "";
    ins: string = "";
    tikTok: string = "";
    youtube: string = "";
    slug: string = "";
    popup: string = "";
    storeUrl: string = "";
    description: string = "";
    menu_color :string = "";
    button_color :string = "";

    constructor(public profileClient: ProfileUserService, private toast: ToastrService ,
      private authService: LoginService , private qrCodeService: ProfileUserService  ){
      this.profileClient.showUsers().subscribe((resp:any) =>{
        this.name = resp.name
        this.surname = resp.surname
        this.email = resp.email
        this.phone = resp.phone
        this.store_name = resp.store_name
        this.address = resp.address
        this.avatar = resp.avatar
        this.fb = resp.fb
        this.ins = resp.ins
        this.tikTok = resp.tikTok
        this.youtube = resp.youtube
        this.slug = resp.slug
        this.popup = resp.popup
        this.popup_preview = resp.popup;
        this.description = resp.description;
        this.menu_color = resp.menu_color;
        this.button_color = resp.button_color;
        this.storeUrl = `http://localhost:4200/tienda/${this.slug}`;
      })
    }

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.updateUser();
    }
    updateUser(){
      if(!this.name || !this.email){

        return;
      }
      let data = {
        name: this.name,
        surname: this.surname,
        email: this.email,
        phone: this.phone,
        store_name: this.store_name,
        address: this.address,
        avatar: this.avatar,
        fb: this.fb,
        ins: this.ins,
        tikTok: this.tikTok,
        youtube: this.youtube,
        popup: this.popup,
        description: this.description,
        menu_color: this.menu_color,
        button_color: this.button_color

      }

      this.profileClient.updateProfile(data).subscribe((resp:any) =>{
        if(resp.message ==403){
          this.toast.error("El correo ya esta en uso")
        }else{
          this.toast.success("Tu perfil se edito con éxito")
        }
        })
    }

    popup_preview: any = "https://tucartaya.com/wp-content/uploads/2024/12/upload-media.png";

    imagen_previsualiza:any = "https://tucartaya.com/wp-content/uploads/2024/12/upload-media.png";

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
        this.avatar = reader.result as string;
      };
    }

    processPopupFile($event: any) {
      if ($event.target.files[0].type.indexOf("image") < 0) {
        this.toast.error("Validacion", "El archivo no es una imagen");
        return;
      }

      let file = $event.target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.popup_preview = reader.result;
        this.popup = reader.result as string;
      };
    }

    deletePopupImage() {
      this.popup_preview = "https://tucartaya.com/wp-content/uploads/2024/12/upload-media.png"; // Imagen predeterminada
      this.popup = ""; // Eliminar imagen del modelo

      // Llamada al backend para eliminar la imagen de la base de datos
      this.profileClient.deletePopupImage().subscribe((resp: any) => {
        if (resp.success) {
          this.toast.success("Imagen del popup eliminada con éxito");
        }
      });
    }

}
