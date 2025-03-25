import { ChangeDetectorRef, Component, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  plans: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      store_name: ['', Validators.required],
      plan_id: [1, Validators.required]

    });
  }
  async ngOnInit() {
    this.getPlans();
    await this.initMercadoPago();
  }

  async initMercadoPago() {
    if ((window as any).hasMercadoPago || (window as any).MercadoPago) {
      return;
    }

    try {
      const mercadoPagoModule = await import('@mercadopago/sdk-js');
      mercadoPagoModule.default.loadMercadoPago();
      (window as any).hasMercadoPago = true;
    } catch (error) {
      this.toastr.error('Error al cargar Mercado Pago.');
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.toastr.error("Validación", "Necesitas ingresar todos los campos");
      return;
    }

    const data = this.registerForm.value;
    this.authService.register(data).subscribe(
      (resp: any) => {

        this.toastr.success("Éxito", "Ingresa a tu correo para completar tu registro");
        setTimeout(() => {
          this.router.navigateByUrl("/login");
        }, 500);
      },
      (error) => {

        this.toastr.error("Error", "Hubo un problema al registrar el usuario");
      }
    );
  }

  getPlans() {
      this.authService.getPlans().subscribe({
      next: (response: any) => {
          if (response && response.length) {
          this.plans = response;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('No se pudieron obtener los planes.');
        }
      },
      error: (err: any) => {
        this.toastr.error('Hubo un error al obtener los planes.');
      },
    });
  }
}
