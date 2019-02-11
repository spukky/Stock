import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {
@Input() item:Item;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.item);

    
  }
  editItem(){
    this.modalController.dismiss(this.item);
    console.log(this.item);
    
  }
  cancel(){
    this.modalController.dismiss();
  }
}
