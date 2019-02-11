import { Component, OnInit } from '@angular/core';
import { mockItems } from '../mock-items';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { Item } from '../item';
import { EditItemPage } from '../edit-item/edit-item.page';
import { InfoItemPage } from '../info-item/info-item.page';
import * as firebase from 'firebase/app'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomAdapter } from '@angular/platform-browser/src/dom/dom_adapter';
@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.page.html',
  styleUrls: ['./list-stock.page.scss'],
})
export class ListStockPage implements OnInit {
  
  constructor(public modalController: ModalController,private db: AngularFirestore) { 
    this.itemsCollection = db.collection<Item>("Items");
    this.dataItems = this.itemsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id,...data}
        });
      }));
      this.dataItems.subscribe(res => {
        this.itemsDB = res;
        
        
      });
    }
    
    items = mockItems;
    selectItem:Item;
    itemsCollection : AngularFirestoreCollection<Item>;
    dataItems : Observable<Item[]>
    itemsDB : Item[];
    ngOnInit() {
    }
test(){

  // for (let key in this.items) {
  //     this.db.collection("Items").add(this.items[key])
  // .then((docRef) => {
  //   console.log("Document written with ID: ", docRef.id);
  // })
  // .catch((error) => {
  //   console.error("Error adding document: ", error);
  // })
  // }

  
  //   console.log("test");
  // for (const item of this.itemsDB) {
  
  //   console.log(item);
    
  // }
}

    infoItem(item){
      this.selectItem = item;
      // console.log(this.selectItem);
      this.infoItemmodal();
    }
    
    editItem(item){
      // console.log("edit");
      // console.log(item);
      
      // this.selectItem = item;
      // console.log(this.selectItem);
      // console.log(this.itemsDB[item]);

      
      this.editItemModal(item);
    }
    addItem(){
      // console.log("Add");
      this.addItemModal();
      
    }
    async addItemModal(){
      const modal = await this.modalController.create({
        component:AddItemPage,
        componentProps:{
          items: this.itemsDB
        }
      });
      modal.onDidDismiss().then((data) =>{
        console.log(data.data);
        if(data.data != null){
          if(data.data.id == null){
            this.itemsCollection.add(data.data);
          }
          else{
            this.itemsCollection.doc(data.data.id).update(data.data);
          }
        }
      });
      return await modal.present();
    }
    
    async editItemModal(index){
      const modal = await this.modalController.create({
        component:EditItemPage,
        componentProps:{
          item: this.itemsDB[index]
        }
      });
      modal.onDidDismiss().then((data) =>{
        if(data.data != null){
          this.itemsCollection.doc(data.data.id).update(data.data);
          // this.itemsCollection.doc(data.data.id).update({
          //   // type:this.itemsDB[index].type,
          //   // group:this.itemsDB[index].type,
          //   // name:this.itemsDB[index].type,
          //   // list:this.itemsDB[index].type,
          //   // model:this.itemsDB[index].type,
          //   // brand:this.itemsDB[index].type,
          //   // price:this.itemsDB[index].type,
          //   // balance:this.itemsDB[index].type,
          //   // unit:this.itemsDB[index].type,
          //   // buy_place:this.itemsDB[index].type,
          //   keep_place:data.data.keep_place,
          //   attendant:data.data.attendant,
          //   // date_buy:this.itemsDB[index].type,
          //   note:data.data.note,
          //   // project:this.itemsDB[index].type,
          //   // increas:this.itemsDB[index].type,
          // })
        }
      });
      return await modal.present();
    }
    
    async infoItemmodal(){
      console.log("Info");
      const modal = await this.modalController.create({
        component: InfoItemPage,
        componentProps:{
          item: this.selectItem
        }
      });
      return await modal.present();
    }
    
  }
  