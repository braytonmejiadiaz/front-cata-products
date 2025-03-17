import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-delete-product',
  imports: [],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.scss'
})
export class DeleteProductComponent {
  @Input() product:any;

  @Output() ProductD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {

    this.isLoading = this.productService.isLoading$;
  }
  delete(){
    this.productService.deleteProduct(this.product.id).subscribe((resp:any) => {
      this.ProductD.emit({message: 200});
    })
  }
}
