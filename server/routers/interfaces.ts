import { Double, ObjectId } from "mongodb"




export interface ProductObject {
    name: string,
    price: number,
    info: string,
    mainimage: string
    images: string[]
}

export interface LocationObject {
    type: string,
    coordinates: Double[]
}


export interface Sellers {
    _id: ObjectId,
    logo: string,
    name: string,
    products: ProductObject[],
    authorizedUsers: string[],
    location: LocationObject,
    deliveryDistance: number
}
