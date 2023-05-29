---
layout: post
styles: [syntax]
title: Android之Notification的使用（二）
category: 安卓
tags: Android
---

## Android之Notification的使用（二）

接着上篇文章，解决了一些我在使用Notification的过程中的一些bug。但是解决这些问题是远远不够的。

在上篇文章中，解决了多个Notification跳转到同一个Activity中的问题。
但是那样子做并不能完全解决问题，下面来看一下，我新遇到的问题。

**先上代码**

```java
Intent intent = new Intent(this, MainActivity.class);
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
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
NotificationManager notificationManager = (NotificationManager)
		this.getSystemService(Context.NOTIFICATION_SERVICE);
Notification notification = mBuilder.build();
notification.defaults=Notification.DEFAULT_SOUND;
notification.vibrate = new long[] {100,400,100,400};
notification.ledARGB=Color.GREEN;//led灯颜色
notification.ledOffMS=1000;//关闭时间 毫秒
notification.ledOnMS=1000;//开启时间 毫秒
notification.flags|=Notification.FLAG_SHOW_LIGHTS;
notificationManager.notify(notificationId, notification);
```

和上一个例子不同的是，这一个Notification跳转的位置并不是`OtherActiivty`，
而是直接跳转到`MainActivity`.

**问题**
非常不幸的事，他并不能够正常接收么Intent传过来的参数。至于为什么，我也不知道。
如您知道这个的具体原因请告知我(邮箱：lovecluo@gmail.com)。


**解决办法**

虽然不知道是什么原因造成了这个问题，但是最终还是找到了解决方案：

解决方法如下：

```java
@Override
protected void onNewIntent(Intent intent) {
	Log.d(TAG, "[onNewIntent] 执行onNewIntent方法");
	showReciveParams(intent);
}
```

**写在最后**

本次试验的代码地址：[下载地址:NotificationDemo_02](https://github.com/Pinned/NotificationDemo)

**参考资料**

[1] [onNewIntent调用时机](http://www.cnblogs.com/zenfly/archive/2012/02/10/2345196.html)
