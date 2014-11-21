---
layout: post
styles: [syntax]
title: Android ViewPager滑动事件
category: android
---

ViewPager的滑动事件，是使用的OnPageChangeListener，他有三个方法:

`onPageScrollStateChanged`, `onPageScrolled`,`onPageSelected`

下面来解释一下这三个方法：

1. **onPageScrollStateChanged**

 ```java
 public void onPageScrollStateChanged(int arg0) {
 }
 ```
 
 其中arg0这个参数有三种状态（0，1，2）

 + arg0==1的时辰默示正在滑动 

 + arg0==2的时辰默示滑动完毕了
 
 + arg0==0的时辰默示什么都没做。

2. **onPageScrolled**
 
 ```java
 public void onPageScrolled(int arg0, float arg1, int arg2) {
 }
 ```
 其中三个参数的含义分别为：
 + arg0 :当前页面，及你点击滑动的页面
 + arg1:当前页面偏移的百分比
 + arg2:当前页面偏移的像素位置  
 
 > arg0 是滑动过程中的较小那一页的下标
 > 即，如果是从左往右滑动，arg0为将要出现那一页的下标，也就是说页码小的那一页的下标
 > 如果是从右往左滑动，arg0为滑动前显示的那一页的下标，也就是页码小的那一页的下标

3. **onPageSelected**

 ```java
 public void onPageSelected(int arg0) {
 }
 ```
 
 此方法是页面跳转完后得到调用，arg0是你当前选中的页面的Position（位置编号）



 **最佳实践**
 
  ```java
    @Override  
    public void onPageScrolled(int position, float positionOffset,  int positionOffsetPixels) {  
        if (positionOffset > 0) {  
            ChangeColorIconWithTextView left = mTabIndicator.get(position);  
            ChangeColorIconWithTextView right = mTabIndicator.get(position + 1);  
  
            left.setIconAlpha(1 - positionOffset);  
            right.setIconAlpha(positionOffset);  
        }  
    } 
     @Override  
    public void onClick(View v) {  
        resetOtherTabs();  
        switch (v.getId()) {  
        case R.id.id_indicator_one:  
            mTabIndicator.get(0).setIconAlpha(1.0f);  
            mViewPager.setCurrentItem(0, false);  
            break;  
        case R.id.id_indicator_two:  
            mTabIndicator.get(1).setIconAlpha(1.0f);  
            mViewPager.setCurrentItem(1, false);  
            break;  
        case R.id.id_indicator_three:  
            mTabIndicator.get(2).setIconAlpha(1.0f);  
            mViewPager.setCurrentItem(2, false);  
            break;  
        case R.id.id_indicator_four:  
            mTabIndicator.get(3).setIconAlpha(1.0f);  
            mViewPager.setCurrentItem(3, false);  
            break;  
        }  
    }  
  ```