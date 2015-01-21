---
layout: post
styles: [syntax]
title: TextView高亮URL地址解析 
category: 安卓
tags: Android
---

#TextView 高亮实现

基本使用方法：

```java
textView.setAutoLinkMask(Linkify.ALL);
//public static final int WEB_URLS = 1;
//public static final int EMAIL_ADDRESSES = 2;
//public static final int PHONE_NUMBERS = 4;
//public static final int MAP_ADDRESSES = 8; 
//public static final int ALL = 15;
textView.setMovementMethod(LinkMovementMethod.getInstacne());
```

`setMovementMethod()`是设置相应点击跳转时间触发用的。

去研究了一下`TextView`的源码。URL地址匹配实际上是用的正则做的。
所以我们也能很简单的实现这个东西。

#修改源码，实现自己的高亮和自定义跳转

首先拿到我们要显示的字符串，创建`Spannable`对象：

```java
private Spannable.Factory mSpannableFactory = Spannable.Factory.getInstance();
Spannable spannable = mSpannableFactory.newSpannable(pili.description);
```

然后我们要去拿到的`spannable`进行处理，将我们要高亮的数据`正则匹配`出来。

1. 先移除掉`spannable`中已经存在的`URLSpan`

  ```java
	URLSpan[] old = text.getSpans(0, text.length(), URLSpan.class);
	for (int i = old.length - 1; i >= 0; i--) {
	  text.removeSpan(old[i]);
	}
  ```
  
2. 匹配URL地址，并设置`Spannable`

  ```java
  public static final Linkify.MatchFilter sUrlMatchFilter = new Linkify.MatchFilter() {
   		public final boolean acceptMatch(CharSequence s, int start, int end) {
       	if (start == 0) {
           	return true;
       	}

       	if (s.charAt(start - 1) == '@') {
           	return false;
       	}
       	return true;
   		}
  };
  private static final String makeUrl(String url, String[] prefixes,
                                        Matcher m, Linkify.TransformFilter filter) {
        if (filter != null) {
            url = filter.transformUrl(m, url);
        }

        boolean hasPrefix = false;

        for (int i = 0; i < prefixes.length; i++) {
            if (url.regionMatches(true, 0, prefixes[i], 0,
                    prefixes[i].length())) {
                hasPrefix = true;

                // Fix capitalization if necessary
                if (!url.regionMatches(false, 0, prefixes[i], 0,
                        prefixes[i].length())) {
                    url = prefixes[i] + url.substring(prefixes[i].length());
                }

                break;
            }
        }

        if (!hasPrefix) {
            url = prefixes[0] + url;
        }
        return url;
    }
    
	private final void gatherLinks(ArrayList<LinkSpec> links,
	                                     Spannable s, Pattern pattern, String[] schemes,
	                                     Linkify.MatchFilter matchFilter, 
	                                     Linkify.TransformFilter transformFilter) {
	   Matcher m = pattern.matcher(s); // 正则匹配，使用Patterns.WEB_URL
	   while (m.find()) {
	       int start = m.start();
	       int end = m.end();

	       if (matchFilter == null || matchFilter.acceptMatch(s, start, end)) {
	           LinkSpec spec = new LinkSpec();
	           String url = makeUrl(m.group(0), schemes, m, transformFilter);
	           spec.url = url;
	           spec.start = start;
	           spec.end = end;
	           links.add(spec);
	       }
	   }
	 }
	 class LinkSpec {
        String url;
        int start;
        int end;
    }
  ```
  
  ```java
    private final void applyLink(String url, int start, int end, Spannable text) {
        URLSpanNoUnderline span = new URLSpanNoUnderline(url);
        text.setSpan(span, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
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


