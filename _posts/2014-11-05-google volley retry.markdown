---
layout: post
styles: [syntax]
title: Google Volley 网络请求框架(一)
category: 安卓
tags: Android
---

Volley是在Google I/O 2013上发布的，说来惭愧，都快一年了，才知道有这么个东西。

有关Volley相关的使用及详细内容，我就不说了。如果还不会用的，但是又想用的可以移步
其它地方。

**传送门** (感谢“郭霖”大神)

> 1. [Android Volley完全解析(一)，初识Volley的基本用法](http://blog.csdn.net/guolin_blog/article/details/17482095)
> 2. [Android Volley完全解析(二)，使用Volley加载网络图片](http://blog.csdn.net/guolin_blog/article/details/17482165)
> 3. [Android Volley完全解析(三)，定制自己的Request](http://blog.csdn.net/guolin_blog/article/details/17612763)
> 4. [Android Volley完全解析(四)，带你从源码的角度理解Volley](http://blog.csdn.net/guolin_blog/article/details/17656437)

当然除了大神写的，还可以去看官方文档，也写得相当的好。

> 1. [Transmitting Network Data Using Volley](http://developer.android.com/training/volley/index.html)

虽然看了上述文章，使用起来是完全木有问题。但是问题来了，如果在网络请求的时候出现了bug，
你会如何去解决这个问题呢？

当然，如果你非常了解源码，你肯定知道是怎么引起的。但是我不知道源码啊。肿么破啊。

于是，硬着头皮去看Volley源码，才发现，人家这个比我也得好是有原因的。

### Volley 网络请求

先看一下官方给出的架构图嘛，虽然我也不怎么明白是怎么实现的。

![Google Volley illustrates the life of a request](http://pinned.github.io/assets/posts/file-2014-11-05/volley-request.png
)

当你建立一个`Request`，将`Request`添加到`RequestQuene`中去，Volley 首先会去找Cache里面有没有存在有效的
请求，如果存在，则直接处理里面请求返回的数据并响应回去，如果没有，则把`Request`放到网络请求队列里面去，
执行异步请求并响应。

以上就是我暂时对Volley的理解了。

### Volley 请求重试机制

一个完整的网络请求框架，肯定会有请求失败重试的机制。

开始使用的时候，没有注意过请求重试的相关东西。自己也封装过一些网络请求的简单框架。也没有使用过。
最近在使用Volley的时候，它的网络请求是有一个重试机制的，并且你可以自己写重试的条件和次数等。

下面来看一下，Google在Volley是怎么实现的。

先上代码：

```java
@Override
public NetworkResponse performRequest(Request<?> request) throws VolleyError {
    long requestStart = SystemClock.elapsedRealtime();
    while (true) {
        HttpResponse httpResponse = null;
        byte[] responseContents = null;
        Map<String, String> responseHeaders = new HashMap<String, String>();
        try {
            // Gather headers.
            Map<String, String> headers = new HashMap<String, String>();
            addCacheHeaders(headers, request.getCacheEntry());
            httpResponse = mHttpStack.performRequest(request, headers);
            StatusLine statusLine = httpResponse.getStatusLine();
            int statusCode = statusLine.getStatusCode();

            responseHeaders = convertHeaders(httpResponse.getAllHeaders());
            // Handle cache validation.
            if (statusCode == HttpStatus.SC_NOT_MODIFIED) {
                return new NetworkResponse(HttpStatus.SC_NOT_MODIFIED,
                        request.getCacheEntry() == null ? null : request.getCacheEntry().data,
                        responseHeaders, true);
            }

            // Some responses such as 204s do not have content.  We must check.
            if (httpResponse.getEntity() != null) {
              responseContents = entityToBytes(httpResponse.getEntity());
            } else {
              // Add 0 byte response as a way of honestly representing a
              // no-content request.
              responseContents = new byte[0];
            }

            // if the request is slow, log it.
            long requestLifetime = SystemClock.elapsedRealtime() - requestStart;
            logSlowRequests(requestLifetime, request, responseContents, statusLine);

            if (statusCode < 200 || statusCode > 299) {
                throw new IOException();
            }
            return new NetworkResponse(statusCode, responseContents, responseHeaders, false);
        } catch (SocketTimeoutException e) {
            attemptRetryOnException("socket", request, new TimeoutError());
        } catch (ConnectTimeoutException e) {
            attemptRetryOnException("connection", request, new TimeoutError());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Bad URL " + request.getUrl(), e);
        } catch (IOException e) {
            int statusCode = 0;
            NetworkResponse networkResponse = null;
            if (httpResponse != null) {
                statusCode = httpResponse.getStatusLine().getStatusCode();
            } else {
                throw new NoConnectionError(e);
            }
            VolleyLog.e("Unexpected response code %d for %s", statusCode, request.getUrl());
            if (responseContents != null) {
                networkResponse = new NetworkResponse(statusCode, responseContents,
                        responseHeaders, false);
                if (statusCode == HttpStatus.SC_UNAUTHORIZED ||
                        statusCode == HttpStatus.SC_FORBIDDEN) {
                    attemptRetryOnException("auth",
                            request, new AuthFailureError(networkResponse));
                } else {
                    // TODO: Only throw ServerError for 5xx status codes.
                    throw new ServerError(networkResponse);
                }
            } else {
                throw new NetworkError(networkResponse);
            }
        }
    }
}
```

Volley的网络请求是在上述代码中进行执行的。一个`while(true)`循环包含了太多东西。

网络请求发出去的了，但是如果网络超时怎么办，当然是`重试`呢，可是上述代码是怎么实现重试的呢？
我们可以看到，在`catch`里面有两个超时的Exception:
 
 + `SocketTimeoutException`
 + `ConnectTimeoutException`

我们在继续往下面看，当它捕获到超时的时候执行了`attemptRetryOnException("connection", request, new TimeoutError());`

在看一下这个方法的源码:

```java
/**
 * Attempts to prepare the request for a retry. If there are no more attempts remaining in the
 * request's retry policy, a timeout exception is thrown.
 * @param request The request to use.
 */
private static void attemptRetryOnException(String logPrefix, Request<?> request,
        VolleyError exception) throws VolleyError {
    RetryPolicy retryPolicy = request.getRetryPolicy();
    int oldTimeout = request.getTimeoutMs();

    try {
        retryPolicy.retry(exception);
    } catch (VolleyError e) {
        request.addMarker(
                String.format("%s-timeout-giveup [timeout=%s]", logPrefix, oldTimeout));
        throw e;
    }
    request.addMarker(String.format("%s-retry [timeout=%s]", logPrefix, oldTimeout));
}
```

看方法上面的注释就可以清晰的看到，给网络请求建立重试，如果重试的次数已经用完了，则抛出一个
`timeout exception`.

在来看一下，默认的重试是怎么进行验证的。

```java
 /**
 * Prepares for the next retry by applying a backoff to the timeout.
 * @param error The error code of the last attempt.
 */
@Override
public void retry(VolleyError error) throws VolleyError {
    mCurrentRetryCount++;
    mCurrentTimeoutMs += (mCurrentTimeoutMs * mBackoffMultiplier);
    if (!hasAttemptRemaining()) {
        throw error;
    }
}

/**
 * Returns true if this policy has attempts remaining, false otherwise.
 */
protected boolean hasAttemptRemaining() {
    return mCurrentRetryCount <= mMaxNumRetries;
}
```

首先将当前重试的次数加1，如果重试的次数小于等于最大次数，则不管，回到上面那个`while(true)`
循环继续执行，反之，则抛出异常，最后终止循环。

> PS：默认的重试最大次数是1

### 写在最后

多了解一下最新的技术，多去看看那些大神写的Blog，对自己的提升会比较大，虽然你不能很好的
去读懂官方给出的英文文档，但是很多技术牛人会将新技术以简单通俗的例子告诉给你。

最后，感谢“郭霖”大神，他的技术博客地址:[传送门](http://blog.csdn.net/guolin_blog)