// miniprogram/pages/index/index.js
const app=getApp()
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:[
      'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/5d4298059889417157e8492750328492.jpg?w=632&h=340',
      'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/8a43378b96501d7e227a9018fe2668c5.jpg?w=632&h=340',
      'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/793913688bfaee26b755a0b0cc8575fd.jpg?w=632&h=340'
    ],
    listData:[

    ],
    current:'links'
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
    this.getlintdata()
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
  handleLinks(ev){
    let id = ev.target.dataset.id;
    wx.cloud.callFunction({
      name:'update',
      data:{
        collection:'users',
        doc:id,
        data:"{links : _.inc(1)}"
      }
    }).then((res)=>{
      wx.showToast({
        title: '点赞成功',
        success:function(){
         
        }
      })
        this.onReady()
    })
    
  },
  onPullDownRefresh:function(){
    this.onReady()
    wx.showToast({
      title:'刷新成功'
    })
  },
  handleCurrent(ev){
    let current = ev.target.dataset.current;
    if(current == this.data.current){
      return false
    }
    else{
      this.setData({
        current
      },()=>{
        this.getlintdata()
      })
    }
  },
  getlintdata(){
    db.collection('users').field({
      userPhoto:true,
      nickName:true,
      links:true
    })
    .orderBy(this.data.current,'desc')
    .get()
    .then((res)=>{
      this.setData({
        listData:res.data
      })
    })
  },
  handleDetail(ev){
    let id=ev.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId='+id,
    })
  }
})
