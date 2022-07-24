const ip = "https://teamspark.kr:8080/api/"
//const ip = "http://localhost:8080/api/";
const mediaProcessip = "http://teamspark.kr:8080/api/";//api/apiname형태로 바로 
//const mediaProcessip = `${ip}api/`;

const api = {
  connectFetchController : async (path,method,body,callBack,errorCallBack) =>{
     console.log('connectFetchController호출:',path,method,body);
     return fetch(`${mediaProcessip}${path}`, {
        //credentials:'include',
        method: method,
        body:body?body:null,
        
      }).then(function(res) {
         console.log('클라이언트 단 얻어낸 데이터:',res);
        return res.json();
      }).then(function(data) {
        if(callBack)
          callBack(data);
        return data;
      }).catch(function(e){
        if(errorCallBack)
          errorCallBack(e);
      });
    },
}

export default api;