import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { permitItem } from '../permit-item';
import { mockPremitItems } from '../mock-permit-item';
import { ModalController, AlertController } from '@ionic/angular';
import { AddPermitPage } from '../add-permit/add-permit.page';
import { Item } from '../item';
import { ReturnItemPage } from '../return-item/return-item.page';
import { WithdrawItemPage } from '../withdraw-item/withdraw-item.page';

@Component({
  selector: 'app-list-permit-stock',
  templateUrl: './list-permit-stock.page.html',
  styleUrls: ['./list-permit-stock.page.scss'],
})
export class ListPermitStockPage implements OnInit {

  constructor(private db: AngularFirestore, public modalController: ModalController, public alertController: AlertController) {
    this.permitColloction = db.collection<permitItem>("PermitItems");
    this.permitItems = this.permitColloction.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        });
      }));
    this.permitItems.subscribe(res => {
      this.permitDB = res;
      //  console.log("permitDB",this.permitDB);

    });
    this.itemDB = db.collection<Item>("Items").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        });
      }));
    this.itemDB.subscribe(res => {
      this.item = res;
      // console.log("this.item",this.item);

    });



  }

  ngOnInit() {
    // console.log("time",new Date());
  }
  itemDB: Observable<Item[]>;
  item: Item[];
  permition = mockPremitItems;
  permitItems: Observable<permitItem[]>;
  permitDB: permitItem[];
  permitColloction: AngularFirestoreCollection<permitItem>;
  returnItem: any


  addPermit() {
    console.log("ADD");
    this.selectAddIPermitAlert();


  }
  returnStock(permit) {
    // console.log("permit",permit);
    this.returnItem = permit;

    this.returnModal();
  }


  async addPermitModal() {
    // console.log("modalPermition");

    const modal = await this.modalController.create({
      component: AddPermitPage,
      componentProps:
      {
        permit: this.permitDB,
      }
    });
    modal.onDidDismiss().then((data) => {
      // console.log(data.data);
      if (data.data != undefined) {
        this.db.collection("PermitItems").doc(data.data.order_number).set(data.data);
      }

    })
    return await modal.present();
  }

  async returnModal() {
    const modal = await this.modalController.create({
      component: ReturnItemPage,
      componentProps: {
        returnItem: this.returnItem,
      }
    });
    modal.onDidDismiss().then((data) => {
      // console.log(data.data);
      let sum: number = 0;
      console.log("data", data);
      if (data.data != undefined) {
        data.data.permit_order.forEach(permit => {
          sum += (permit.amount * 1);
        });
        if (sum == 0) {
          data.data.status = "Returned";
        }
        else {
          data.data.status = "Returnning"
        }
        this.db.collection("PermitItems").doc(data.data.id).update(data.data);
      }

    })
    return await modal.present();
  }

  async selectAddIPermitAlert() {
    const alert = await this.alertController.create({
      header: "ต้องการทำรายการยืม/เบิก",
      message: 'กรุณาลือกรูปแบบการทำรายการ',
      buttons: [
        {
          text: 'เบิกวัสดุ',
          handler: () => {
            this.addWithdrawModal();
          }
        },
        {
          text: 'ยืมครุภัณฑ์-วัสดุ',
          handler: () => {
            this.addPermitModal();
          }
        }
      ]
    });
    await alert.present();
  }

  async addWithdrawModal() {
    // console.log("modalPermition");

    const modal = await this.modalController.create({
      component: WithdrawItemPage,
      componentProps:
      {
        item: this.item,
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data);
      if (data.data != undefined) {
        console.log("data", data.data);
        this.db.collection("PermitItems").doc(data.data.order_number).set(data.data);
      }

    })
    return await modal.present();
  }
}
