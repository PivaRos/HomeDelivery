import { ObjectId, Timestamp, WithId, Document } from "mongodb"


export enum Pages {
    Stores = "Stores",
    Orders = "Orders",
    Account = "Account",
    Home = "Home"
}

export interface availableStores {
    Closed: Store[];
    Open: Store[];
}


export type RootStackParamList = {
    ViewStore: { id: number } | undefined;
    ViewProduct: { id: number } | undefined
    tabs: { id: number } | undefined;
};


export enum account_type {
    Seller = 2,
    Buyer = 1,
    Delivery = 3,
    Support = 4,
    Admin = 5

}

export enum store_category {
    food = 1,
    homeMade = 2
}




export interface StorageData {
    sessionid: string;
}

export enum order_status {
    pending = 1,
    cancelled = 0,
    accepted = 2,
    onDelivery = 3,
    done = 4
}

export interface Product {
    _id:ObjectId,
    available: boolean,
    name: string,
    price: PriceObject,
    info: string,
    mainimage: string
    images: string[],
    category: string
    options: Option[] | null | undefined
    selectedOptions?:selectedOption[] | null | undefined; 
}

export interface Option {
    optionProducts: ObjectId[],
    maxPicks: number,
    additionalAllowed: boolean,
    additionalMax: number,
    additionalPricePerUnit: PriceObject,
    useOwnPrice: boolean,
    name: string

}


export interface selectedOption{
    selectedOptionProducts: ObjectId[],
    _id:ObjectId
}

export interface PriceObject {
    price: number,
    currency: string
}
export enum LocationType {
    point = "point",
    address = "address"
}

export interface LocationObject {
    type: LocationType
    coordinates?: number[]
    address?: string
}


export interface Store extends WithId<Document> {
    _id: ObjectId,
    logo: string,
    name: string,
    products: Product[],
    authorizedUsers: string[],
    location: LocationObject,
    deliveryDistance: number,
    openHoursObject: openHoursObject,
    category: store_category,
    optionProducts: optionProduct[]
}

export interface optionProduct {
    _id: ObjectId,
    image: string,
    name: string,
    category: string,
    ownPrice: PriceObject
}



export interface openHoursObject {
    openFrom: number,
    closedFrom: number
}

export interface Account {
    type: account_type,
    username: string,
    password: string,
    phoneNumber: string,
    _id?: ObjectId,
    sessionid: string,
    location: LocationObject,
    deliveryDistance?: number
}

export interface product_option {

}


export interface Order {
    _id?: ObjectId,
    seller: ObjectId | undefined | null,
    buyer: ObjectId | undefined | null,
    date: dateObject,
    selecedProdcuts: Product[],
    totalPrice: PriceObject,
    location: LocationObject,
    city: string | undefined | null,
    street: string | undefined | null,
    homenumber: string | undefined | null,
    zipcode: string | undefined | null,
    delivery?: ObjectId,
    status: order_status
}

export interface dateObject {
    date: Date,
    timestamp: number
}


export interface dataObject {
    err: boolean
    msg: string,
    data: any,
    nor?: number 	//number of tries

}



export interface productOrder {
    productId: ObjectId,
    details: {

    }
}

export interface PaymentLog {
    accepted: boolean,
    priceCharged: number,
    timestamp: number
}