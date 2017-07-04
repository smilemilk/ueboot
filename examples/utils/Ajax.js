/**
 * Created by Richard on 17/4/7.
 */
/**
 * 封装http请求，便于统一处理请求和返回
 */
import Vue from "vue";
import iView from 'iview'
Vue.use(iView);
let context = "/";
let unauthorizedUrl = null;

const method = {
  'POST': 'POST',
  'GET': 'GET',
  'DELETE': 'DELETE',
  'PUT': 'PUT'
};


function handleIterceptors(emulateJSON) {
  Vue.http.options.emulateJSON = emulateJSON;
  Vue.http.interceptors.push( (request, next)=> {
    iView.LoadingBar.start();
    next((response) => {
      iView.LoadingBar.finish();
      return response;
    });
  });
}

function handleSuccessResponse(response, resolve, reject) {
  let status = response.status;
  if (status === 200) {
    if (typeof(resolve) == "function") {
      resolve(response.body);
    }
  } else {
    if (typeof(reject) == "function") {
      reject(response.body);
    }
  }
}


function handleErrorResponse(response, reject) {
  iView.LoadingBar.error();
  let status = response.status;
  let processor = false;
  if (typeof(reject) == "function") {
    processor = reject(response.body);
    if (processor) return;
  }

  if (status === 500) {
    iView.Message.error(response.body.message);
    return;
  }

  if (status === 401) {
    //未登录，重定向到初始化页面
    console.log(response.body);
    iView.Message.info("尚未登录，请先登录!");
    unauthorized();
  }
}

function unauthorized() {
  // 跳转到其他路径
  if (unauthorizedUrl) {
    window.location.href = unauthorizedUrl;
  }
}


export default {

  post(url, params) {
    return new Promise( (resolve, reject)=> {

      handleIterceptors(false);
      if (!url.startsWith(context)) {
        url = context + url;
      }
      Vue.http.post(url, params).then(response => {
        handleSuccessResponse(response, resolve, reject);
      }, response => {
        handleErrorResponse(response, reject);
      });
    });
  },

  postForm(url, params) {
    return new Promise( (resolve, reject) =>{

      handleIterceptors(true);
      if (!url.startsWith(context)) {
        url = context + url;
      }
      Vue.http.post(url, params).then(response => {
        handleSuccessResponse(response, resolve, reject);
      }, response => {
        handleErrorResponse(response, reject);
      });
    });
  },

  get(url, params) {
    return new Promise( (resolve, reject)=> {

      handleIterceptors(true);
      if (!url.startsWith(context)) {
        url = context + url;
      }
      Vue.http.get(url, params).then(response => {
        handleSuccessResponse(response, resolve, reject);
      }, response => {
        handleErrorResponse(response, reject);
      });
    });
  },

  put(url, params) {
    return new Promise( (resolve, reject)=> {
      if (!url.startsWith(context)) {
        url = context + url;
      }
      Vue.http.put(url, params).then(response => {
        handleSuccessResponse(response, resolve, reject);
      }, response => {
        handleErrorResponse(response, reject);
      });
    });
  },
  config (options) {
    if (options.context) {
      context = options.context;
    }
    if (options.unauthorizedUrl) {
      unauthorizedUrl = options.unauthorizedUrl;
    }
  }
};

// export default new Ajax("http://localhost:8888");
