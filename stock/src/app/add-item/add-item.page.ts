import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { ModalController, AlertController } from '@ionic/angular';
import { mockItems } from '../mock-items';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {
  
  constructor(public modalController : ModalController,public alertController: AlertController) {
    
  }
  items:Item[] = mockItems;
  item:any
  select:Item;
  addItemOpen = false;
  index:number;
  ngOnInit() {
  }
  save(){

    if(this.items[this.index].type == null ){
      this.modalController.dismiss();
    }
    else{
      this.items.forEach((value,i) =>{
        if(value.name == this.select.name){
          this.items[i].balance = parseInt(this.items[i].balance)  + parseInt(this.select.increas) ;
          this.modalController.dismiss();
        }
      });
    }
  }
  initialItem(){
    this.item = this.items;
  }
  cancel(){
    this.modalController.dismiss();
  }
  getItem(searchbar){
    this.initialItem();
    let q = searchbar.target.value;
    
    
    if(!q){
      return;    
    }
    this.item = this.item.filter((v) =>{
      if(v.name && q.trim() != ''){
        if(v.name.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) > -1){
          return true;
        }
        return false;
      }
    });
    
    
  }
  
  selectItem(select){
    
    this.select= select;
    this.addItem();
  }
  addItem(){
    this.addItemOpen = true;
    
    
    
  }
  
  
  
  
}
