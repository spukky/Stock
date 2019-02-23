import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReturnItemPage } from '../return-item/return-item.page';

@Component({
  selector: 'app-borrow-purchase-return',
  templateUrl: './borrow-purchase-return.page.html',
  styleUrls: ['./borrow-purchase-return.page.scss'],
})
export class BorrowPurchaseReturnPage implements OnInit {

  constructor(public alertController: AlertController) { }
  select:any;
  amount: number ;
  mode:string;
  activeAmout = false;
  activeSelect = false;
  readAble = true;
  items = [
    {
      item:"item1",
      amount: 10,
    },
    {
      item:"item2",
      amount: 5
    },
  ]
  history:any[]=[];
  ngOnInit() {
  }
 modeItem(mode){
   console.log("mode",mode);
   this.mode = mode;
   this.activeSelect = true;
 }
 selectItem(item){
 this.select = item;
 console.log("select",this.select);
 this.activeAmout = true;
 
 }
 return(item){
 this.items.forEach((items) => {
   if(items.item === item.item){
     items.amount = items.amount*1 + item.amount*1 ;
     this.history.push({
      item: item.item,
      amount: item.amount,
      status: "return"
     });
     this.readAble = false;
     return ;
   }
 })
 }
save(){
  console.log("select",this.select);
  console.log("mode",this.mode);
  console.log("amount",this.amount);
  
  
  this.items.forEach((item) =>{
    // console.log("item",item);
    
    if(item.item === this.select.item){
      if(this.mode == "borrow"){
        console.log("borrow");
        if(this.select.amount < this.amount){
          this.alertFillOrder("ยืมไม่ได้","จำนวนไม่ถูกต้อง");
        }
        else{
          item.amount -= this.amount; 
          this.history.push({
            item: this.select.item,
            amount: this.amount,
            status: "borrow"
          });
          console.log("history",this.history);
          console.log("item new",this.items);
          this.amount = null;
          this.select = [];
          this.activeAmout = false;
        }
      }
      else if(this.mode == "purchase"){
        console.log("purcase");
        if(this.amount <0){
          this.alertFillOrder("เพิ่มไม่ได้","จำนวนไม่ถูกต้อง");
        }
        else{
          item.amount = this.amount*1 + item.amount*1 ; 
          this.history.push({
            item: this.select.item,
            amount: this.amount,
            status: "purcase"
          });
          console.log("history",this.history);
          console.log("item new",this.items);
          this.amount = null;
          this.select = [];
          this.activeAmout = false;
        }
 
      }
    }

  })

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

}
