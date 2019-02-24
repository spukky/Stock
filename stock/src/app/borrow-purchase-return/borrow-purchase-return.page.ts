import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';


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
  // readAble = true;
  returnAble = false;
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
   this.mode = mode;
   this.activeSelect = true;
 }
 selectItem(item){
 this.select = item;
 this.activeAmout = true;
 
 }
 return(item){
  //  console.log("returnAble",this.returnAble);
   
 this.items.forEach((items) => {
   if(items.item === item.item){
     items.amount = items.amount*1 + item.amount*1 ;
     this.history.push({
      item: item.item,
      amount: item.amount,
      status: "return"
     });
     return ;
   }
 });
 this.returnAble = true;
//  console.log("returnAble",this.returnAble);
 }
save(){
    this.items.forEach((item) =>{
      if(item.item === this.select.item){
        if(this.mode == "borrow"){
          console.log("borrow");
            item.amount -= this.amount; 
            this.history.push({
              item: this.select.item,
              amount: this.amount,
              status: "borrow"
            });
            this.amount = null;
            this.select = [];
            this.activeAmout = false;
            
//  console.log("returnAble",this.returnAble);
        }
        else if(this.mode == "purchase"){
          console.log("purcase");
            item.amount = this.amount*1 + item.amount*1 ; 
            this.history.push({
              item: this.select.item,
              amount: this.amount,
              status: "purcase"
            });
            this.amount = null;
            this.select = [];
            this.activeAmout = false;
        }
      }
    });


}
async alertFillOrder(head, text) {
  const alert = await this.alertController.create({
    header: head,
    message: text,
    buttons: ['OK']
  });
  await alert.present();
}

}
