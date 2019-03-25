import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { History } from '../history';

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
  amount: number;
  selectItem: any;
  index: number;
  selectActive = false;
  disableButton = false;
  returns: any[] = [];
  returnActive = false;
  timeNow = firebase.firestore.Timestamp.fromDate(new Date());
  aprrover: string = null;
  ngOnInit() {

    console.log("today", new Date());

  }
  save() {
    if (this.aprrover != null) {
      this.updateBalance();
      this.modalController.dismiss(this.returnItem);
    }
    else{
      this.alertFillOrder("กรุณากรอกข้อมูลให้ครบถ้วน","เลือกผู้รับสินค้าคืน");
    }
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
    if (parseInt(this.selectItem.amount) >= this.amount) {
      this.returnActive = true;
      this.returns.push({
        item: this.selectItem,
        amount: this.amount * 1
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
  removePermit(i) {
    this.returnItem.permit_order.forEach(item => {
      if (item.id_item == this.returns[i].item.id_item) {
        item.amount += (this.returns[i].amount * 1);
      }
    });
    this.returns.splice(i, 1);
  }

  updateBalance() {

    console.log("update");
    this.items.forEach((item) => {
      this.returns.forEach((r) => {
        if (item.id === r.item.id_item) {
          console.log("return", r);
          console.log("item=", item.balance);
          console.log("return=", r.amount);
          console.log("item + return", item.balance + r.amount * 1);

          // if (r.amount <= r.item.amount) {
          item.serial.push({
            serial_item: r.item.serial_item ,
            serial_number: r.item.serial_number
          })
          item.balance += (r.amount * 1);
          this.db.collection("Items").doc(r.item.id_item).update({
            balance: item.balance,
            serial: item.serial
          });
          
          this.db.collection("Items").doc(r.item.id_item).collection<History>("Historys").add({
            order_id: this.returnItem.id,
            date_update: this.timeNow,
            id_item: item.id,
            status: "return",
            amount: r.amount*1,
            unit: item.unit,
            serial: {
              serial_item: r.item.serial_item,
              serial_number: r.item.serial_number
            },

            update_by: this.aprrover
          });
          console.log("item new", item);


          return;
          // }
        }
      });
    });
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
