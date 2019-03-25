export class History {
          order_id?: string;
          date_update: any;
        //   name_item: string;
        //   id:string;
          price?: number;
          status: string; //ยืม/คืน/ซื้อเพิ่ม/สูญหาย/ชำรุด
          amount?: number;
          buy_place?: string;
          update_by: string;
          unit:string;
          serial?:{
                    serial_number:string;
                    serial_item:string;
                };
          id_item:string;
}