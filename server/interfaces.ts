import { type ObjectId, Timestamp, type WithId, type Document, Decimal128, Double } from 'mongodb'

export enum Pages {
  Stores = 'Stores',
  Orders = 'Orders',
  Account = 'Account',
  Home = 'Home'
}

export interface availableStores {
  Closed: Store[]
  Open: Store[]
}

export interface RootStackParamList {
  ViewStore: { id: number } | undefined
  tabs: { id: number } | undefined
}

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
  sessionid: string
}

export enum order_status {
  pending = 1,
  cancelled = 0,
  accepted = 2,
  onDelivery = 3,
  done = 4
}

export interface Product {
  available: boolean
  name: string
  price: PriceObject
  info: string
  mainimage: string
  images: string[]
  category: string
}

export interface PriceObject {
  price: number
  currency: string
}

export enum LocationType {
  point = 'point',
  address = 'address'
}

export interface LocationObject {
  type: LocationType
  coordinates?: number[]
  address?: string
}

export interface Store extends WithId<Document> {
  _id: ObjectId
  logo: string
  name: string
  products: Product[]
  authorizedUsers: string[]
  location: LocationObject
  deliveryDistance: number
  openHoursObject: openHoursObject
  category: store_category
}

export interface openHoursObject {
  openFrom: number
  closedFrom: number
}

export interface Account {
  type: account_type
  username: string
  password: string
  phoneNumber: string
  _id?: ObjectId
  sessionid: string
  location: LocationObject
  deliveryDistance?: number
}

export interface Order {
  _id?: ObjectId
  seller: ObjectId
  buyer: ObjectId
  date: dateObject
  products: productOrder[]
  totalPrice: number
  location: LocationObject
  city: string
  street: string
  homenumber: string
  zipcode: string
  delivery?: ObjectId
  status: order_status
}

export interface dateObject {
  date: Date
  timestamp: number
}

export interface dataObject {
  err: boolean
  msg: string
  data: any
  nor?: number 	// number of tries

}

export interface productOrder {
  productId: ObjectId
  details: {

  }
}

export interface PaymentLog {
  accepted: boolean
  priceCharged: number
  timestamp: number
}
