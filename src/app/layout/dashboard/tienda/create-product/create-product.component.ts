import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'; // Importa CKEditorModule

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule, CKEditorModule ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {

  title:string = '';
  sku:string = '';
  price_cop:number = 0;
  description:any = '';
  imagen_previsualiza:any = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
  file_imagen:any = null;
  marca_id:string = '';
  marcas:any = []
  isLoading$:any;
  categorie_first_id:string = '';
  categorie_second_id:string = '';
  categorie_third_id:string = '';
  categories_first:any = [];
  categories_seconds:any = [];
  categories_seconds_backups:any = [];
  categories_thirds:any = [];
  categories_thirds_backups:any = [];
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};
  word:string = '';
  isShowMultiselect:Boolean = false;
  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
    this.configAll();
  }

  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      this.marcas = resp.brands;
      this.categories_first = resp.categories_first;
      this.categories_seconds = resp.categories_seconds;
      this.categories_thirds = resp.categories_thirds;
    })
  }

  addItems(){
    this.isShowMultiselect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      this.word = '';
      this.isShowMultiselect = false;
      this.isLoadingView();
    }, 100);
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toastr.error("Validacion","El archivo no es una imagen");
      return;
    }
    this.file_imagen = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_imagen);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingView();
  }

  isLoadingView(){
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  changeDepartamento(){
    this.categories_seconds_backups = this.categories_seconds.filter((item:any) =>
    item.categorie_second_id == this.categorie_first_id
    )
  }
  changeCategorie(){
    this.categories_thirds_backups = this.categories_thirds.filter((item:any) =>
    item.categorie_second_id == this.categorie_second_id
    )
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  save(){
    if(!this.title || !this.sku || !this.price_cop || !this.marca_id
      || !this.file_imagen|| !this.categorie_first_id|| !this.description|| (this.selectedItems == 0)){
      this.toastr.error("Validacion","Los campos con el * son obligatorio");
      return;
    }

    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("sku",this.sku);
    formData.append("price_cop",this.price_cop+"");
    formData.append("brand_id",this.marca_id);
    formData.append("portada",this.file_imagen);
    formData.append("categorie_first_id",this.categorie_first_id);
    if(this.categorie_second_id){
      formData.append("categorie_second_id",this.categorie_second_id);
    }
    if(this.categorie_third_id){
      formData.append("categorie_third_id",this.categorie_third_id);
    }
    formData.append("description",this.description);
    formData.append("multiselect",JSON.stringify(this.selectedItems));

    this.productService.createProducts(formData).subscribe((resp:any) => {
      if(resp.message == 403){
        this.toastr.error("Validación",resp.message_text);
      }else{
        this.title = '';
        this.file_imagen = null;
        this.sku = '';
        this.price_cop = 0;
        this.marca_id = '';
        this.categorie_first_id = '';
        this.categorie_second_id = '';
        this.categorie_third_id = '';
        this.description = '';
        this.selectedItems = [];
        this.imagen_previsualiza = "https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg";
        this.toastr.success("Exito","El product se registro perfectamente");
      }
    })
  }

}
