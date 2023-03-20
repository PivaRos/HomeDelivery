let url = "http://localhost:5000";

export const userActions = {
    GetUserData : async (sessionid:string) => {
      const response = await fetch(url+"/", {
        method:"GET"
      });
      let {User} = await response.json();
      if (User)
      {
        return User;
      }
    }
};

