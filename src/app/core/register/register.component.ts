import { ChangeDetectorRef, Component, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login-service.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      store_name: ['', Validators.required],

    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.toastr.error("Validación", "Necesitas ingresar todos los campos");
      return;
    }

    const data = this.registerForm.value;
    this.authService.register(data).subscribe(
      (resp: any) => {
        console.log(resp);
        this.toastr.success("Éxito", "Ingresa a tu correo para completar tu registro");
        setTimeout(() => {
          this.router.navigateByUrl("/login");
        }, 500);
      },
      (error) => {
        console.error(error);
        this.toastr.error("Error", "Hubo un problema al registrar el usuario");
      }
    );
  }
}
