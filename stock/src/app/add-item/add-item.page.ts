import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { ModalController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { SerialItemPage } from '../serial-item/serial-item.page';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  constructor(public modalController: ModalController, public alertController: AlertController, private db: AngularFirestore) {

    this.dataItems = db.collection<Item>("Items").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        });
      }));
    this.dataItems.subscribe(res => {
      this.itemsDB = res;
    });
  }
  dataItems: Observable<Item[]>
  itemsDB: Item[] = [];
  @Input() items: Item[];
  item: any
  select: Item = {
    type: null,
    group: null,
    name: null,
    list: null,
    model: null,
    brand: null,
    price: 0,
    balance: null,
    unit: null,
    buy_place: "",
    keep_place: null,
    attendant: null,
    serial: [],
    date_buy: null
  };
  addItemOpen = false;
  readable = true;
  newItem = false;
  saveAble = false;

  ngOnInit() {
    // console.log(this.items);
    console.log("select", this.select);

    this.select.increas = 0;

  }
  async fillAlert() {
    // console.log("alert");
    const alert = await this.alertController.create({
      header: "Warning",
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      buttons: ['OK']
    });
    await alert.present();
  }
  save() {
    if (this.newItem == true) {
      // console.log("newitem");

      if (this.select.type == null || this.select.group == null || this.select.list == null || this.select.name == null || this.select.model == null || this.select.brand == null || this.select.increas == null) {
        // console.log("fill");        
        this.fillAlert();
        return 0;
      }
      else {
        this.select.balance = this.select.increas * 1;
        if (this.select.date_buy == null) {
          this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date());
          // console.log(this.select.date_buy);
        }
        else {
          this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date(this.select.date_buy));
          // console.log(this.select.date_buy);
        }

        // console.log(this.select);
        this.readable = true;
        this.newItem = false;
      }
    }
    else {
      this.select.balance = (this.select.balance * 1) + (this.select.increas * 1);
      if (this.select.date_buy == null) {
        this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date());
      }
      else if (this.select.date_buy.seconds) {
        this.select.date_buy = this.select.date_buy
      }
      else {
        this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date(this.select.date_buy));
      }
    }
    this.modalController.dismiss(this.select);
    this.select.increas = 0;
    this.addItemOpen = false;


  }
  initialItem() {
    // this.item = this.items;
  }
  cancel() {
    this.modalController.dismiss();
  }
  getItem(searchbar) {
    // this.initialItem();
    let q = searchbar.target.value;
    if (!q) {
      return;
    }
    this.item = this.items.filter((v) => {
      if (v.name && q.trim() != '') {
        if (v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()) > -1) {
          // console.log("indexof",v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()));

          return true;
        }
        else {
          return false;
        }
      }
    });
  }

  selectItem(select) {
    this.select = select;
    this.addItem();
  }
  addItem() {
    this.addItemOpen = true;
  }

  addNewItem() {
    this.addItem();
    this.readable = false;
    this.newItem = true
  }

  async saveAlert() {
    const alert = await this.alertController.create({
      header: 'ต้องการกรอกเลขทะเบียนสินค้าหรือไม่',
      message: 'คุณต้องการจะเพิ่มรายการยืมใช่หรือไม่',
      buttons: [
        {
          text: 'ไม่ต้องการกรอก ให้บันทึกได้เลย',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            if (this.select.increas > 0) {
              this.save();
              console.log("sucesses");
            }
            else {
              this.alertFillOrder("กรุณากรอกจำนวนสินค้า", "");
            }
          }
        }, {
          text: 'กรอกทะเบียนสินค้า',
          handler: () => {
            if (this.select.increas > 0) {
              this.modalController.dismiss();
              this.addSerialItemModal();
            }
            else {
              this.alertFillOrder("กรุณากรอกจำนวนสินค้า", "")
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async addSerialItemModal() {
    console.log("Info");
    const modal = await this.modalController.create({
      component: SerialItemPage,
      componentProps: {
        item: this.select
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log("data", data.data);
      this.itemsDB.forEach(item => {
        if (item.name == data.data.name) {
          this.db.collection("Items").doc(data.data.id).collection("Historys").add({
            date_update: data.data.date_buy,
            price: data.data.price,
            status: "Purchase",
            amount: data.data.increas,
            buy_place: data.data.buy_place,
            update_by: data.data.attendant,
            unit: data.data.unit
          });
        }
      });
    });
    console.log("select", this.select);
    return await modal.present();
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
