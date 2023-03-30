import { uri } from "../envVars";
import { dataObject, dateObject, LocationObject } from "../interfaces";

let url = uri;



export const storeActions =  {
    GetStores : (async (location:LocationObject) => {
    try{
      const response = await fetch(url+"publicbuyer/get/sellers", {
        headers: {
          "Content-Type": "application/json"
        },
        method:"POST",
        body:JSON.stringify({location: location})
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