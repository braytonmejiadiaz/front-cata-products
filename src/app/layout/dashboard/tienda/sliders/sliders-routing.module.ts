import { Routes } from '@angular/router';
import { SlidersComponent } from './sliders.component';
import { CreateSlidersComponent } from './create-sliders/create-sliders.component';
import { EditSlidersComponent } from './edit-sliders/edit-sliders.component';
import { ListsSlidersComponent } from './lists-sliders/lists-sliders.component';

const Slidersroutes: Routes = [
  {
    path: '',
    component: SlidersComponent,
    children: [
      {
        path: 'crear',
        component: CreateSlidersComponent,
      },
      {
        path: 'list/edit/:id',
        component: EditSlidersComponent,
      },
      {
        path: 'list',
        component: ListsSlidersComponent,
      }
    ],
  }
];

export {Slidersroutes};
