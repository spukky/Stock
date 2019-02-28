import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { permitItem } from '../permit-item';
import { mockPremitItems } from '../mock-permit-item';
import { ModalController } from '@ionic/angular';
import { AddPermitPage } from '../add-permit/add-permit.page';
import { Item } from '../item';
import { ReturnItemPage } from '../return-item/return-item.page';

@Component({
  selector: 'app-list-permit-stock',
  templateUrl: './list-permit-stock.page.html',
  styleUrls: ['./list-permit-stock.page.scss'],
})
export class ListPermitStockPage implements OnInit {

  constructor(private db: AngularFirestore, public modalController: ModalController) {
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
  }
  itemDB: Observable<Item[]>;
  item: Item[];
  permition = mockPremitItems;
  permitItems: Observable<permitItem[]>;
  permitDB: permitItem[];
  permitColloction: AngularFirestoreCollection<permitItem>;
  returnItem:any

  // test() {
  //   for (let permit of this.permition) {
  //     this.db.collection("PermitItems").doc(permit.order_number).set(permit)
  //       .then((docRef) => {
  //         console.log("Document written with ID: ", docRef);
  //       })
  //       .catch((error) => {
  //         console.log("Error adding document: ", error);

  //       })
  //   }
  // }

  addPermit() {
    console.log("ADD");
    this.addPermitModal();

  }
  returnStock(permit){
    console.log("permit",permit);
    this.returnItem = permit;
    this.returnModal();
  }


  async addPermitModal() {
    console.log("modalPermition");

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

  async returnModal(){
    const modal = await this.modalController.create({
      component: ReturnItemPage ,
      componentProps:{
        returnItem:this.returnItem,
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data);
      if (data.data != undefined) {
        // this.db.collection("PermitItems").doc(data.data.order_number).set(data.data);
        this.db.collection("PermitItems").doc(data.data.id).update(data.data);
      }

    })
    return await modal.present();
  }
}
