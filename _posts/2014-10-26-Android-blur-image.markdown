---
layout: post
styles: [syntax]
title: Android 图片的毛玻璃效果
category: android
---

+ **上效果图**

有很多时候，自己去找别人写的代码，首先会想看一下他的效果图是什么样子的。所以先上效果，
以后查找起来也比较方便：

![Default](http://pinned.github.io/assets/img/2014-10-26/default.png)
![Blur Pic](http://pinned.github.io/assets/img/2014-10-26/blur.png)

+ **简单实现**

其实要实现毛玻璃效果，还是挺简单的，Google 给我们提供了一个RenderScript, 看一下代码实现

```java
@TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR1)
public static Bitmap blurImage(Context context, Bitmap bmp, View view, int radius) {
    float scaleFactor = 1;
	Bitmap overlay = Bitmap.createBitmap((int) (bmp.getWidth() / scaleFactor),
            (int) (bmp.getWidth() / scaleFactor), Bitmap.Config.ARGB_8888);
	Canvas canvas = new Canvas(overlay);
	canvas.translate(-view.getLeft() / scaleFactor, -view.getTop() / scaleFactor);
        canvas.scale(1 / scaleFactor, 1 / scaleFactor);
    Paint paint = new Paint();
    paint.setFlags(Paint.FILTER_BITMAP_FLAG);
	canvas.drawBitmap(bmp, 0, 0, paint);
	RenderScript rs = RenderScript.create(context);
	Allocation overlayAlloc = Allocation.createFromBitmap(rs, overlay);
	ScriptIntrinsicBlur blur = ScriptIntrinsicBlur.create(rs, overlayAlloc.getElement());
	blur.setInput(overlayAlloc);
	blur.setRadius(radius);
	blur.forEach(overlayAlloc);
	overlayAlloc.copyTo(overlay);
	rs.destroy();
	return overlay;
}
private void initView() {
	this.mImageView = (ImageView) this.findViewById(R.id.image_view);
	changeBlur(1);
	mSeekBar = (SeekBar) this.findViewById(R.id.seek_bar);
	mSeekBar.setOnSeekBarChangeListener(new OnSeekBarChangeListener() {
		@Override
		public void onStopTrackingTouch(SeekBar arg0) {
		}
		@Override
		public void onStartTrackingTouch(SeekBar arg0) {
		}
		@Override
		public void onProgressChanged(SeekBar arg0, int arg1, boolean arg2) {
			DebugLog.d("arg1:" + arg1);
			if (arg1 == 0) {
				arg1 = 1;
			}
			changeBlur(arg1);
		}
	});
}
private void changeBlur(int radius) {
	Bitmap avatarBg = BitmapFactory.decodeResource(getResources(), R.drawable.pic);
	avatarBg = blurImage(this, avatarBg, this.mImageView, radius);
	mImageView.setImageBitmap(avatarBg);
}

```

但是这段代码要在`Android JELLY_BEAN_MR1`及以上版本才可以使用。

+ **改进办法**

使用第三方写的算法，也是可以实现的。代码如下：

```java
public static Bitmap blurImage(Context context, Bitmap bmp, View view, int radius){
	float scaleFactor = 1;
    Bitmap overlay = Bitmap.createBitmap((int) (bmp.getWidth()/scaleFactor),
            (int) (bmp.getHeight()/scaleFactor), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(overlay);
    canvas.translate(-view.getLeft()/scaleFactor, -view.getTop()/scaleFactor);
    canvas.scale(1 / scaleFactor, 1 / scaleFactor);
    Paint paint = new Paint();
    paint.setFlags(Paint.FILTER_BITMAP_FLAG);
    canvas.drawBitmap(bmp, 0, 0, paint);

    overlay = FastBlur.doBlur(overlay, (int)radius, true);
    return overlay;
}
```

当然，这里比较重要的是FastBlur这个类，有关图像计算的东东，我也不懂。
贴代码 ：

```java
package cn.lovecluo.blurimagedemo.util;

import android.graphics.Bitmap;

public class FastBlur {

    public static Bitmap doBlur(Bitmap sentBitmap, int radius, boolean canReuseInBitmap) {

        // Stack Blur v1.0 from
        // http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
        //
        // Java Author: Mario Klingemann <mario at quasimondo.com>
        // http://incubator.quasimondo.com
        // created Feburary 29, 2004
        // Android port : Yahel Bouaziz <yahel at kayenko.com>
        // http://www.kayenko.com
        // ported april 5th, 2012

        // This is a compromise between Gaussian Blur and Box blur
        // It creates much better looking blurs than Box Blur, but is
        // 7x faster than my Gaussian Blur implementation.
        //
        // I called it Stack Blur because this describes best how this
        // filter works internally: it creates a kind of moving stack
        // of colors whilst scanning through the image. Thereby it
        // just has to add one new block of color to the right side
        // of the stack and remove the leftmost color. The remaining
        // colors on the topmost layer of the stack are either added on
        // or reduced by one, depending on if they are on the right or
        // on the left side of the stack.
        //
        // If you are using this algorithm in your code please add
        // the following line:
        //
        // Stack Blur Algorithm by Mario Klingemann <mario@quasimondo.com>

        Bitmap bitmap;
        if (canReuseInBitmap) {
            bitmap = sentBitmap;
        } else {
            bitmap = sentBitmap.copy(sentBitmap.getConfig(), true);
        }

        if (radius < 1) {
            return (null);
        }

        int w = bitmap.getWidth();
        int h = bitmap.getHeight();

        int[] pix = new int[w * h];
        bitmap.getPixels(pix, 0, w, 0, 0, w, h);

        int wm = w - 1;
        int hm = h - 1;
        int wh = w * h;
        int div = radius + radius + 1;

        int r[] = new int[wh];
        int g[] = new int[wh];
        int b[] = new int[wh];
        int rsum, gsum, bsum, x, y, i, p, yp, yi, yw;
        int vmin[] = new int[Math.max(w, h)];

        int divsum = (div + 1) >> 1;
        divsum *= divsum;
        int dv[] = new int[256 * divsum];
        for (i = 0; i < 256 * divsum; i++) {
            dv[i] = (i / divsum);
        }

        yw = yi = 0;

        int[][] stack = new int[div][3];
        int stackpointer;
        int stackstart;
        int[] sir;
        int rbs;
        int r1 = radius + 1;
        int routsum, goutsum, boutsum;
        int rinsum, ginsum, binsum;

        for (y = 0; y < h; y++) {
            rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
            for (i = -radius; i <= radius; i++) {
                p = pix[yi + Math.min(wm, Math.max(i, 0))];
                sir = stack[i + radius];
                sir[0] = (p & 0xff0000) >> 16;
                sir[1] = (p & 0x00ff00) >> 8;
                sir[2] = (p & 0x0000ff);
                rbs = r1 - Math.abs(i);
                rsum += sir[0] * rbs;
                gsum += sir[1] * rbs;
                bsum += sir[2] * rbs;
                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                }
            }
            stackpointer = radius;

            for (x = 0; x < w; x++) {

                r[yi] = dv[rsum];
                g[yi] = dv[gsum];
                b[yi] = dv[bsum];

                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;

                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];

                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];

                if (y == 0) {
                    vmin[x] = Math.min(x + radius + 1, wm);
                }
                p = pix[yw + vmin[x]];

                sir[0] = (p & 0xff0000) >> 16;
                sir[1] = (p & 0x00ff00) >> 8;
                sir[2] = (p & 0x0000ff);

                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];

                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;

                stackpointer = (stackpointer + 1) % div;
                sir = stack[(stackpointer) % div];

                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];

                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];

                yi++;
            }
            yw += w;
        }
        for (x = 0; x < w; x++) {
            rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
            yp = -radius * w;
            for (i = -radius; i <= radius; i++) {
                yi = Math.max(0, yp) + x;

                sir = stack[i + radius];

                sir[0] = r[yi];
                sir[1] = g[yi];
                sir[2] = b[yi];

                rbs = r1 - Math.abs(i);

                rsum += r[yi] * rbs;
                gsum += g[yi] * rbs;
                bsum += b[yi] * rbs;

                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                }

                if (i < hm) {
                    yp += w;
                }
            }
            yi = x;
            stackpointer = radius;
            for (y = 0; y < h; y++) {
                // Preserve alpha channel: ( 0xff000000 & pix[yi] )
                pix[yi] = (0xff000000 & pix[yi]) | (dv[rsum] << 16) | (dv[gsum] << 8) | dv[bsum];

                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;

                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];

                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];

                if (x == 0) {
                    vmin[y] = Math.min(y + r1, hm) * w;
                }
                p = x + vmin[y];

                sir[0] = r[p];
                sir[1] = g[p];
                sir[2] = b[p];

                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];

                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;

                stackpointer = (stackpointer + 1) % div;
                sir = stack[stackpointer];

                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];

                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];

                yi += w;
            }
        }

        bitmap.setPixels(pix, 0, w, 0, 0, w, h);

        return (bitmap);
    }
}
```


+ **参考资料**

> 1. [Android blurring sample](https://github.com/paveldudka/blurring)
> 2. [Blurring Images – Part 1](http://blog.stylingandroid.com/blurring-images-part-1/)
> 3. [Andorid 高级模糊技术](http://segmentfault.com/a/1190000000448785)
