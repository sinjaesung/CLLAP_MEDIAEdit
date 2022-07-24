
// 서버 ip
const ip = "https://teamspark.kr:8080/"
// const ip = "http://localhost:8080/";

const api = {

  connectFetchController: async (
    path,
    method,
    body,
    callBack,
    errorCallBack
  ) => {
    return fetch(`${ip}${path}`, {
      method: method,
      body: body ? body : null,
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (callBack) callBack(data);
      return data;
    })
    .catch(function (e) {
      if (errorCallBack) errorCallBack(e);
      console.error(e)
    });
  }
}
export default api;
  // connectFetchController : async (path,method,body,callBack,errorCallBack) =>{
  //   // alert("token : " + JSON.stringify(jwtToken));
  //   return fetch(`${ip}${path}`, {
  //     credentials:'include',
  //     method: method,
  //     headers: {
  //       'Authorization' : `Bearer ${jwtToken}`,
  //       'Connection' : 'keep-alive',
  //     },
  //     body:body?body:null,
  //   }).then(function(res) {
  //     return res.json();
  //   }).then(function(data) {
  //     if(callBack)
  //       callBack(data);
  //     return data;
  //   }).catch(function(e){
  //     if(errorCallBack)
  //       errorCallBack(e);
  //   });
  // },
   

