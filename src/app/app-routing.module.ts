import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './component/store/store.component';
import { ItemComponent } from './component/item/item.component';
import { PurchaseComponent } from './component/purchase/purchase.component';
import { SaleComponent } from './component/sale/sale.component';

const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'store', component: StoreComponent },
  { path: 'items', component: ItemComponent },
  { path: 'purchases', component: PurchaseComponent },
  { path: 'sales', component: SaleComponent },
  { path: '**', redirectTo: '/store' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
