let url = "http://localhost:8000";

export const userActions = {
    GetUserData : async (sessionid:string) => {
      const response = await fetch(url+"/buyer", {
        method:"GET",
        headers:{
          authorization:"Gw3GdjANY5TkbS"
        }
      });
      let {User} = await response.json();
      if (User)
      {
        return User;
      }
    }
};

