import { Component, OnInit } from '@angular/core';
import { mockItems } from '../mock-items';
import { ModalController, AlertController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { Item } from '../item';
import { EditItemPage } from '../edit-item/edit-item.page';
import { InfoItemPage } from '../info-item/info-item.page';
import * as firebase from 'firebase/app'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PurchaseItemPage } from '../purchase-item/purchase-item.page';


@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.page.html',
  styleUrls: ['./list-stock.page.scss'],
})
export class ListStockPage implements OnInit {

  constructor(public modalController: ModalController, private db: AngularFirestore, public alertController: AlertController) {
    this.itemsCollection = db.collection<Item>("Items");
    this.dataItems = this.itemsCollection.snapshotChanges().pipe(
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

  items:any[]
  selectItem: Item;
  itemsCollection: AngularFirestoreCollection<Item>;
  dataItems: Observable<Item[]>
  itemsDB: Item[];

  ngOnInit() {
  }
  ngOnChange() {
    this.itemsDB.forEach((item) =>{
      if(item.balance > 0){
        this.items.push(item);
      }
    });
    console.log("item",this.items);
  }
  
  infoItem(item) {
    this.selectItem = item;
    this.infoItemmodal();
  }

  editItem(item) {
    this.editItemModal(item);
  }
  addItem() {
    this.selectAddItemsAlert();
  }
  async addItemModal() {
    const modal = await this.modalController.create({
      component: AddItemPage,
      componentProps: {
        items: this.itemsDB
      }
    });
    modal.onDidDismiss().then((data) => {
      // console.log(data.data);
      if (data.data != null) {
        if (data.data.id == null) {
          this.itemsCollection.add(data.data);

          
        }
        else {
          this.itemsCollection.doc(data.data.id).update(data.data);
        }
      }
    });
    return await modal.present();
  }

  async addPurchaseModal() {
    const modal = await this.modalController.create({
      component: PurchaseItemPage,
      componentProps: {
        items: this.itemsDB
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data != undefined)
        // console.log("data", data);
        this.db.collection("Purchases").add(data.data);
    });
    return await modal.present();
  }

  async editItemModal(index) {
    const modal = await this.modalController.create({
      component: EditItemPage,
      componentProps: {
        item: this.itemsDB[index]
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data != null) {
        this.itemsCollection.doc(data.data.id).update(data.data);
      }
    });
    return await modal.present();
  }

  async infoItemmodal() {
    // console.log("Info");
    const modal = await this.modalController.create({
      component: InfoItemPage,
      componentProps: {
        item: this.selectItem
      }
    });
    return await modal.present();
  }


  async selectAddItemsAlert() {
    const alert = await this.alertController.create({
      header: "ต้องการทำรายการเพิ่มสินค้า",
      message: 'กรุณาลือกรูปแบบการทำรายการสินค้า',
      buttons: [
        {
          text: 'เพิ่มตามรายการ',
          handler: () => {
            this.addItemModal();
          }
        },
        {
          text: 'เพิ่มตามใบสั่งซื้อ',
          handler: () => {
            this.addPurchaseModal();
          }
        }]
    });
    await alert.present();
  }


}
