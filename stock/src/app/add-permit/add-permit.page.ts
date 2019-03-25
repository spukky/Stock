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
  index;
  // @Input() returnItem:any;
  permitOrder: permitItem["permit_order"] = [];
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
  serialPermit: any[];
  fillItem: any[]
  select: any[] = [];
  item: any = null;
  clickAble = true;
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

  ngOnInit() {
  }
  itemDB: Observable<Item[]>;
  items: Item[];
  save() {
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
        this.permitItem.status = "Waiting for approval"
      }
      else {
        this.permitItem.status = "Approve"
      }
      if (!this.permitOrder[this.permitOrder.length - 1].amount) {
        this.alertFillOrder("กรอกข้อมูลไม่ครบถ้วน", "กรุณากรอกจำนวนวัสดุ ครุภัณฑ์ที่ต้องการยืม");
      }
      else {
        if (this.permitOrder[this.permitOrder.length - 1].amount > 0) {
          for (let key in this.items) {
            if (this.permitOrder[this.permitOrder.length - 1].nameItem == this.items[key].name) {
              if (this.permitOrder[this.permitOrder.length - 1].amount > this.items[key].balance) {
                this.alertFillOrder("ไม่สามารถยืม" + " " + this.permitOrder[this.permitOrder.length - 1].nameItem + " " + "ได้", "กรุณากรอกจำนวนครุภัณฑ์ใหม่");
                return;
              }
              else {
                this.saveAlert(this.permitItem);
              }
              return;
            }
          }
        }
        else {
          this.alertFillOrder("ไม่สามารถยืมได้", "กรอกจำนวนไม่ถุกต้อง")
        }
      }

    }
  }

  cancel() {
    this.modalController.dismiss();
  }
  removePermit(index) {
    this.deleteAlert(index)
  }
  getItem(searchbar) {
    let q = searchbar.target.value;
    this.fillItem = this.items.filter((v) => {
      if (v.type == "ครุภัณฑ์" || v.type == "วัสดุ") {
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
  }

  getSerialItem(serial) {
    let s = serial.target.value;
    this.serialPermit = this.item.serial.filter((v) => {
      if (v.serial_item.toLocaleLowerCase().indexOf(s.trim().toLocaleLowerCase()) > -1) {
        return true;
      }
      else {
        return false;
      }
    });
  }

  selectSerial(serial) {
    this.item.serial.forEach((s,index)=>{
      if(s.serial_item == serial.serial_item && s.serial_number == serial.serial_number){
        this.index = index;
        console.log("item",this.item.serial[this.index]);
      }
    });
    this.permitOrderItem();
   
    
    

  }

  selectItem(item) {
    this.item = item;
    // console.log("item", this.item);
    this.clickAble = false;
  }
  permitOrderItem() {
    this.clickAble = true;
    if (this.permitOrder.length == 0) {
      this.permitOrder.push(
        {
          nameItem: this.item.name,
          serial_number: this.item.serial[this.index].serial_number,
          serial_item: this.item.serial[this.index].serial_item,
          unit: this.item.unit,
          amount: 1,
          id_item: this.item.id
        });

      if (this.permitOrder[this.permitOrder.length - 1].serial_item == null || this.permitOrder[this.permitOrder.length - 1].serial_number == null) {
        if (this.permitOrder[this.permitOrder.length - 1].serial_item == null) {
          this.permitOrder[this.permitOrder.length - 1].serial_item = "-"
        }
        else if (this.permitOrder[this.permitOrder.length - 1].serial_number == null) {
          this.permitOrder[this.permitOrder.length - 1].serial_number = "-"
        }
        else {
          this.permitOrder[this.permitOrder.length - 1].serial_item = this.item.serial[this.index].serial_item;
          this.permitOrder[this.permitOrder.length - 1].serial_number = this.item.serial[this.index].serial_number;
        }
      }
      this.select.push(this.item);
      this.fillItem = [];
      this.serialPermit = [];
    }
    else {
      if (!this.permitOrder[this.permitOrder.length - 1].amount) {
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกจำนวนของวัสดุ-ครุภัณฑ์");
      }
      else {
        if (this.permitOrder[this.permitOrder.length - 1].amount > 0) {
          if (this.permitOrder[this.permitOrder.length - 1].amount > this.select[this.select.length - 1].balance) {
            this.alertFillOrder("ไม่สามารถยืม" + " " + this.permitOrder[this.permitOrder.length - 1].nameItem + " " + "ได้", "กรุณากรอกจำนวนครุภัณฑ์ใหม่")
          }
          else {
            this.permitOrder.push(
              {
                nameItem: this.item.name,
                serial_number: this.item.serial[this.index].serial_number,
                serial_item: this.item.serial[this.index].serial_item,
                unit: this.item.unit,
                amount: 1,
                id_item: this.item.id,
              });
            if (this.permitOrder[this.permitOrder.length - 1].serial_item == null || this.permitOrder[this.permitOrder.length - 1].serial_number == null) {
              if (this.permitOrder[this.permitOrder.length - 1].serial_item == null) {
                this.permitOrder[this.permitOrder.length - 1].serial_item = "-"
              }
              else if (this.permitOrder[this.permitOrder.length - 1].serial_number == null) {
                this.permitOrder[this.permitOrder.length - 1].serial_number = "-"
              }
              else {
                this.permitOrder[this.permitOrder.length - 1].serial_item = this.item.serial[this.index].serial_item;
                this.permitOrder[this.permitOrder.length - 1].serial_number = this.item.serial[this.index].serial_number;
              }
            }
            this.select.push(this.item);
            this.fillItem = [];
          }
        }
        else {
          this.alertFillOrder("ไม่สามารถยืมได้", "กรอกจำนวนไม่ถุกต้อง")
        }
      }
      this.fillItem = [];
      this.serialPermit = [];
    }
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
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.permitOrder.splice(index, 1);
            this.select.splice(index, 1);
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
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.updateHistory();
            this.modalController.dismiss(permit);
            // this.modalController.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
  updateHistory() {
    let timeNow = firebase.firestore.Timestamp.fromDate(new Date());
    this.permitOrder.forEach(order => {
      if (order.serial_item != null) {
        this.items.forEach((item, key) => {
          if (order.nameItem == item.name) {

            item.serial.forEach((serial, index) => {
              if (serial.serial_item == order.serial_item) {
                item.serial.splice(index, 1);
                this.updateStock(item, key);
                this.db.collection<Item>("Items").doc(item.id).collection("Historys").add({
                  order_id: this.permitItem.order_number,
                  date_update: timeNow,
                  amount: order.amount,
                  serial: {
                    serial_item: order.serial_item,
                    serial_number: order.serial_number
                  },
                  unit: order.unit,
                  status: "borrow",
                  id_item: order.id_item,
                  update_by:this.permitItem.name_borrower
                });
                return;
              }
            });
          }
        });
      }
    });
  }
  updateStock(item, i) {
    this.permitOrder.forEach((order, index) => {
      if (item.name == order.nameItem) {
        item.balance -= order.amount * 1
        console.log("item", item);
        this.db.collection<Item>("Items").doc(item.id).update(item);
        return;
      }
    });
  }

}