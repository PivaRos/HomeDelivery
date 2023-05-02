import { View, Text } from "react-native";
import { Order } from "../../interfaces";
import ProductSumTab from "../../components/product/productSumTab";



interface props {
    Order: Order;
}

export const ViewOrder = (props: props) => {

    return (<View>
        {props.Order.selecedProdcuts.map((Product, index) => {
            return <ProductSumTab Product={Product} key={index} />
        })}
    </View>);
}