import { Component, OnInit, Input } from '@angular/core';
import { permitItem } from "../permit-item";
import { AlertController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { Item } from '../item';
@Component({
  selector: 'app-add-permit',
  templateUrl: './add-permit.page.html',
  styleUrls: ['./add-permit.page.scss'],
})
export class AddPermitPage implements OnInit {
  @Input() permit: permitItem[];
  @Input() item: Item[];
  permitOrder: permitItem["permit_order"]=[];
  //  = [{
  //   nameItem: null,
  //   serial_number: null,
  //   serial_item: null,
  //   unit: null,
  //   amount: null,
  // }];

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
  select: Item;
  constructor(public alertController: AlertController, public modalController: ModalController) { }

  ngOnInit() {
    // console.log("permit", this.permit);
    // console.log("item", this.item);
  }

  addPermit() {

    let order = this.permitOrder[this.permitOrder.length - 1];
    if (order.nameItem == null || order.amount == null || order.unit == null) {
      if (order.nameItem == null) {
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลชื่อรายการ");
      }
      else if (order.amount == null) {
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลจำนวนชิ้นของรายการที่ยืม");
      }
      else if (order.unit == null) {
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลหน่วยของรายการที่ยืม");
      }
    }
    else {
      this.permitOrder.push(
        {
          nameItem: null,
          serial_number: null,
          serial_item: null,
          unit: null,
          amount: null,
        });
    }
  }
  save() {
    let order = this.permitOrder[this.permitOrder.length - 1];
    if (order.nameItem == null || order.amount == null || order.unit == null || this.permitItem.order_number == null
      || this.permitItem.name_borrower == null || this.permitItem.department == null || this.permitItem.objective == null) {
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
    console.log("q", q);
    this.fillItem = this.item.filter((v) => {
      if (v.name && q.trim()) {
        if (v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()) > -1) {
          return true;
        }
        else {
          return false;
        }
      }
    });
    console.log("item", this.fillItem);
  }

  selectItem(item) {

    
    if(this.permitOrder.length > 1){
      if(this.permitOrder[this.permitOrder.length - 1].amount == null){
        this.alertFillOrder("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลจำนวนชิ้นของรายการที่ยืม");
      }
      else{
        this.permitOrder.push(
          {
            nameItem: null,
            serial_number: null,
            serial_item: null,
            unit: null,
            amount: null,
          });
        console.log("item", item);
        this.select = item;
        if (!item.serial_item || !item.serial_number) {
          this.permitOrder[this.permitOrder.length - 1].serial_item = "-";
          this.permitOrder[this.permitOrder.length - 1].serial_number = "-";
        }
        else {
          this.permitOrder[this.permitOrder.length - 1].serial_item = item.serial_item;
          this.permitOrder[this.permitOrder.length - 1].serial_number = item.serial_number;
        }
        this.permitOrder[this.permitOrder.length - 1].nameItem = item.name;
        this.permitOrder[this.permitOrder.length - 1].unit = item.unit;
      }
    }
    else{
      this.permitOrder.push(
        {
          nameItem: null,
          serial_number: null,
          serial_item: null,
          unit: null,
          amount: null,
        });
      console.log("item", item);
      this.select = item;
      if (!item.serial_item || !item.serial_number) {
        this.permitOrder[this.permitOrder.length - 1].serial_item = "-";
        this.permitOrder[this.permitOrder.length - 1].serial_number = "-";
      }
      else {
        this.permitOrder[this.permitOrder.length - 1].serial_item = item.serial_item;
        this.permitOrder[this.permitOrder.length - 1].serial_number = item.serial_number;
      }
      this.permitOrder[this.permitOrder.length - 1].nameItem = item.name;
      this.permitOrder[this.permitOrder.length - 1].unit = item.unit;
      
    }
this.fillItem = [];
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

          }
        }
      ]
    });

    await alert.present();
  }
  async alertFillOrder(head, text) {
    console.log(text);

    const alert = await this.alertController.create({
      header: head,
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

  async saveAlert(permit) {
    console.log(permit);

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
            this.modalController.dismiss(permit);
          }
        }
      ]
    });
    await alert.present();
  }
}