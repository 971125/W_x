// miniprogram/pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto:'/images/user/yonghu.png',
    nickName:"lalala",
    logged:false,
    disable:true,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
    wx.cloud.callFunction(
      {
        name:'login',
      }
    ).then((res)=>{
      db.collection('users').where({
        _openid:res.result.openid
      }).get().then((res)=>{
        if(res.data.length){
          app.userInfo=Object.assign(app.userInfo,res.data[0]);
           this.setData({
          userPhoto:app.userInfo.userPhoto,
          nickName:app.userInfo.nickName,
          logged:true,
          id:app.userInfo._id
          });
          this.getMessage();
        }
        else{
          this.setData({
            disable:false
          })
        }
       
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     this.setData({
       userPhoto:app.userInfo.userPhoto,
       nickName:app.userInfo.nickName,
       id:app.userInfo._id
     })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo(e){
    let userInfo = e.detail.userInfo;
    if(!this.logged && userInfo){
      db.collection('users').add({
        data:{
          userPhoto:userInfo.avatarUrl,
          nickName:userInfo.nickName,
          signature:'',
          phoneNumber:'',
          weixinNumber:'',
          links:0,
          time:new Date(),
          isLocation:false,
          firendsList:[],
          longitude:this.longitude,
          latitude:this.latitude,
          location:db.Geo.Point(this.longitude,this.latitude)
        }
      }).then((res)=>{
        db.collection('users').doc(res._id).get().then((res)=>{
          // console.log(res.data); 
          app.userInfo=Object.assign(app.userInfo,res.data);
          this.setData({
            userPhoto:app.userInfo.userPhoto,
            nickName:app.userInfo.nickName,
            logged:true,
            id:app.userInfo._id
          })
        })
      });
    }
  },
  getMessage(){
    db.collection('message').where({
      userId:app.userInfo._id
    }).watch({
      onChange:function(ev){
        if(ev.docChanges.length > 0){
          let list = ev.docChanges[0].doc.list;
          if(list.length){
            wx.showTabBarRedDot({
              index: 2,
            });
            app.userMessage=list
          }
          else{
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage=[];
          }
        }
      },
      onError:function(e){
        console.log(e)
      }
    })
  },
  getLocation(){
    wx.getLocation({
      type:'gcj02',
      success:(res)=>{
        this.longitude = res.longitude;
        this.latitude = res.latitude;
        
       
      }
    })
  }
})