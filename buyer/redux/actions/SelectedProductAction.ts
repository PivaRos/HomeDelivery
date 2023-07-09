import { Product } from "../../interfaces";

export const SelectedProductAction = (payload:Product | null) => {
    return {
        type:'setSelectedProduct',
        payload:payload
    };
}