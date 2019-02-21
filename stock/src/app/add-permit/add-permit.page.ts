import { Component, OnInit, Input } from '@angular/core';
import { permitItem } from "../permit-item";
import { AlertController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { Item } from '../item';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-add-permit',
  templateUrl: './add-permit.page.html',
  styleUrls: ['./add-permit.page.scss'],
})
export class AddPermitPage implements OnInit {
  @Input() permit: permitItem[];
  // @Input() item: Item[];
  permitOrder: permitItem["permit_order"] = [];
  //  = [{
  //   nameItem: null,
  //   serial_number: null,
  //   serial_item: null,
  //   unit: null,
  //   amount: null,
  // }];

  history: History[] = [];
  permitItem: permitItem = {
    order_number: null, //เลขรายการยืม
    date_premit: null,
    name_borrower: null,
    department: null, // หน่วยงาน
    objective: null, //วัตถุประสงค์
    permit_order: null, //จำนวนรายการต่อ1ใบ
    approvers: null,
    status: null,
  };
  fillItem: any[]
  select: any[] = [];
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
      // console.log("items", this.items);

    })
  }

  ngOnInit() {
    // console.log("permit", this.permit);
    // console.log("item", this.item);
  }
  itemDB: Observable<Item[]>;
  items: Item[];

  // addPermit() {

  //   let order = this.permitOrder[this.permitOrder.length - 1];
  //   if (order.nameItem == null || order.amount == null || order.unit == null) {
  //     if (order.nameItem == null) {
  //       this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลชื่อรายการ");
  //     }
  //     else if (order.amount == null) {
  //       this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลจำนวนชิ้นของรายการที่ยืม");
  //     }
  //     else if (order.unit == null) {
  //       this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลหน่วยของรายการที่ยืม");
  //     }
  //   }
  //   else {
  //     this.permitOrder.push(
  //       {
  //         nameItem: null,
  //         serial_number: null,
  //         serial_item: null,
  //         unit: null,
  //         amount: null,
  //       });
  //   }
  // }
  save() {
    // let order = this.permitOrder[this.permitOrder.length - 1];
    if (this.permitItem.order_number == null || this.permitItem.name_borrower == null || this.permitItem.department == null || this.permitItem.objective == null || this.permitOrder.length == 0) {
      this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลใหม่");
    }
    else {

      for (let p of this.permit) {
        if (this.permitItem.order_number == p.order_number) {
          this.alertFillOrder("เลขรายการมีอยู่แล้ว", "กรุณากรอกเลขรายการใหม่");
          return;
        }

      }
      this.permitItem.permit_order = this.permitOrder;
      this.permitItem.date_premit = firebase.firestore.Timestamp.fromDate(new Date());
      if (this.permitItem.approvers == null) {
        this.permitItem.status = "รอการอนุมัติ"
      }
      else {
        this.permitItem.status = "กำลังยืม"
      }
      // console.log("permit", this.permitItem);

      this.saveAlert(this.permitItem);
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
  removePermit(index) {
    console.log("remove");
    this.deleteAlert(index)
  }
  getItem(searchbar) {
    let q = searchbar.target.value;
    // console.log("q", q);
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

  // selectItem(item) {
  //   if (this.permitOrder.length > 1) {
  //     if (this.permitOrder[this.permitOrder.length - 1].amount == null) {
  //       this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลจำนวนชิ้นของรายการที่ยืม");
  //     }
  //     else {

  //       this.permitOrder.push(
  //         {
  //           nameItem: null,
  //           serial_number: null,
  //           serial_item: null,
  //           unit: null,
  //           amount: null,
  //         });

  //       if (!item.serial_item || !item.serial_number) {
  //         this.permitOrder[this.permitOrder.length - 1].serial_item = "-";
  //         this.permitOrder[this.permitOrder.length - 1].serial_number = "-";
  //       }
  //       else {
  //         this.permitOrder[this.permitOrder.length - 1].serial_item = item.serial_item;
  //         this.permitOrder[this.permitOrder.length - 1].serial_number = item.serial_number;
  //       }


  //       this.permitOrder[this.permitOrder.length - 1].nameItem = item.name;
  //       this.permitOrder[this.permitOrder.length - 1].unit = item.unit;
  //       // console.log("amout>1",this.permitOrder[this.permitOrder.length -1 ].amount);

  //       this.select.push(item);
  //       console.log("permititem",this.permitOrder);
  //       // console.log("this select", this.select);
  //     }
  //   }
  //   else {
  //     this.permitOrder.push(
  //       {
  //         nameItem: null,
  //         serial_number: null,
  //         serial_item: null,
  //         unit: null,
  //         amount: null,
  //       });
  //       if (this.permitOrder[this.permitOrder.length - 1].amount == null) {
  //         this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลจำนวนชิ้นของรายการที่ยืม");
  //       }
  //     if (!item.serial_item || !item.serial_number) {
  //       this.permitOrder[this.permitOrder.length - 1].serial_item = "-";
  //       this.permitOrder[this.permitOrder.length - 1].serial_number = "-";
  //     }
  //     else {
  //       this.permitOrder[this.permitOrder.length - 1].serial_item = item.serial_item;
  //       this.permitOrder[this.permitOrder.length - 1].serial_number = item.serial_number;
  //     }

  //     this.permitOrder[this.permitOrder.length - 1].nameItem = item.name;
  //     this.permitOrder[this.permitOrder.length - 1].unit = item.unit;


  //     if(this.permitOrder[this.permitOrder.length-1].amount != null){

  //     }
  //     this.select.push(item);

  //     console.log("permititem",this.permitOrder);

  //   }

  //   this.fillItem = [];

  // }

  selectItem(item) {
    if (this.permitOrder.length == 0) {
      this.permitOrder.push(
        {
          nameItem: item.name,
          serial_number: null,
          serial_item: null,
          unit: item.unit,
          amount: null,
        });
      if (this.permitOrder[this.permitOrder.length - 1].serial_item == undefined || this.permitOrder[this.permitOrder.length - 1].serial_number == undefined) {
        if (this.permitOrder[this.permitOrder.length - 1].serial_item == undefined) {
          this.permitOrder[this.permitOrder.length - 1].serial_item = "-"
        }
        else if (this.permitOrder[this.permitOrder.length - 1].serial_number == undefined) {
          this.permitOrder[this.permitOrder.length - 1].serial_number = "-"
        }
        else {
          this.permitOrder[this.permitOrder.length - 1].serial_item = item.serial_item;
          this.permitOrder[this.permitOrder.length - 1].serial_number = item.serial_number;
        }
      }
      // else {
        this.select.push(item);
      // }

    }
    else {
      if (!this.permitOrder[this.permitOrder.length - 1].amount) {
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกจำนวนของวัสดุ-ครุภัณฑ์");
      }
      else {
        if (this.permitOrder[this.permitOrder.length - 1].amount > item.balance) {
          this.alertFillOrder("ไม่สามารถยืม" + " " + this.permitOrder[this.permitOrder.length - 1].nameItem + " " + "ได้", "กรุณากรอกจำนวนครุภัณฑ์ใหม่")
        }
        else {
          this.permitOrder.push(
            {
              nameItem: item.name,
              serial_number: null,
              serial_item: null,
              unit: item.unit,
              amount: null,
            });
          // this.select.push(item);
          if (this.permitOrder[this.permitOrder.length - 1].serial_item == undefined || this.permitOrder[this.permitOrder.length - 1].serial_number == undefined) {
            if (this.permitOrder[this.permitOrder.length - 1].serial_item == undefined) {
              this.permitOrder[this.permitOrder.length - 1].serial_item = "-"
            }
            else if (this.permitOrder[this.permitOrder.length - 1].serial_number == undefined) {
              this.permitOrder[this.permitOrder.length - 1].serial_number = "-"
            }
            else {
              this.permitOrder[this.permitOrder.length - 1].serial_item = item.serial_item;
              this.permitOrder[this.permitOrder.length - 1].serial_number = item.serial_number;
            }
          }
          // else {
            this.select.push(item);
          // }
        }
      }
      this.fillItem = [];

    }
    // console.log("item", item);
    // console.log("perorder", this.permitOrder);
    console.log("this.select", this.select);
  }

  async deleteAlert(index) {
    const alert = await this.alertController.create({
      header: 'ลบรายการ',
      message: 'คุณต้องการจะลบรายการนี้ใช่ไหม',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.permitOrder.splice(index, 1);
            this.select.splice(index, 1);
          }
        }
      ]
    });
    await alert.present();
  }
  async alertFillOrder(head, text) {
    // console.log(text);

    const alert = await this.alertController.create({
      header: head,
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  async saveAlert(permit) {
    // console.log(permit);
    const alert = await this.alertController.create({
      header: 'บันทึกรายการ',
      message: 'คุณต้องการจะเพิ่มรายการยืมใช่หรือไม่',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.updateHistory();
            // this.modalController.dismiss(permit)
            this.modalController.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
  updateHistory() {
    console.log("update History");
    
    let timeNow = firebase.firestore.Timestamp.fromDate(new Date());
    console.log("select",this.select);
    
    for (let key in this.select) {
      console.log("this.select", key, this.select[key]);
      this.updateStock(this.select[key]);
      // this.db.collection<Item>("Items").doc(this.select[key].id).collection("History").add({
      //   order_id: this.permitItem.order_number,
      //   date_update: timeNow,
      //   amount: this.permitOrder[key].amount,
      //   // update_by: permit.
      //   unit: this.permitOrder[key].unit,
      //   status: "ยืม",
      // });
    }
  }
  updateStock(item) {
    console.log("updateStock");
console.log("item",item);

    // for (let key in this.items) {
    //   if (item.id == this.items[key].id) {
    //     // this.db.collection<Item>("Items").doc(item.id).update({
    //     //   balance: this.items[key].balance - item.balance
    //     // })
    //     console.log("item[key]", item[key].id);
    //     console.log("select[key]", this.items[key].id);
    //     console.log("balace", key, this.items[key].balance - item.balance);

    //   }
    // }


  }

}