---
layout: post
styles: [syntax]
title: Google Volley如何缓存HTTP请求文件
category: 开源项目
tags: Android
---

# 概述

HTTP请求，是一个很长见的过程，缓存也是一个不可避免的话题。一个有好的HTTP请
求，肯定会有它自己的一套缓存机制。我们要如何来做，即能方便，又能快速的实现这
个功能呢？

# 想法

以前，自己也封装过一些简陋的HTTP框架，有的在HTTP框架中做过数据缓存，有的没有
做过数据缓存。

1. 没有做数据缓存

在没有做数据缓存的时候，将HTTP请求的Response响应到UI之前，作数据预处理，并且
此过程的处理放到子线程中进行，不占用UI线程。这样子可以很方便的让用户选择如何进
行数据缓存，以及缓存侧略。

2. 做数据缓存

在本处，做数据缓存，有一个通用的做法就是将HTTP请求的Response作为文件来存储。虽
然很简单，但是还是有一个小的细节需要注意，那就是如何建立HTTP请求与文件之间的映射。
前面我去面试的时候，也遇到过这个问题。我的想法如下：
 
 + 直接使用URL地址作为文件名称，考虑到URL地址有可能存在过长的情况，可以使用URL地
 址的`MD5`值来作为KEY

 + 建立数据库，用来存储URL地址与文件名的映射关系，文件名使用`UUID`来存储 

上述两种办法是可行的，但是好不好，我就不好说了。毕竟个人能力有限。

#Google Volley 缓存HTTP请求到文件中

先看代码：

```java
while (true) {
  Request<?> request;
  try {
      // Take a request from the queue.
      request = mQueue.take();
  } catch (InterruptedException e) {
      // We may have been interrupted because it was time to quit.
      if (mQuit) {
          return;
      }
      continue;
  }

  try {
      request.addMarker("network-queue-take");

      // If the request was cancelled already, do not perform the
      // network request.
      if (request.isCanceled()) {
          request.finish("network-discard-cancelled");
          continue;
      }

      addTrafficStatsTag(request);

      // Perform the network request.
      NetworkResponse networkResponse = mNetwork.performRequest(request);
      request.addMarker("network-http-complete");

      // If the server returned 304 AND we delivered a response already,
      // we're done -- don't deliver a second identical response.
      if (networkResponse.notModified && request.hasHadResponseDelivered()) {
          request.finish("not-modified");
          continue;
      }

      // Parse the response here on the worker thread.
      Response<?> response = request.parseNetworkResponse(networkResponse);
      request.addMarker("network-parse-complete");

      // Write to cache if applicable.
      // TODO: Only update cache metadata instead of entire record for 304s.
      if (request.shouldCache() && response.cacheEntry != null) {
          mCache.put(request.getCacheKey(), response.cacheEntry);
          request.addMarker("network-cache-written");
      }

      // Post the response back.
      request.markDelivered();
      mDelivery.postResponse(request, response);
  } catch (VolleyError volleyError) {
      parseAndDeliverNetworkError(request, volleyError);
  } catch (Exception e) {
      VolleyLog.e(e, "Unhandled exception %s", e.toString());
      mDelivery.postError(request, new VolleyError(e));
  }
}
```

如上述代码，先从`mQuene`中拿出一个`Request`，然后经过一系列的预处理，分发出网络请求。

在下述地方进行了数据缓存：

```java
if (request.shouldCache() && response.cacheEntry != null) {
    mCache.put(request.getCacheKey(), response.cacheEntry);
    request.addMarker("network-cache-written");
}
```

如果当前的`Request`是应该被缓存（PS:request 默认是要进行数据缓存的），并且`cache`不为空
的时候，进行数据缓存。

紧接着便是把数据写到文件里面去，代码如下：

