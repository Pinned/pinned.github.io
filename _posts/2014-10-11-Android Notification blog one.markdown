---
layout: post
styles: [syntax]
title: Android之Notification的使用
category: android
---

## Android之Notification的使用


在通知栏展示一些及时消息是一件非常常见的事情，相对来说，使用Notification也是一件很
简单的事情。

一个简单的事情，做起来也会遇到bug，先贴代码：

```java
Intent intent = new Intent(this, OtherActivity.class);
String currentTime =  DateTimeUtil.formatDateDefault(Calendar.getInstance().getTime());
intent.putExtra("time", currentTime);
int notificationId = (int) System.currentTimeMillis();
PendingIntent pendingIntent= PendingIntent.getActivity(
    this, notificationId, intent, PendingIntent.FLAG_CANCEL_CURRENT);
NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
        .setSmallIcon(R.drawable.ic_launcher)
        .setContentTitle(currentTime)
        .setContentText("text")
        .setTicker("tricker")
        .setStyle(new NotificationCompat.BigTextStyle().bigText("big text"))
        .setAutoCancel(true)
        .setContentIntent(pendingIntent);
NotificationManager notificationManager = (NotificationManager)this.getSystemService(Context.NOTIFICATION_SERVICE);
Notification notification = mBuilder.build();
notificationManager.notify(notificationId, notification);
```

就按照上述的样子，就可以展示出一条Notification到状态栏了。很easy.

可是问题来了，在做点击事件的时候，跳转出现了问题。

**问题描述**

因为没一个Notification的NotificationId都不一样，所以，每一次都会添加一个Notification到状态栏。
从上面的代码可以看出，所有的Notification的点击事件都指向了`OtherActivity`。
当状态栏上有多个Notification的时候并且我们退出了应用程序，这时候，点击其中一条Notification，会
启动`OtherActivity`, 问题来了，我在点击其它的Notification的时候,就没有任何响应。

**解决办法**

经过一番查找过后，还是没有找到解决办法。最后问了一下同事，解决方法简单的出乎我的意料。如下代码：

```java
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
```

只需要设置一下Flag就行了，如果你只需要启动一个Activity，可以在**Mainfest.xml**中添
加`android:launchMode="singleTask"`就行了。


贴上我的代码地址:[下载地址](https://github.com/Pinned/NotificationDemo)

**注意事项**

 + 当有多个Notification的时候，Notification的跳转事件被最新的一个Notification覆盖了。
    - **原因**
     问题主要出在`PendingIntent.getActivity();`的第二个参数，API文档里虽然说是未被使用的参数
    (给出的例子也直接写0的)，实际上是通过该参数来区别不同的Intent的，如果id相同，就会覆盖
    掉之前的Intent了。所以总是获取到最后一个Intent。
    - **解决办法**
     `PendingIntent.getActivity();`的第二个参数传入不同的id

 + Notification 声音，震动，LED灯

    ```java
    // 震动
    notification.vibrate = new long[] {100,400,100,400};
    // 要添加震动权限：<uses-permission android:name="android.permission.VIBRATE"></uses-permission>
    ```

    ```java
    // 声音
    notification.sound=Uri.parse("android.resource://"+R.class.getPackage().getName()+"/" +R.raw.ring);
    ```

    ```java
    notification.ledARGB=Color.GREEN;//led灯颜色
    notification.ledOffMS=1000;//关闭时间 毫秒
    notification.ledOnMS=1000;//开启时间 毫秒
    notification.flags|=Notification.FLAG_SHOW_LIGHTS;
    ```

    > ps: LED 显示只有在熄屏的时候才有效果， 一定要给震动加上权限


**参考资料**

1. [intent.setFlags方法中的参数值含义](http://blog.csdn.net/berber78/article/details/7278408)
2. [同时显示多个Notification时PendingIntent的Intent被覆盖？](http://univasity.iteye.com/blog/1390445)
