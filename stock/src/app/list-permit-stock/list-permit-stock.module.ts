import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPermitStockPage } from './list-permit-stock.page';

const routes: Routes = [
  {
    path: '',
    component: ListPermitStockPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListPermitStockPage]
})
export class ListPermitStockPageModule {}