```java
/**
 * Puts the entry with the specified key into the cache.
 */
@Override
public synchronized void put(String key, Entry entry) {
    pruneIfNeeded(entry.data.length);
    File file = getFileForKey(key);
    try {
        FileOutputStream fos = new FileOutputStream(file);
        CacheHeader e = new CacheHeader(key, entry);
        boolean success = e.writeHeader(fos);
        if (!success) {
            fos.close();
            VolleyLog.d("Failed to write header for %s", file.getAbsolutePath());
            throw new IOException();
        }
        fos.write(entry.data);
        fos.close();
        putEntry(key, e);
        return;
    } catch (IOException e) {
    }
    boolean deleted = file.delete();
    if (!deleted) {
        VolleyLog.d("Could not clean up file %s", file.getAbsolutePath());
    }
}
```

代码很简单，就是通过`key`来生成一个对应的文件名，然后将我们要`cache`的数据存储到文件中。

先看一下`request.getCacheKey()`的默认实现：

```java
/**
 * Returns the URL of this request.
 */
public String getUrl() {
    return mUrl;
}

/**
 * Returns the cache key for this request.  By default, this is the URL.
 */
public String getCacheKey() {
    return getUrl();
}
```

我那个X，它的默认实现就是直接取的URL地址。下面我们在看一下`getFileForKey(key)`是如何实现
的。

```java

/**
 * Creates a pseudo-unique filename for the specified cache key.
 * @param key The key to generate a file name for.
 * @return A pseudo-unique filename.
 */
private String getFilenameForKey(String key) {
    int firstHalfLength = key.length() / 2;
    String localFilename = String.valueOf(key.substring(0, firstHalfLength).hashCode());
    localFilename += String.valueOf(key.substring(firstHalfLength).hashCode());
    return localFilename;
}

/**
 * Returns a file object for the given cache key.
 */
public File getFileForKey(String key) {
    return new File(mRootDirectory, getFilenameForKey(key));
}

```

可以看到，文件名的取值是将URL地址分成两部分，分别取`hashcode`然后在合在一起行成一个字符串。

存储HTTP请求缓存竟然如些的简单，为何我不曾想到呢。

> PS: 这个地方为什么要分成两部分来取hashcode值呢?我也不知道，我猜是为了尽可能唯一吧。

#Google Volley 使用本地缓存

如果你读过`Volley`的源码，想必你肯定知道，在`Volley`初始化的时候，创建了一个
`CacheDispatcher`和五个`NetworkDispatcher`

当一个`Request`通过`RequestQuene.add`添加进来的时候，首先是将`Request`放入到缓存队列里面
去的，除非这个请求被设置成不使用缓存，先看下`add`的源码：

```java
/**
 * Adds a Request to the dispatch queue.
 * @param request The request to service
 * @return The passed-in request
 */
public <T> Request<T> add(Request<T> request) {
    // Tag the request as belonging to this queue and add it to the set of current requests.
    request.setRequestQueue(this);
    synchronized (mCurrentRequests) {
        mCurrentRequests.add(request);
    }

    // Process requests in the order they are added.
    request.setSequence(getSequenceNumber());
    request.addMarker("add-to-queue");

    // If the request is uncacheable, skip the cache queue and go straight to the network.
    if (!request.shouldCache()) {
        mNetworkQueue.add(request);
        return request;
    }

    // Insert request into stage if there's already a request with the same cache key in flight.
    synchronized (mWaitingRequests) {
        String cacheKey = request.getCacheKey();
        if (mWaitingRequests.containsKey(cacheKey)) {
            // There is already a request in flight. Queue up.
            Queue<Request<?>> stagedRequests = mWaitingRequests.get(cacheKey);
            if (stagedRequests == null) {
                stagedRequests = new LinkedList<Request<?>>();
            }
            stagedRequests.add(request);
            mWaitingRequests.put(cacheKey, stagedRequests);
            if (VolleyLog.DEBUG) {
                VolleyLog.v("Request for cacheKey=%s is in flight, putting on hold.", cacheKey);
            }
        } else {
            // Insert 'null' queue for this cacheKey, indicating there is now a request in
            // flight.
            mWaitingRequests.put(cacheKey, null);
            mCacheQueue.add(request);
        }
        return request;
    }
}
```

可以很清淅的看出来。如果在等待队列中已经有相同`cacheKey`的request,只需要将它加入到等侍队列中去就行了。

