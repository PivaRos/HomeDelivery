import { LocationObject } from "../interfaces";

let url = "http://10.0.0.24:8000";



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
      let data = await response.json();
      if (data)
      {
        return data.data;
      }
    }catch(e){
        console.log(e);
    }
    })
    
};