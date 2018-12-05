const app = getApp()
Page({
  data: {
    inputText: 'Defult',
    feedsignal: '00H',
    weightsignal:'W',
    receiveText: '',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  Feed: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(that.data.feedsignal.length)
      var dataView = new Uint8Array(buffer)
      for (var i = 0; i < that.data.feedsignal.length; i++) {
        dataView[i] = that.data.feedsignal.charCodeAt(i)
      }

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[1].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('Success')
        }
      })
    }
    else {
      wx.showModal({
        title: 'Warning',
        content: 'Disconnected',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  Sendtime: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(that.data.inputText.length)
      var dataView = new Uint8Array(buffer)
      for (var i = 0; i < that.data.inputText.length; i++) {
        dataView[i] = that.data.inputText.charCodeAt(i)
      }

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[1].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('Success')
        }
      })
    }
    else {
      wx.showModal({
        title: 'Warning',
        content: 'Disconnected',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  Check: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(that.data.weightsignal.length)
      var dataView = new Uint8Array(buffer)
      for (var i = 0; i < that.data.weightsignal.length; i++) {
        dataView[i] = that.data.weightsignal.charCodeAt(i)
      }

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[1].uuid,
        characteristicId: that.data.characteristics[0].uuid,
        value: buffer,
        success: function (res) {
          console.log('Success')
        }
      })
    }
    else {
      wx.showModal({
        title: 'Warning',
        content: 'Disconnected',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },

  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        that.setData({
          services: res.services
        })
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: res.services[1].uuid,
          success: function (res) {
            console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: that.data.services[1].uuid,
              characteristicId: that.data.characteristics[0].uuid,
              success: function (res) {
                console.log('Start Notify')
              }
            })
          }
        })
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value)
      console.log('Data：' + receiveText)
      that.setData({
        receiveText: receiveText
      })
    })
  },
})