import { Routes } from "@angular/router";

import { CategoriesComponent } from "./categories.component";
import { CreateCategorieComponent } from "./create-categorie/create-categorie.component";
import { EditCategorieComponent } from "./edit-categorie/edit-categorie.component";
import { ListCategorieComponent } from "./list-categorie/list-categorie.component";

const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children:[
      {
        path:'register',
        component: CreateCategorieComponent
      },
      {
        path:'list/edit/:id',
        component: EditCategorieComponent
      },
      {
        path:'list',
        component: ListCategorieComponent
      }
    ]
  }

]
export {categoriesRoutes};
