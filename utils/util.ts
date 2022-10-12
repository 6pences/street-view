var QQMapWX = require('../lib/qqmap-wx-jssdk');

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
const app = getApp()
const $http = app.http
const $api = app.api

export const getLocation = (cb: any) => {
    const qqmapsdk = new QQMapWX({ key: 'Z4GBZ-O533G-BDCQC-IWMGZ-ODEYO-EIB2S'});
  wx.getLocation({
    type: 'gcj02',
    success: (location) => {
      app.globalData.mapLocation = location
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }, success: (res: any) => {
          if (typeof cb === 'function') cb(res)
          let addParam = {
            address: res.result.address,
            lat: location.latitude + '',
            lon: location.longitude + ''
          }
          let userInfo = wx.getStorageSync('user');
          if (res.message == 'query ok' && userInfo) $http.askFor($api.location.add, addParam).then((data) => {}) // 用户登录则上传位置信息
        }, fail: (res: any) => {}
      });
    }, complete: () => {}
  })
}

const getCurrentPage = () => {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let url = currentPage.route; //当前页面url
  return url
}

// module.exports = {
//   formatTime: formatTime,
//   getLocation: getLocation,
//   getCurrentPage: getCurrentPage
// }