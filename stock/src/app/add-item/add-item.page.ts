import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { ModalController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {
  
  constructor(public modalController : ModalController,public alertController: AlertController) {
    
  }
  @Input() items:Item[];
  item:any
  select:Item = {
    type:null,
    group:null,
    name:null,
    list:null,
    model:null,
    brand:null,
    price:null,
    balance:null,
    unit:null,
    buy_place:null,
    keep_place:null,
    attendant:null
  };
  addItemOpen = false;
  readable = true;
  newItem = false;
  ngOnInit() {
    // console.log(this.items);
  }
  async fillAlert(){
    console.log("alert");
    const alert = await this.alertController.create({
      header:"Warning",
      message:"กรุณากรอกข้อมูลให้ครบถ้วน",
      buttons:['OK']
    });
    await alert.present();
  }
  save(){
    if(this.newItem == true){
      console.log("newitem");
      
      if(this.select.type == null || this.select.group== null || this.select.list== null || this.select.name == null || this.select.model == null || this.select.brand == null || this.select.increas == null ){
        console.log("fill");        
        this.fillAlert();
        return 0;
      }
      else{
        this.select.balance = this.select.increas*1;
        if(this.select.date_buy == null){
          this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date());
          console.log(this.select.date_buy);
        }
        else{
          this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date(this.select.date_buy));
          console.log(this.select.date_buy);
        }
        
        console.log(this.select);
        this.readable = true;
        this.newItem = false;
      }
    }
    else {
      this.select.balance = (this.select.balance*1) + (this.select.increas*1);
      if(this.select.date_buy == null){
        this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date());
        console.log("1",this.select.date_buy);
      }
      else if(this.select.date_buy.seconds){
        this.select.date_buy = this.select.date_buy
        console.log("3",this.select.date_buy);
      }
      else{
        this.select.date_buy = firebase.firestore.Timestamp.fromDate(new Date(this.select.date_buy));
        console.log("2",this.select.date_buy);
      }
      console.log(this.select);
      
    } 

      console.log("not null");
      this.modalController.dismiss(this.select);
      this.select.increas =0;
      this.addItemOpen = false;

    
  }
  initialItem(){
    // this.item = this.items;
  }
  cancel(){
    this.modalController.dismiss();
  }
  getItem(searchbar){
    // this.initialItem();
    let q = searchbar.target.value;
    if(!q){
      return;    
    }
    this.item = this.items.filter((v) =>{
      console.log("q",q);
      console.log( "q.trim()",q.trim());
      if(v.name && q.trim() != ''){
        if(v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()) > -1){
          console.log("indexof",v.name.toLocaleLowerCase().indexOf(q.trim().toLocaleLowerCase()));
         
          return true;
        }
        else{
          return false;
        }
      }
    });
  }
  
  selectItem(select){
    
    this.select= select;
    console.log(this.select);
    this.addItem();
  }
  addItem(){
    this.addItemOpen = true;
  }
  
  addNewItem(){
    this.addItem();
    this.readable = false;
    console.log("newItem");
    this.newItem = true
    console.log(this.newItem);
    
    
  }
  
  
}