在来看一下，在`CacheDispatcher`中是如何做数据分发的。

 1. 首先是读取当前已经存在的缓存文件

 
 ```java
   /**
   * Initializes the DiskBasedCache by scanning for all files currently in the
   * specified root directory. Creates the root directory if necessary.
   */
  @Override
  public synchronized void initialize() {
      if (!mRootDirectory.exists()) {
          if (!mRootDirectory.mkdirs()) {
              VolleyLog.e("Unable to create cache dir %s", mRootDirectory.getAbsolutePath());
          }
          return;
      }

      File[] files = mRootDirectory.listFiles();
      if (files == null) {
          return;
      }
      for (File file : files) {
          BufferedInputStream fis = null;
          try {
              fis = new BufferedInputStream(new FileInputStream(file));
              CacheHeader entry = CacheHeader.readHeader(fis);
              entry.size = file.length();
              putEntry(entry.key, entry);
          } catch (IOException e) {
              if (file != null) {
                 file.delete();
              }
          } finally {
              try {
                  if (fis != null) {
                      fis.close();
                  }
              } catch (IOException ignored) { }
          }
      }
  }
 ```

直接遍历整个文件夹，将其加入内存，也是蛮拼的。

2. 缓存队列的执行

```java
final Request<?> request = mCacheQueue.take();
request.addMarker("cache-queue-take");

// If the request has been canceled, don't bother dispatching it.
if (request.isCanceled()) {
    request.finish("cache-discard-canceled");
    continue;
}

// Attempt to retrieve this item from cache.
Cache.Entry entry = mCache.get(request.getCacheKey());
if (entry == null) {
    request.addMarker("cache-miss");
    // Cache miss; send off to the network dispatcher.
    mNetworkQueue.put(request);
    continue;
}

// If it is completely expired, just send it to the network.
if (entry.isExpired()) {
    request.addMarker("cache-hit-expired");
    request.setCacheEntry(entry);
    mNetworkQueue.put(request);
    continue;
}

// We have a cache hit; parse its data for delivery back to the request.
request.addMarker("cache-hit");
Response<?> response = request.parseNetworkResponse(
        new NetworkResponse(entry.data, entry.responseHeaders));
request.addMarker("cache-hit-parsed");

if (!entry.refreshNeeded()) {
    // Completely unexpired cache hit. Just deliver the response.
    mDelivery.postResponse(request, response);
} else {
    // Soft-expired cache hit. We can deliver the cached response,
    // but we need to also send the request to the network for
    // refreshing.
    request.addMarker("cache-hit-refresh-needed");
    request.setCacheEntry(entry);

    // Mark the response as intermediate.
    response.intermediate = true;

    // Post the intermediate response back to the user and have
    // the delivery then forward the request along to the network.
    mDelivery.postResponse(request, response, new Runnable() {
        @Override
        public void run() {
            try {
                mNetworkQueue.put(request);
            } catch (InterruptedException e) {
                // Not much we can do about this.
            }
        }
    });
}
```

从内存中找对应的`cache`,如果`entry == null`，将`Request`加入`Network Queue`。
如果`entry.isExpired`，将`Request`加入到`Network Queue`。
当然，如果读取到数据是需要刷新的，也是要加入到`Network Queue`。

当然，还有最后一个问题，这尼玛，这个`Entry`到底是怎么来的。

我仔细研究了一下代码才找到，他是在我们`Requet`的`parseNetworkResponse`中实现的，代码如下：

```java
@Override
protected Response<String> parseNetworkResponse(NetworkResponse response) {
    String parsed;
    try {
        parsed = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
    } catch (UnsupportedEncodingException e) {
        parsed = new String(response.data);
    }
    return Response.success(parsed, HttpHeaderParser.parseCacheHeaders(response));
}
```

就是`HttpHeaderParser.parseCacheHeaders(response)`实现`Response`向`Cache.Entry`的转换。

当然，你可以实现自己的`parseCacheHeaders`的方法，来实现你自己的缓存侧略。

到此为止，基本写完了我所读到的`Volley`中实现`Cache`的方法。如果你对本文或者我有什么意见或者建议。
请骚扰我：lovecluo@nightweaver.org


