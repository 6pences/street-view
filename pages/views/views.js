// pages/views/views.ts
import http from '../../utils/http';
import api from '../../utils/api';
var QQMapWX = require('../../lib/qqmap-wx-jssdk');
import { getLocation } from '../../utils/util';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        basicInfo: { // 基本配置
            appName: '北斗智寻',
            appPackage: 'wx.tenth.friendtrack',
            appVersion: '2',
            appVersionName: '',
            agencyChannel: 'miniProgram',
            appMarket: 'miniProgram',
            application: 'street'
        },
        qqmapsdk: new QQMapWX({ key: 'Z4GBZ-O533G-BDCQC-IWMGZ-ODEYO-EIB2S'}),
        city: '',
        QRCode: '',
        isShowQRCode: false,
    },

    // 跳转腾讯地图
    toMap: function (event) {
        // const url = event.currentTarget.dataset.url;
        const url = 'https://www.haichuang-tech.com/indexjj.html';
        //jq/qjkapp/1877
        if (this.data.isShowQRCode) {
            wx.previewImage({ current: '', urls: [this.data.QRCode] });
        } else {
            wx.navigateTo({ url: `../url/url?url=${url}` });
        }
    },

    getCities: function() {
        http.askFor(api.getCities, {
        }).then((res) => {
            // console.log(res);
            if (res.code === 20000) {
            }
        })
    },


    getCitiesWithStreeViews: function () {
        http.askFor(api.getCitiesWithStreeViews, {
            pageSize: 99,
            pageNum: 1
        }).then((res) => {
            if (res.code === 20000) {
                this.setData({ list: res.data.pageInfo.list })
            }
        })
    },

    getStreeViewsByArea: function () {
        http.askFor(api.getStreeViewsByArea, {
        }).then((res) => {
            if (res.code === 20000) {
            }
        })
    },


    // 逆地址解析
    regeocoding: function(location) {
        this.setData({
            city: location.address_component.province + location.address_component.city
        })
        this.isShowQR();
    },

    // 地址屏蔽？
    findConfig: async function() {
        let add = { "address": this.data.city }
        Object.assign(add, this.data.basicInfo)
        return http.askFor(api.findConfigAddress, add).then(res => {
        return parseInt(res.data.configAddress.isCharge)
        })
    },
    // 判断是否收费
    findConfigColumn: async function() {
        return http.askFor(api.findConfigColumn, {
            appMarket: this.data.basicInfo.appMarket,
            appPackage: this.data.basicInfo.appPackage,
            appVersion: this.data.basicInfo.appVersion,
            application: this.data.basicInfo.application
        }).then(res => {
            this.setData({ QRCode: res.data.configMap.QRcode || '' })
            return parseInt(res.data.configMap.isCharge)
        })
    },


    // 判断是否展示二维码
    isShowQR: async function() {

        // 获取当前版本信息
        wx.getSystemInfo({ success: async (res) => {
            let addressIsCharge = await this.findConfig();
            let columnIsCharge = await this.findConfigColumn();
            let isCharge = !!addressIsCharge && !!columnIsCharge;
            let appInfo = res;
            let isIOS = appInfo?.system.toLowerCase().indexOf('ios') > -1;
            // this.setData({ isShowFriendPanel: isCharge && !isIOS });
            // if (isCharge && !isIOS) return wx.navigateTo({ url: '../QR/QR?QRCode=' + this.data.QRCode })
            this.setData({ isShowQRCode: isCharge && !isIOS });
        } })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        getLocation((res) => {
          this.regeocoding(res.result);
        })
        this.getCitiesWithStreeViews();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})