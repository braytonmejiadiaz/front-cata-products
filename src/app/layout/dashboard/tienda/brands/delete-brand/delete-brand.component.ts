import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss']
})
export class DeleteBrandComponent {
  isModalOpen = true; // Controla la visibilidad del modal

  @Input() brand:any;

  @Output() BrandD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public brandService: BrandService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.isLoading = this.brandService.isLoading$;
  }
  delete(){
    this.brandService.deleteBrands(this.brand.id).subscribe((resp:any) => {
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.BrandD.emit({message: 200});
        this.modal.close();
      }
    })
  }
  closeModal() {
    this.isModalOpen = false;
  }
}
