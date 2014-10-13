---
layout: post
styles: [syntax]
title: Android之Webview使用
category: android
---

### Android之Webview使用

HTML页面是一个非常重要的角色，不仅是在PC端，在移动端也是非常重要的。

今天使用Webview来显示一个H5页面，其中就有地图页面。如果你经常使用浏览器，
你会发现，浏览器在使用定位信息的时候，需要相关权限，当然，有好的提示用户是一个
必不可少的步骤。

**问题**

用Webview加载map的时候，使用地理位置，提示用户授权。

**解决办法**

先看代码：

```java
@Override
public void onGeolocationPermissionsShowPrompt(
        final String origin,
        final GeolocationPermissions.Callback callback) {
    DebugLog.d(TAG, "[onGeolocationPermissionsShowPrompt]");
    showLocalRemidPopupWindow(origin, new GeoListener() {
        @Override
        public void onRefused() {
            callback.invoke(origin, false, false);
        }

        @Override
        public void onSharedLocation() {
            callback.invoke(origin, true, false);
        }
    });
}

private void showLocalRemidPopupWindow(final String title, final GeoListener callback) {
    String saved = PreferencesUtil.getString(this, title, "");
    if (!TextUtils.isEmpty(saved)) {
        if (saved.equals("true")){
            if (callback != null) {
                callback.onSharedLocation();
            }
        } else if (saved.equals("false")){
            if (callback != null){
                callback.onRefused();
            }
        }
        return;
    }
    if (mGeoPopupWindow == null){
        View view = LayoutInflater.from(this).inflate(R.layout.geo_popup_window, null);
        this.mGeoTitleTv = (TextView) view.findViewById(R.id.geo_title);
        this.mGeoSaveCb = (CheckBox) view.findViewById(R.id.geo_save_share_preference);
        this.mRefusedBtn = (Button) view.findViewById(R.id.refused_btn);
        this.mShareLocationBtn = (Button) view.findViewById(R.id.share_btn);
        this.mGeoPopupWindow = new PopupWindow(view,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT, false);
    }
    this.mGeoTitleTv.setText(String.format(getString(R.string.geo_title), title));
    this.mGeoSaveCb.setChecked(true);
    this.mRefusedBtn.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            saveSharePrefrence(title, false);
            if (callback != null) {
                callback.onRefused();
            }
            mGeoPopupWindow.dismiss();
        }
    });
    this.mShareLocationBtn.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            saveSharePrefrence(title, true);
            if (callback != null) {
                callback.onSharedLocation();
            }
            mGeoPopupWindow.dismiss();
        }
    });
    this.mGeoPopupWindow.showAtLocation(mWebView, Gravity.BOTTOM, 0, 0);
}
```

当浏览器在调用地理位置信息，webView就会触发`onGeolocationPermissionsShowPrompt`这个方法的调用。
那浏览器中是如何调用地理位置信息的呢？这里我也去查看了一点点资料，大概了解了一下，
代码如下：

```javascript
//通过navigator.geolocation对象获取地理位置信息
//常用的navigator.geolocation对象有以下三种方法：
//获取当前地理位置
navigator.geolocation.getCurrentPosition(
        success_callback_function,
        error_callback_function,
        position_options)
//持续获取地理位置
navigator.geolocation.watchPosition(
        success_callback_function,
        error_callback_function,
        position_options)
//清除持续获取地理位置事件
navigator.geolocation.clearWatch(watch_position_id)  
```

当然仅仅是重写`onGeolocationPermissionsShowPrompt`这个方法是不行的。
还要对webSetting进入相关设置，具体内容，[源码](https://github.com/Pinned/WebViewDemo)
中有写相关代码。

>**WebSettings常用方法**
>
>setAllowFileAccess 启用或禁止WebView访问文件数据
>setBlockNetworkImage 是否显示网络图像
>setBuiltInZoomControls 设置是否支持缩放
>setCacheMode 设置缓冲的模式
>setDefaultFontSize 设置默认的字体大小
>setDefaultTextEncodingName 设置在解码时使用的默认编码
>setFixedFontFamily 设置固定使用的字体
>setJavaSciptEnabled 设置是否支持Javascript
>setLayoutAlgorithm 设置布局方式
>setLightTouchEnabled 设置用鼠标激活被选项
>setSupportZoom 设置是否支持变焦
>
>**WebViewClient常用方法**
>
>doUpdate VisitedHistory 更新历史记录
>onFormResubmission 应用程序重新请求网页数据
>onLoadResource 加载指定地址提供的资源
>onPageFinished 网页加载完毕
>onPageStarted 网页开始加载
>onReceivedError 报告错误信息
>onScaleChanged WebView发生改变
>shouldOverrideUrlLoading 控制新的连接在当前WebView中打开
>
>**WebChromeClient常用方法**
>
>onCloseWindow 关闭WebView
>onCreateWindow 创建WebView
>onJsAlert 处理Javascript中的Alert对话框
>onJsConfirm处理Javascript中的Confirm对话框
>onJsPrompt处理Javascript中的Prompt对话框
>onProgressChanged 加载进度条改变
>onReceivedlcon 网页图标更改
>onReceivedTitle 网页Title更改
>onRequestFocus WebView显示焦点

**最后结果**

![result](../../../../assets/posts/img-2014-10-13/device-2014-10-13-200631.png)

**参考资料**

1. [Android WebView常见问题及解决方案汇总](http://blog.csdn.net/t12x3456/article/details/13769731)
2. [android webview geolocation](http://stackoverflow.com/questions/5329662/android-webview-geolocation)
3. [利用HTML5开发Android](http://blog.csdn.net/eagelangel/article/details/8807723)
4. [Android WebView](http://dev.wo.com.cn/docportal/doc_queryMdocDetail.action?mdoc.docindex=6130)
