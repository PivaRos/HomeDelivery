import { dataObject, dateObject, LocationObject } from "../interfaces";

let url = "http://192.168.68.106:8000";



export const storeActions =  {
    GetStores : (async (location:LocationObject) => {
    try{
      const response = await fetch(url+"/publicbuyer/get/sellers", {
        headers: {
          "Content-Type": "application/json"
        },
        method:"POST",
        body:JSON.stringify({location: location})
      });
      let data:dataObject = await response.json();
      console.log(data);
      if (data)
      {
        return data.data;
      }

    }catch(e){
        console.log(e);
    }
    })
    
};