// 서버 ip
//const ip = "http://localhost:8087/";
const ip = "https://teamspark.kr:8087/"
const api = {

  connectFetchController: async (
    path,
    method,
    body,
    callBack,
    errorCallBack
  ) => {
    return fetch(`${ip}${path}`, {
      credentials: "include",
      method: method,
      body: body ? body : null,
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log('얻은 데이터:',data);
      if (callBack) callBack(data);
      return data;
    })
    .catch(function (e) {
      if (errorCallBack) errorCallBack(e);
      console.error(e)
    });
  },

  };

export default api;
