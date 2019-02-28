import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-return-item',
  templateUrl: './return-item.page.html',
  styleUrls: ['./return-item.page.scss'],
})
export class ReturnItemPage implements OnInit {
  @Input() returnItem;
  constructor(public alertController: AlertController, public modalController: ModalController, private db: AngularFirestore) {
    this.itemDB = db.collection<Item>("Items").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        });
      }));
    this.itemDB.subscribe(res => {
      this.items = res;
    });
  }
  itemDB: Observable<Item[]>;
  items: Item[];
  amount: number ;
  selectItem: any;
  index: number;
  selectActive = false;
  disableButton = false;
  returns: any[] = [];
  returnActive = false;
  timeNow = firebase.firestore.Timestamp.fromDate(new Date());
  ngOnInit() {


  }
  save() {
    this.updateBalance();
    this.modalController.dismiss(this.returnItem)
  }

  cancel() {
    this.modalController.dismiss()
  }
  getAmount(item, index) {
    this.index = index;
    this.selectItem = item;
    this.selectActive = true;
    this.disableButton = false;
  }
  selectReturn() {
    if (parseInt(this.selectItem.amount) >=  this.amount) {
      this.returnActive = true;
      this.returns.push({
        item: this.selectItem,
        amount: this.amount*1
      });
      this.returnItem.permit_order[this.index].amount -= this.amount * 1;
      this.disableButton = true;
      this.selectItem = [];
      this.amount = null;
    }
    else {
      this.alertFillOrder("จำนวนการคืนไม่ถุกต้อง", "กรุณากรอกใหม่อีกครั้ง")
    }
    this.disableButton = true;
    this.selectItem = [];
    this.amount = null;
  }

  updatePermit(item) {
    this.returnItem.permit_order.forEach((r,index) => {
      if (r.id_item == item.item.id_item) {
        // r.amount -= item.amount*1;
        if (r.amount > item.amount) {
          this.returnItem.status = "Returning";
        } else if (r.amount == item.amount) {
          this.returnItem.status = "Returned";
        }
      }
      else {
        console.log("error");
      }
    });
  }

  updateBalance() {
    this.items.forEach((item) => {
      this.returns.forEach((r) => {
        if (item.id === r.item.id_item) {
          if (r.amount <= r.item.amount) {
            item.balance += r.amount * 1;
            this.db.collection("Items").doc(item.id).update({
              balance: item.balance
            });
            this.db.collection("Items").doc(item.id).collection("History").add({
          order_id: this.returnItem.id,
          date_update: this.timeNow,
          id_item: item.id,
          status: "return",
          amount: r.amount,
          unit: item.unit
            });
            this.updatePermit(r);
            return;
          }
        }
      })
    })
  }

  async alertFillOrder(head, text) {
    const alert = await this.alertController.create({
      header: head,
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }
}
