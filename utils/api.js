module.exports = {
    // 查询街景的城市列表
    getCities: {
      path: '/streetScap/queryStreetScapCity',
      method: 'GET',
      tokenFree: true
    },
    // 查询街景的城市列表并包含三个街景
    getCitiesWithStreeViews: {
      path: '/streetScap/queryStreetScapCityAndScap',
      method: 'GET',
      tokenFree: true
    },
    // 查询街景或根据地区查询
    getStreeViewsByArea: {
      path: '/streetScap/queryStreetScap',
      method: 'POST',
      tokenFree: true
    },
    // 登陆传给后台位置信息
    findConfigAddress:{
      path: '/config/findConfigAddress',
      method: 'post',
      tokenFree: true
    },
    // 获取地址是否收费
    findConfigColumn:{
      path: '/config/findConfigColumn',
      method: 'post',
      tokenFree: true
    }
  }
  