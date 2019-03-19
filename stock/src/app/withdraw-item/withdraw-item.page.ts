import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ModalController, AlertController } from '@ionic/angular';
import { Item } from '../item';
import { permitItem } from '../permit-item';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-withdraw-item',
  templateUrl: './withdraw-item.page.html',
  styleUrls: ['./withdraw-item.page.scss'],
})
export class WithdrawItemPage implements OnInit {

  constructor(public modalController: ModalController, private db: AngularFirestore, public alertController: AlertController) {
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
  @Input() item: Item[];
  itemDB: Observable<Item[]>;
  items: Item[];
  takeItem: any[] = [];
  selectTakeItem;
  permitorder: permitItem = {
    order_number:null,
    date_premit: null,
    name_borrower: null,
    department: null, // หน่วยงาน
    objective: null, //วัตถุประสงค์
    permit_order: null,
    approvers: null,
    status: "Take out",
  };
  permitItems: permitItem["permit_order"] = [];
  clickAble = true;
  // [{
  //   nameItem:null,
  //   unit:null,
  //   amount:null, //จำนวนวัสดุครุภัณฑ์ที่ยืม 
  //   id_item:null,
  // }]


  ngOnInit() {
    // console.log("permit", this.item);

  }
  getItem(searchbar) {
    let q = searchbar.target.value;
    this.takeItem = this.item.filter((v) => {
      if (v.type == "วัสดุ" || v.type == "อื่นๆ") {
        if (v.name && q.trim()) {
          if (v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()) > -1) {
            return true;
          }
          else {
            return false;
          }
        }
      }

    });
    // console.log("item",this.takeItem);
  }
  selectItem(item) {
    this.takeItem = []
    this.selectTakeItem = item;
    // console.log("select", this.selectTakeItem);
    this.pushItem();

  }

  pushItem() {
    console.log("item", this.permitItems);
    if (this.permitItems.length == 0) {
      this.permitItems.push({
        nameItem: this.selectTakeItem.name,
        unit: this.selectTakeItem.unit,
        amount: this.selectTakeItem.amount,
        id_item: this.selectTakeItem.id,
      });

    }
    else {
      if (this.permitItems[this.permitItems.length - 1].amount != undefined) {
        if (this.permitItems[this.permitItems.length - 1].amount <= this.selectTakeItem.balance) {
          this.permitItems.push({
            nameItem: this.selectTakeItem.name,
            unit: this.selectTakeItem.unit,
            amount: this.selectTakeItem.amount,
            id_item: this.selectTakeItem.id,
          });
        }
        else {
          this.alertFillOrder("ไม่สามารถทำรายการยืมได้", this.permitItems[this.permitItems.length - 1].nameItem + " " + " มีจำนวนไม่เพียงพอในการเบิก");
        }

      }
      else {
        this.alertFillOrder("กรุณากรอกข้อมูลให้ครบถ้วน", "คุณยังไม่ได้กรอกจำนวนของรายการ" + " " + this.permitItems[this.permitItems.length - 1].nameItem);

      }
    }
    this.clickAble = false;
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

    if (this.permitItems[this.permitItems.length - 1].amount != undefined) {
      console.log("not undifined");

      if (this.permitItems[this.permitItems.length - 1].amount <= this.selectTakeItem.balance) {
        // console.log("amount <= balance");

        let timeNow = firebase.firestore.Timestamp.fromDate(new Date());
        if (this.permitItems[this.permitItems.length - 1].amount != undefined) {
          this.permitorder.permit_order = this.permitItems;
        } else {
          this.alertFillOrder("กรุณากรอกข้อมูลให้ครบถ้วน", "คุณยังไม่ได้กรอกจำนวนของรายการ" + " " + this.permitItems[this.permitItems.length - 1].nameItem);
        }
        if (this.permitorder.name_borrower && this.permitorder.department && this.permitorder.objective && this.permitorder.permit_order && this.permitorder.order_number) {
          console.log("order", this.permitorder);
          if (this.permitorder.date_premit == null) {
            this.permitorder.date_premit = timeNow;
          }
          else {
            this.permitorder.date_premit = firebase.firestore.Timestamp.fromDate(new Date(this.permitorder.date_premit));
          }
        }
        else {
          this.alertFillOrder("กรอกข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลให้ครบถ้วน");
          console.log("order error", this.permitorder);
        }
      }
      else {
        this.alertFillOrder("ไม่สามารถทำรายการยืมได้", this.permitItems[this.permitItems.length - 1].nameItem + " " + " มีจำนวนไม่เพียงพอในการเบิก");
      }

    }
    else {
      this.alertFillOrder("กรุณากรอกข้อมูลให้ครบถ้วน", "คุณยังไม่ได้กรอกจำนวนของรายการ" + " " + this.permitItems[this.permitItems.length - 1].nameItem);

    }

  }

  cancel() {
    this.modalController.dismiss();
  }

  async saveAlert() {
    const alert = await this.alertController.create({
      header: 'บันทึกรายการ',
      message: 'คุณต้องการจะเพิ่มรายการเบิกใช่หรือไม่',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.save();
            this.updatestork();
            this.modalController.dismiss(this.permitorder);
            // this.modalController.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  removePermit(index) {
    console.log("remove");
    this.permitItems.splice(index, 1);
    console.log("item", this.permitItems);
  }

  updatestork() {
    let timeNow = firebase.firestore.Timestamp.fromDate(new Date());
    this.permitItems.forEach((order) => {
      this.items.forEach((item) => {
        if (order.id_item === item.id) {
          item.balance -= order.amount * 1;
          item.date_update = timeNow;

          this.db.collection("Items").doc(item.id).update(item);
          this.db.collection("Items").doc(item.id).collection("Historys").add({
            date_update: timeNow,
            price: item.price,
            status: "Take out",
            amount: order.amount,
            update_by: this.permitorder.name_borrower,
            unit: item.unit,
            order_id: this.permitorder.order_number
          });
          return;
        }
      });


    });
    this.permitorder.permit_order = this.permitItems;
  }
}
