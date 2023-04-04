import { uri } from "../envVars";
import { dataObject, dateObject, LocationObject, store_category } from "../interfaces";

let url = uri;



export const storeActions =  {
    GetStores : (async (location:LocationObject, store_category:store_category) => {
    try{
      const response = await fetch(url+"publicbuyer/get/stores", {
        headers: {
          "Content-Type": "application/json"
        },
        method:"POST",
        body:JSON.stringify({
          location: location,
          store_category:store_category
        })
      });
      let data:dataObject = await response.json();
      if (data)
      {
        return data.data;
      }

    }catch(e){
        console.log(e);
    }
    })
    
};