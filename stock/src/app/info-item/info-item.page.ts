import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { ModalController } from '@ionic/angular';
import { EditItemPage } from '../edit-item/edit-item.page';

@Component({
  selector: 'app-info-item',
  templateUrl: './info-item.page.html',
  styleUrls: ['./info-item.page.scss'],
})
export class InfoItemPage implements OnInit {
  @Input() item:Item
  constructor(public modalController: ModalController) { }

  ngOnInit() {
 
    
  }
  // editItem(){
  //   this.editItemModal();
  // }
  // async editItemModal(){
  //   const modal = await this.modalController.create({
  //     component: EditItemPage,
  //     componentProps:{

  //     }
  //   });
  //   return await modal.present();
  // }
}
