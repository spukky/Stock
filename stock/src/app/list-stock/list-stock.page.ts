import { Component, OnInit } from '@angular/core';
import { mockItems } from '../mock-items';
import { ModalController } from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page';
import { Item } from '../item';
import { EditItemPage } from '../edit-item/edit-item.page';
import { InfoItemPage } from '../info-item/info-item.page';


@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.page.html',
  styleUrls: ['./list-stock.page.scss'],
})
export class ListStockPage implements OnInit {

  public isSearchbarOpen = false;

  constructor(public modalController: ModalController) { }
  items = mockItems;
  selectItem:Item;
  ngOnInit() {
  }
  infoItem(item){
  this.selectItem = item;
  console.log(this.selectItem);
    this.infoItemmodal();
  }

  editItem(item){
    console.log("edit");
    this.selectItem = item;
    console.log(this.selectItem);
    this.editItemModal();
  }
  addItem(){
    console.log("Add");
    this.addItemModal();
    
  }
  async addItemModal(){
    const modal = await this.modalController.create({
      component:AddItemPage,
    });
    modal.onDidDismiss().then((data) =>{
      console.log(data.data);
      if(data.data != null){
        this.items.push(data.data);
      }
    });
    return await modal.present();
  }

 async editItemModal(){
   console.log("edit");
   
  const modal = await this.modalController.create({
    component:EditItemPage,
    componentProps:{
      item: this.selectItem
    }
  });
  modal.onDidDismiss().then((data) =>{
    console.log(data.data);
    if(data.data != null){
  
    }
  });
  return await modal.present();
 }

 async infoItemmodal(){
  console.log("Info");
  const modal = await this.modalController.create({
    component: InfoItemPage,
    componentProps:{
      item: this.selectItem
    }
  });
  return await modal.present();
 }

}
