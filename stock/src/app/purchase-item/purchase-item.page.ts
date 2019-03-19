import { Component, OnInit, Input } from '@angular/core';
import { PurchaseOrder } from '../purchase-item';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { Item } from '../item';
import * as firebase from 'firebase/app'
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-purchase-item',
  templateUrl: './purchase-item.page.html',
  styleUrls: ['./purchase-item.page.scss'],
})
export class PurchaseItemPage implements OnInit {
  // @Input() items: Item[];
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
  purchaseOrder: PurchaseOrder = {
    order_purchase: null,
    purchase_date: null,
    purchase_buy: null,
    purchase_address: null,
    name_buyer: null,
    purchase_item: [],
  };
  purchaseItems: PurchaseOrder['purchase_item'] = [];
  fillItem: any;
  select: any[] = [];
  addItemOpen = false;
  ngOnInit() {
    // console.log("item",this.purchaseItems);
    console.log("time",new Date());
    
  }

  getItem(searchbar) {
    let q = searchbar.target.value;
    this.fillItem = this.items.filter((v) => {
      if (v.name && q.trim()) {
        if (v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()) > -1) {
          return true;
        }
        else {
          return false;
        }
      }
    });
  }

  selectItem(item) {
    // console.log("item",item);
    this.fillItem = [];
    // console.log("lenght",this.purchaseItems.length);

    if (this.purchaseItems.length > 0) {
      if (this.purchaseItems[this.purchaseItems.length - 1].product_amount && this.purchaseItems[this.purchaseItems.length - 1].product_price) {
        this.purchaseItems.push({
          product_no: item.serial_number,
          product_detail: item.name,
          product_amount: null,
          product_price: item.price,
          product_unit: item.unit
        });
        // this.select.push(item);
      }
      else {
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลสินค้าให้ครบทุกช่อง")
      }
    }
    else {
      if (item) {
        this.purchaseItems.push({
          product_no: item.serial_number,
          product_detail: item.name,
          product_amount: null,
          product_price: null,
          product_unit: item.unit
        });
        // this.select.push(item);
        // console.log("select", this.select);
        // console.log("item", this.purchaseItems);
      }
    }
  }

  removePermit(index) {
    this.purchaseItems.splice(index, 1);
    this.select.splice(index, 1);
  }

  addNewItem() {
    console.log("add new item");
    this.addNewItemAlert();
  }

  async addNewItemAlert() {
    const alert = await this.alertController.create({
      header: 'เพิ่มรายการใหม่',
      // subHeader: 'เพิ่มชนิดของรายการใหม่',
      inputs: [
        {
          name: 'type',
          type: 'text',
          placeholder: 'ประเภทของรายการ(วัสดุ/ครุภัณฑ์)'
        },
        {
          name: 'group',
          type: 'text',
          placeholder: 'ประเภทของหมวดหมู่'
        },
        {
          name: 'list',
          type: 'text',
          placeholder: 'กลุ่มของรายการ'
        }, {
          name: 'serial',
          type: 'text',
          placeholder: 'รหัสสินค้า'
        },
        {
          name: 'nameItem',
          type: 'text',
          placeholder: 'ชื่อของรายการ'
        },
        {
          name: 'model',
          type: 'text',
          placeholder: 'โมเดลของรายการ'
        },
        {
          name: 'brand',
          type: 'text',
          placeholder: 'ยี่ห้อของรายการ'
        },
        {
          name: 'unit',
          type: 'text',
          placeholder: 'หน่วย'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data.type != "" && data.group != "" && data.nameItem != "" && data.list != "" && data.model != "" && data.brand != "" && data.unit != "") {
              console.log("have data");
              this.db.collection("Items").add({
                type: data.type,
                group: data.group,
                name: data.nameItem,
                serial_number: data.serial,
                list: data.list,
                model: data.model,
                brand: data.brand,
                unit: data.unit
              });
              console.log("select", this.select);
              console.log("purchase", this.purchaseItems);
            }
            else {
              console.log("null");
              this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลให้ครบทุกช่อง")
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async alertFillOrder(head, text) {
    const alert = await this.alertController.create({
      header: head,
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }
  save() {
    if (!this.purchaseOrder.purchase_date) {
      this.purchaseOrder.purchase_date = firebase.firestore.Timestamp.fromDate(new Date());
    }
    else {
      this.purchaseOrder.purchase_date = firebase.firestore.Timestamp.fromDate(new Date(this.purchaseOrder.purchase_date))
    }

    if (this.purchaseOrder.order_purchase && this.purchaseOrder.purchase_buy && this.purchaseOrder.purchase_address && this.purchaseOrder.name_buyer) {
      // console.log("purchase order");
      // console.log("lenght",this.purchaseItems.length);
      // console.log("item",this.purchaseItems);

      if (this.purchaseItems[this.purchaseItems.length - 1]) {
        if (!this.purchaseItems[this.purchaseItems.length - 1].product_amount || !this.purchaseItems[this.purchaseItems.length - 1].product_unit) {
          this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลให้ครบถ้วน");
        }
        else {
          // console.log("not null fill");
          this.purchaseOrder.purchase_item = this.purchaseItems;
          this.items.forEach((item) => {
            this.purchaseItems.forEach((purchase) => {
              if (item.name == purchase.product_detail) {
                this.db.collection("Items").doc(item.id).update({
                  price: purchase.product_price,
                  balance: (purchase.product_amount*1) + (item.balance*1),
                  serial_number: purchase.product_no,
                  buy_place: this.purchaseOrder.purchase_buy,
                  date_buy: this.purchaseOrder.purchase_date,
                });
                this.db.collection("Items").doc(item.id).collection("History").add({
                  amount: purchase.product_amount,
                  date_update: this.purchaseOrder.purchase_date,
                  order_id: this.purchaseOrder.order_purchase,
                  status:"purchase",
                  id_item: item.id,
                  unit: purchase.product_unit,
                  update_by:this.purchaseOrder.name_buyer
                });
              }
            });
          });

          // console.log("order", this.purchaseOrder);
          // console.log("item",this.select);
          this.modalController.dismiss(this.purchaseOrder);
        }
      }
      else {
        this.alertFillOrder("ข้อมูลไม่ถูกต้อง", "กรุณาใส่รายการสินค้าที่สั่งซื้อ");
      }
    }
    else {
      this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมฤูลให้ครบถ้วน");
    }
  }
  cancel() {
    this.modalController.dismiss(null, undefined);
  }
}
