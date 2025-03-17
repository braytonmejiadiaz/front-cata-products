import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands.component';
import { ListsBrandComponent } from './lists-brand/lists-brand.component';

const brandroutes: Routes = [
  {
    path: '',
    component: BrandsComponent,
    children: [
      {
        path: 'list',
        component: ListsBrandComponent,
      }
    ]
  }
];

export {brandroutes};

