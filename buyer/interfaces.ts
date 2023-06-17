import { ObjectId, Timestamp, WithId, Document } from "mongodb"
import * as Location from 'expo-location';


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
    ViewCheckout: { id: number } | undefined
    ViewOrder: { id: number } | undefined;
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


export interface openHoursObject {
    openFrom: number,
    closedFrom: number
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
    _id: ObjectId,
    available: boolean,
    name: string,
    price: PriceObject,
    info: string,
    mainimage: string
    images: string[],
    category: string,
    options: Option[] | null | undefined,
    units?: number,
}

export interface Option {
    _id: ObjectId,
    optionProducts: ObjectId[],
    selectedOptionProducts?: {
        selected: boolean,
        units: number;
    }[],
    mustPicks: number,
    maxPicks: number,
    additionalAllowed: boolean,
    additionalMax: number,
    additionalPricePerUnit: PriceObject,
    useOwnPrice: boolean,
    name: string

}


export interface selectedOption {
    selectedOptionProducts: ObjectId[],
    _id: ObjectId
}

export interface PriceObject {
    price: number,
    currency: string
}

export interface Address {
    city: string
    street: string
    houseNumber: number
    apartmentNumber: number
    deliveryNotes: string

}


export interface Store extends WithId<Document> {
    _id: ObjectId
    logo: string
    name: string
    products: Product[]
    authorizedUsers: string[]
    location: Location.LocationObject
    deliveryDistance: number
    openHoursObject: openHoursObject
    category: store_category
    optionProducts: optionProduct[]
    minOrder?: PriceObject
    avgDelivery: number//min
}


export interface optionProduct {
    _id: ObjectId,
    image: string,
    name: string,
    category: string,
    ownPrice: PriceObject
}



export interface Account {
    type: account_type,
    username: string,
    password: string,
    phoneNumber: string,
    _id?: ObjectId,
    sessionid: string,
    location: Location.LocationObject,
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
    location: Location.LocationObject,
    address:Location.LocationGeocodedAddress
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



export interface PaymentLog {
    accepted: boolean,
    priceCharged: number,
    timestamp: number
}