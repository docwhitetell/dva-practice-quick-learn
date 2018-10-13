import request from '../utils/request';
// 利用官方例子中的 request函数， 封装成一个 async 函数
async function Request(options) {
  const {url, ...res} = options;
  return request(url, res);
}

function loadImage(url) {
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  })
};

function asyncLoadImages(urls) {
  return urls.reduce((promise, url)=>{
    return promise
      .then(()=>{
        return loadImage(url);
      })
      .then((res)=>{console.log(res);console.log(url + ': loaded completed!')});

  }, Promise.resolve())
}

export default {
  namespace: 'example',
  state: {
    remote: [],
    loading: true
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const {options, cb} = payload;
      const response = yield call(Request, {...options});
      const {data} = response;
      const urls = data.map((item, index)=>{
        return item.urls.regular;
      });
      const result = data.map((item, index)=>{
        return {
          bg: item.urls.regular,
          title: "Page " + (index + 1),
          description: 'What amazing about this!',
          content: "I'm page content!"
        };
      });
      yield call(asyncLoadImages, urls);
      if(typeof cb === 'function') {cb();}
      yield put({
        type: 'save',
        payload: {
          remote: result,
          loading: false
        }
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
