export class permitItem{
    order_number:string; //เลขรายการยืม
    date_premit:any;
    name_borrower:string;
    department:string; // หน่วยงาน
    objective:string; //วัตถุประสงค์
    permit_order: Array<{
        nameItem:string;
        serial_number:string;
        serial_item:string;
        unit:string;
        amount:number; //จำนวนวัสดุครุภัณฑ์ที่ยืม 
    }>;
    approvers:string;
    note?:string;
    status:string;
}