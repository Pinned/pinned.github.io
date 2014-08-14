---
layout: post
styles: [syntax]
title: Andorid JUnit 单元测试
category: android
---

## Andorid JUnit单元测试

以前没怎么使用过单元测试，今天也自己写着试了一下，感觉还是相当不错的。有的时候确实要比在整个项目中做测试要快很多。
特别是在做模块测试的时候，JUnit是相当好用的。在这个地方记录一下，遇到的问题：

### 1. 创建Android测试项目

因为我自己使用的是Eclipse(Android Studio 还在研究当中)，所以是新建的项目作为测试项目，步骤如下

- 在菜单项点击菜单 **File**
- 将鼠标移动到 **New -> others...**
- 在弹出的菜单中找到 **Android Test Project** ，然后按照对应的步骤，选择你要测试的主项目就OK了
- 在你要测试的类上面点击鼠标右键，新建 **JUnit Test Case** ， 选择**JUnit 3 Test**和**Sources Folder**

### 2. 在测试方法中获取Context对象 

其实很简单，就只需要将单元测试的类继承自`AndroidTestCase`就可以了，在使用的时候，直接用`getContext()`就可以了。

### 3. Android 多线程测试

因为JUnit测试是顺序执行的，所以说它不会等到你的异步回调回来就结束，返回正确的结果。[google](http://www.google.com)
了一翻，找到了解决方案，使用**信号量**来阻塞Test Case的执行,代码如下：

```java
public void testRegister() {
    final CountDownLatch signal = new CountDownLatch(1); 
    RequestWraper registerRequest = new RequestWraper(RequestMethod.POST, 
             "http://192.168.0.106:8080/user/register");
    registerRequest.setCallbackListener(new StringRequestCallback() {
      @Override
      public void onSuccess(String result) {
        DebugLog.d(TAG, "[onSuccess] result:" + result);
        signal.countDown();
      }
      
      @Override
      public void onFailure(MallHttpException exp) {
        DebugLog.d(TAG, "[onFailure] exp:" + exp.getMessage());
        signal.countDown();
      }
    });
    Map<String, String> params = new HashMap<String, String>();
    params.put("device_id", PreferencesUtil.getString(getContext(), AlertmeConfig.PREFERENCE_JPUSH_REGISTID_KEY));
    registerRequest.setParameters(params);
    registerRequest.doExcute();
    try {
      signal.await();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
```