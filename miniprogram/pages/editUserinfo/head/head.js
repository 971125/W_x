// miniprogram/pages/editUserinfo/head/head.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto:''
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
    this.setData({
      userPhoto:app.userInfo.userPhoto
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  handleUploadImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then(res=>{
      const tempFile=res.tempFilePaths[0];
      this.setData({
        userPhoto:tempFile
      })
    })
  },
  handleBtn(){
    wx.showToast({
      title: '上传中。。。',
    });
    let cloudPath="usersPhoto/"+app.userInfo._openid + Date.now() + ".jpg";
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath,
      // 指定要上传的文件的小程序临时文件路径
      filePath: this.data.userPhoto,
      // 成功回调
    }).then(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '上传成功',
      })
     let fileId = res.fileID;
     if(fileId){
       db.collection('users').doc(app.userInfo._id).update({
         data:{
           userPhoto:fileId
         }
       }).then((res)=>{
         wx.showToast({
           title: '上传并更新成功',
         });
         app.userInfo.userPhoto = fileId
       })
     }
    })
  },
  bindGetUserInfo(ev){
    let userInfo=ev.detail.userInfo;
    if(userInfo){
      this.setData({
        userPhoto:userInfo.avatarUrl
      },()=>{
        db.collection('users').doc(app.userInfo._id).update({
          data:{
            userPhoto:this.data.userPhoto
          }
        }).then((res)=>{
          wx.showToast({
            title: '上传并更新成功',
          });
          app.userInfo.userPhoto=this.data.userPhoto
        })
      })
    }

  }
})