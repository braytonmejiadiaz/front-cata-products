import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileUserService } from './profile.service';
import { LoginService } from '../login-service.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-profile-user',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent {

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

  onLogout(){
    this.authService.logout()
  }


}
