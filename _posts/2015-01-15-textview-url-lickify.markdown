---
layout: post
styles: [syntax]
title: TextView 高亮URL地址，并实现跳转
category: android
---

# Android TextView 使用

TextView的使用中，存在很多高级功能。比如高亮URL地址、电话号码等

使用方法：

```java
TextView tempText = new TextView(context);
tempText.setText("www.baidu.com");
tempText.setAutoLinkMask(Linkify.WEB_URLS);
tempText.setMovementMethod(LinkMovementMethod.getInstance());
```

但是我在使用过程中，要跳转到自己的Webview中去，又不想去解析字符串，提取里面的URL地址
所以我想了个简单的解决方案.

# 解决方法：

```java
TextView tempText = new TextView(context);
tempText.setText("www.baidu.com");
SpannableStringBuilder style = new SpannableStringBuilder(pili.description);
tempText.setAutoLinkMask(Linkify.WEB_URLS);
tempText.setMovementMethod(LinkMovementMethod.getInstance());
URLSpan [] urls = tempText.getUrls();
if (urls == null || urls.length <= 0) {
    text.setText(pili.description);
} else {
    for (URLSpan urlSpan : urls) {
        String url = urlSpan.getURL();
        int n = pili.description.indexOf(url);
        if (n < 0) {
            // 去掉前面的HTTP
            url = url.substring(7);
            n = pili.description.indexOf(url);
        }
        if (n < 0) {
            continue;
        }
        style.setSpan(new URLSpanNoUnderline(urlSpan.getURL()), n, url.length(), Spanned.SPAN_EXCLUSIVE_INCLUSIVE);
    }
    text.setText(style);
    text.setMovementMethod(LinkMovementMethod.getInstance());
}
```

```java
public class URLSpanNoUnderline extends ClickableSpan {
    private final String mURL;
    public URLSpanNoUnderline(String url) {
        mURL = url;
    }

    public String getURL() {
        return mURL;
    }

    @Override
    public void onClick(View widget) {
        final Context context = widget.getContext();
        BrowserActivity.startActivity(context, mURL);
    }
    @Override
    public void updateDrawState(TextPaint ds) {
        super.updateDrawState(ds);
        ds.setUnderlineText(false);  //取消下划线
        ds.setColor(0xff0066ff);     //指定文字颜色
        //ds.setTextSize(ds.getTextSize()*1.1F);
    }
}
```

就是如此的简单，但是为了弄这个东西，还是花了不少时间。

这种方法虽然可以实现功能，但是我觉得这样子做并不好。如果你有更好的解决方案。
望赐教，不胜感激。