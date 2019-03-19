export class Item {
    type: string;
    group: string;
    name: string;
    list: string;
    model: string;
    brand: string;
    price: number;
    balance: number;
    unit: string;
    buy_place: string;
    keep_place: string;
    attendant: string;
    date_buy?: any;
    note?: string;
    project?: string;
    increas?: number
    id?: string;
    serial?: Array<{
        serial_number:string;
        serial_item:string;
    }>;
    date_update?:any;
}