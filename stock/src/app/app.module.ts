import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AddItemPageModule } from './add-item/add-item.module';
import { EditItemPageModule } from './edit-item/edit-item.module';
import { InfoItemPageModule } from './info-item/info-item.module';

import { AngularFireModule} from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule,FirestoreSettingsToken  } from 'angularfire2/firestore';
import { AddPermitPageModule } from './add-permit/add-permit.module';
import { BorrowPurchaseReturnPageModule } from './borrow-purchase-return/borrow-purchase-return.module';
import { ReturnItemPageModule } from './return-item/return-item.module';
import { PurchaseItemPageModule } from './purchase-item/purchase-item.module';
import { SerialItemPageModule } from './serial-item/serial-item.module';
import { WithdrawItemPageModule } from './withdraw-item/withdraw-item.module';





@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AddItemPageModule,
    EditItemPageModule,
    InfoItemPageModule,
    AddPermitPageModule,
    BorrowPurchaseReturnPageModule,
    ReturnItemPageModule,
    PurchaseItemPageModule,
    SerialItemPageModule,
    WithdrawItemPageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: {RouteReuseStrategy,FirestoreSettingsToken}, useClass: IonicRouteStrategy,  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
