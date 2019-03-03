export class PurchaseOrder{
          order_purchase:string;
          purchase_date:any;
          purchase_buy:string;
          purchase_address:string;
          name_buyer:string;
          purchase_item:Array<{
                    product_no:string;
                    product_detail:string;
                    product_amount:number;
                    product_unit:string;
                    product_price:number;
          }>
          note?:string;
      }