import { ObjectId, Timestamp, WithId, Document } from "mongodb"




export interface productObject {
    name: string,
    price: number,
    info: string,
    mainimage: string
    images: string[]
}

export interface LocationObject {
    type: string,
    coordinates:number[]
}


export interface Seller extends WithId<Document> {
    _id: ObjectId,
    logo: string,
    name: string,
    products: productObject[],
    authorizedUsers: string[],
    location: LocationObject,
    deliveryDistance: number
}

export interface Account {
	type:1|2|3|4|5    //"seller"(2)/"buyer"(1)/"delivery"(3)/"support"(4)/"admin"(5),
	username:string,
	password:string,
    phoneNumber:string,
 	_id?:ObjectId,
	sessionid:string,
	location:LocationObject,
    deliveryDistance?:number
}


export interface Order{
	_id?:ObjectId,
	seller: ObjectId,
	buyer:ObjectId,
	date:dateObject
	products:productOrder[],
	totalPrice:number,
    location:LocationObject,
	city:string,
	street:string,
	homenumber:string,
    zipcode:string,
	delivery?:ObjectId,
	status:0|1|2|3|4 //cancelled(0)/pending(1)/accepted(2)/onDelivery(3)/done(4)
}

export interface dateObject {
    date:Date,
    timestamp:number
}



export interface productOrder {
    productId : ObjectId,
    details:{
        
    }
}

export interface PaymentLog {
    accepted:boolean,
    priceCharged:number,
    timestamp:number
}