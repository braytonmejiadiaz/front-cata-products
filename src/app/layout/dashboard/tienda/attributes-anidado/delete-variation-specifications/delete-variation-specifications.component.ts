import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributosService } from '../../service/attributos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-variation-specifications',
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-variation-specifications.component.html',
  styleUrls: ['./delete-variation-specifications.component.scss']
})
export class DeleteVariationSpecificationsComponent {

  @Input() specification:any;
  @Input() is_variation:any;

  @Output() EspecificationD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public attributeService: AttributosService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.attributeService.isLoading$;
  }
  delete(){
    if(!this.is_variation){
      this.deleteSpecification();
    }else{
      this.deletevVariation();
    }
  }

  deleteSpecification(){
    this.attributeService.deleteSpecification(this.specification.id).subscribe((resp:any) => {
      this.EspecificationD.emit({message: 200});
      this.modal.close();
    })
  }

  deletevVariation(){
    this.attributeService.deleteVariations(this.specification.id).subscribe((resp:any) => {
      this.EspecificationD.emit({message: 200});
      this.modal.close();
    })
  }

}
