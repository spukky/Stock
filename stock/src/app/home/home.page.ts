import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from '../item';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { permitItem } from '../permit-item';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  itemDB: Observable<Item[]>;
  items: Item[] = [];
  permitItems:permitItem[]=[];
  permitDB: Observable<permitItem[]>;
  constructor(private router: Router,private db: AngularFirestore ){
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

    this.permitDB = db.collection<permitItem>("PermitItems").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        });
      }));
    this.permitDB.subscribe(res => {
      this.permitItems = res;
    });



  }
  
  ngOnInit(){

  }

  listPremitStock(){
    this.router.navigateByUrl('/list-permit-stock');
  }
  
  listStock(){
    this.router.navigateByUrl('/list-stock');
  } 
}
