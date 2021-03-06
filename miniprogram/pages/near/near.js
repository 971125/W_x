// miniprogram/pages/near/near.js
const app =getApp()
const db=wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:'',
    latitude:'',
    markers:[]
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
    this.getLocation();
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation();
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
  getLocation(){
    wx.getLocation({
      type:'gcj02',
      success:(res)=>{
        const longitude = res.longitude;
        const latitude = res.latitude;
        this.setData({
          longitude:longitude,
          latitude:latitude
        });
        this.getnearUsers()
       
      }
    })
  },
  getnearUsers(){
    db.collection('users').where({
      location:_.geoNear({
        geometry:db.Geo.Point(this.data.longitude,this.data.latitude),
        minDistance:0,
        maxDistance:5000
      }),
      isLocation:true
    }).field({
      longitude:true,
      latitude:true,
      userPhoto:true,
      _id:true
    }).get().then((res)=>{
      console.log(res)
      let data = res.data;
      let result = [];
      if(data.length){
        for(let i=0;i<data.length;i++){
          if(data[i].userPhoto.includes('cloud://')){
            wx.cloud.getTempFileURL({
              fileList:[data[i].userPhoto],
              success:res=>{
                result.push({
                  iconPath:res.fileList[0].tempFileURL,
                  id:data[i]._id,
                  latitude:data[i].latitude,
                  longitude:data[i].longitude,
                  width:30,
                  height:30
                });
                this.setData({
                  markers:result
                })
              
              }
            })
          }else{
            console.log(result)
                result.push({
                            iconPath:data[i].userPhoto,
                            id:data[i]._id,
                            latitude:data[i].latitude,
                            longitude:data[i].longitude,
                            width:30,
                            height:30
                          });
          }
           
          
        }
         this.setData({
                markers:result,
           },()=>{
              console.log(this.data.markers)
          })  
          
      }

    })
  },
  message(e){
    console.log(e)
  }
})