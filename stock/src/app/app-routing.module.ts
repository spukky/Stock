import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    // redirectTo: 'list-permit-stock',
    // redirectTo: 'borrow-purchase-return',
    // redirectTo: 'purchase-item',
    // redirectTo: 'list-stock',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'list-stock', loadChildren: './list-stock/list-stock.module#ListStockPageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'list-permit-stock', loadChildren: './list-permit-stock/list-permit-stock.module#ListPermitStockPageModule' },
  { path: 'add-item', loadChildren: './add-item/add-item.module#AddItemPageModule' },
  { path: 'edit-item', loadChildren: './edit-item/edit-item.module#EditItemPageModule' },
  { path: 'info-item', loadChildren: './info-item/info-item.module#InfoItemPageModule' },
  { path: 'add-permit', loadChildren: './add-permit/add-permit.module#AddPermitPageModule' },
  { path: 'borrow-purchase-return', loadChildren: './borrow-purchase-return/borrow-purchase-return.module#BorrowPurchaseReturnPageModule' },
  { path: 'return-item', loadChildren: './return-item/return-item.module#ReturnItemPageModule' },
  { path: 'purchase-item', loadChildren: './purchase-item/purchase-item.module#PurchaseItemPageModule' },  { path: 'serial-item', loadChildren: './serial-item/serial-item.module#SerialItemPageModule' },
  { path: 'withdraw-item', loadChildren: './withdraw-item/withdraw-item.module#WithdrawItemPageModule' },

 

  





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
}
