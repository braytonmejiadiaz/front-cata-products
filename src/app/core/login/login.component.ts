import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService,  } from '../login-service.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private toastr: ToastrService,
      private authService: LoginService,
      public router: Router,
      public activedRoute: ActivatedRoute,
  ) {
      this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
      });
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error("Validación", "Necesitas ingresar todos los campos");
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe(
      (resp: any) => {
        if (resp === true) {
          this.toastr.success("Éxito", 'Bienvenido a la tienda');
          setTimeout(() => {
            this.router.navigateByUrl("/dashboard/estadisticas");
          }, 500);
        } else {
          this.toastr.error("Error", 'Credenciales incorrectas');
        }
      },
      (error) => {
        console.error(error);
        this.toastr.error("Error", 'Hubo un problema al iniciar sesión');
      }
    );
  }

}
