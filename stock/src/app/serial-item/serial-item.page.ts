import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-serial-item',
  templateUrl: './serial-item.page.html',
  styleUrls: ['./serial-item.page.scss'],
})
export class SerialItemPage implements OnInit {
  @Input() item;
  constructor(public modalController: ModalController, public alertController: AlertController, private db: AngularFirestore) { }

  serialItem: Item["serial"] = [
    {
      serial_number: null,
      serial_item: null
    }
  ]
  // addAble =false;

  ngOnInit() {
    // console.log("item", this.item);
    // console.log("increas", this.item.increas);
    // console.log("serial", this.serialItem);

  }

  addSerial() {
    // console.log("incress",this.item.increas);

    if (this.serialItem[this.serialItem.length - 1].serial_item && this.serialItem[this.serialItem.length - 1].serial_number) {
      // console.log("lenght",this.serialItem.length);
      if (this.item.increas > this.serialItem.length) {
        this.serialItem.push(
          {
            serial_number: null,
            serial_item: null
          }
        );
      }
      else {
        // this.addAble = true;
        this.alertFillOrder("คุณได้กรอกจำนวเลขสินค้าครบแล้ว", "")
      }

      // console.log("serial", this.serialItem);
    }
    else {
      // console.log("error");
      this.alertFillOrder("กรุณากรอกข้อมูลให้ครบถ้วน", "")

    }
  }
  async saveAlert() {
    // console.log(permit);
    const alert = await this.alertController.create({
      header: 'ต้องการบันทึกเลขทะเบียนสินค้าหรือไม่',
      // message: 'คุณต้องการจะเพิ่มรายการยืมใช่หรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.cancel();

          }
        }, {
          text: 'ตกลง',
          handler: () => {
            this.save();
          }
        }
      ]
    });
    await alert.present();
  }
  cancel() {
    this.modalController.dismiss();
    console.log("cancel");

  }
  save() {
    if (this.serialItem[this.serialItem.length - 1].serial_item && this.serialItem[this.serialItem.length - 1].serial_number) {
      // console.log("save");
      // this.item.serial = this.serialItem;
      this.item.balance += this.item.increas * 1;
      this.item.increas = 0;

      console.log("date", this.item.date_buy);

      if (this.item.date_buy == null) {
        this.item.date_buy = firebase.firestore.Timestamp.fromDate(new Date());
        console.log("date1", this.item.date_buy);
      }
      else {
        this.item.date_buy = firebase.firestore.Timestamp.fromDate(new Date(this.item.date_buy));
        console.log("date2", this.item.date_buy);
      }
      // console.log("lenght", this.item.serial.length);
      
      if (this.item.serial.length == 0) {
        this.item.serial = this.serialItem;
      } else {
        this.serialItem.forEach(serial => {
          this.item.serial.push(serial);
        });
      }
      if(this.item.buy_place == ""){
        this.item.buy_place = "-";
      }
      if (this.item.id == undefined) {
        this.db.collection("Items").add(this.item);
      }
      else {
        this.db.collection("Items").doc(this.item.id).update(this.item);
      }
      this.modalController.dismiss(this.item);
    }
    else {
    }
    console.log("item",this.item);
    
  }

  async alertFillOrder(head, text) {
    const alert = await this.alertController.create({
      header: head,
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  removePermit(index) {
    this.serialItem.splice(index, 1);
  }


}
