---
layout: post
styles: [syntax]
title: Ubuntu-14.04下Eclipse闪退解决办法
category: tools_using
---

### 问题描述

打开Eclipse，有时候还可以使用一下，有时候使用都不行。

当Eclipse闪退的时候，还会在Eclipse 文件夹下生成一个`hs_err_pidxxxx.log`的文件，
内容如下:

```html 
#
# A fatal error has been detected by the Java Runtime Environment:
#
#  SIGSEGV (0xb) at pc=0x00007ffd09a902a1, pid=5291, tid=140726369949440
#
# JRE version: 7.0_25-b15
# Java VM: Java HotSpot(TM) 64-Bit Server VM (23.25-b01 mixed mode linux-amd64 compressed oops)
# Problematic frame:
# C  [libsoup-2.4.so.1+0x6c2a1]  soup_session_feature_detach+0x11
#
# Failed to write core dump. Core dumps have been disabled. To enable core dumping, try "ulimit -c unlimited" before starting Java again
#
# If you would like to submit a bug report, please visit:
#   http://bugreport.sun.com/bugreport/crash.jsp
# The crash happened outside the Java Virtual Machine in native code.
# See problematic frame for where to report the bug.
#

---------------  T H R E A D  ---------------

Current thread (0x00007ffd60009800):  JavaThread "main" [_thread_in_native, id=5292, stack(0x00007ffd693a9000,0x00007ffd694aa000)]

siginfo:si_signo=SIGSEGV: si_errno=0, si_code=1 (SEGV_MAPERR), si_addr=0x0000000000000000

Registers:
RAX=0x00007ffd61c3a580, RBX=0x0000000000000000, RCX=0x0000000000000001, RDX=0x00007ffd694cf968
RSP=0x00007ffd694a7290, RBP=0x00007ffd60df46a0, RSI=0x00007ffd60df46a0, RDI=0x0000000000000000
R8 =0x0000000000000000, R9 =0x00007ffd61a1b0e0, R10=0x00007ffd694a6e70, R11=0x00007ffd694a6f70
R12=0x0000000000000000, R13=0x00000000b52f7250, R14=0x00007ffd694a7370, R15=0x00007ffd60009800
RIP=0x00007ffd09a902a1, EFLAGS=0x0000000000010202, CSGSFS=0x0000000000000033, ERR=0x0000000000000004
  TRAPNO=0x000000000000000e

Top of Stack: (sp=0x00007ffd694a7290)
0x00007ffd694a7290:   00007ffd61a202b0 00007ffd60df46a0
0x00007ffd694a72a0:   0000000000000000 00007ffd12430aa9
0x00007ffd694a72b0:   00007ffd694a7338 00000000b52f7250
0x00007ffd694a72c0:   00007ffd694a7338 00007ffd5d011f90
0x00007ffd694a72d0:   0000000000000000 00007ffd0c0c83f0
0x00007ffd694a72e0:   00007ffd60009800 00007ffd694a72e8
0x00007ffd694a72f0:   00007ffd60009800 00007ffd694a72f8
0x00007ffd694a7300:   00000000b52f7250 00007ffd694a7370
0x00007ffd694a7310:   00000000b5300340 0000000000000000
0x00007ffd694a7320:   00000000b52f7250 0000000000000000
0x00007ffd694a7330:   00007ffd694a7358 00007ffd694a73b8
0x00007ffd694a7340:   00007ffd5d006158 00000000edb807b0
0x00007ffd694a7350:   00007ffd5d00edd8 00007ffd60df46a0
0x00007ffd694a7360:   00007ffd60009800 0000000000000000
0x00007ffd694a7370:   0000000000000001 00007ffd694a7378
0x00007ffd694a7380:   00000000b52f7359 00007ffd694a73e8
0x00007ffd694a7390:   00000000b5300340 0000000000000000
0x00007ffd694a73a0:   00000000b52f7398 00007ffd694a7358
0x00007ffd694a73b0:   00007ffd694a73d0 00007ffd694a7430
0x00007ffd694a73c0:   00007ffd5d006158 0000000000000000
0x00007ffd694a73d0:   00007ffd60df46a0 0000000000000000
0x00007ffd694a73e0:   0000000000000000 0000000000000000
0x00007ffd694a73f0:   00007ffd694a73f0 00000000b52e2cd0
0x00007ffd694a7400:   00007ffd694a74b8 00000000b52eb978
0x00007ffd694a7410:   0000000000000000 00000000b52e2f70
0x00007ffd694a7420:   00007ffd694a73d0 00007ffd694a74a8
0x00007ffd694a7430:   00007ffd694a7500 00007ffd5d006158
0x00007ffd694a7440:   0000000000000000 0000000000000000
0x00007ffd694a7450:   0000000000000000 0000000000000000
0x00007ffd694a7460:   0000000000000000 0000000000000000
0x00007ffd694a7470:   0000000000000000 00007ffd60df46a0
0x00007ffd694a7480:   0000000000000000 00000000edbd1e68 

Instructions: (pc=0x00007ffd09a902a1)
0x00007ffd09a90281:   83 c4 08 48 89 df 5b 48 89 ee 5d ff e0 66 90 55
0x00007ffd09a90291:   48 89 f5 53 48 89 fb 48 83 ec 08 e8 2f fd ff ff
0x00007ffd09a902a1:   48 8b 3b 48 89 c6 e8 84 b5 fc ff 48 8b 40 18 48
0x00007ffd09a902b1:   83 c4 08 48 89 df 5b 48 89 ee 5d ff e0 66 90 55 

Register to memory mapping:

RAX=0x00007ffd61c3a580 is an unknown value
RBX=0x0000000000000000 is an unknown value
RCX=0x0000000000000001 is an unknown value
RDX=0x00007ffd694cf968: _rtld_global+0x908 in /lib64/ld-linux-x86-64.so.2 at 0x00007ffd692ac000
RSP=0x00007ffd694a7290 is pointing into the stack for thread: 0x00007ffd60009800
RBP=0x00007ffd60df46a0 is an unknown value
RSI=0x00007ffd60df46a0 is an unknown value
RDI=0x0000000000000000 is an unknown value
R8 =0x0000000000000000 is an unknown value
R9 =0x00007ffd61a1b0e0 is an unknown value
R10=0x00007ffd694a6e70 is pointing into the stack for thread: 0x00007ffd60009800
R11=0x00007ffd694a6f70 is pointing into the stack for thread: 0x00007ffd60009800
R12=0x0000000000000000 is an unknown value
R13=0x00000000b52f7250 is an oop
{method} 
 - klass: {other class}
R14=0x00007ffd694a7370 is pointing into the stack for thread: 0x00007ffd60009800
R15=0x00007ffd60009800 is a thread


Stack: [0x00007ffd693a9000,0x00007ffd694aa000],  sp=0x00007ffd694a7290,  free space=1016k
Native frames: (J=compiled Java code, j=interpreted, Vv=VM code, C=native code)
C  [libsoup-2.4.so.1+0x6c2a1]  soup_session_feature_detach+0x11

Java frames: (J=compiled Java code, j=interpreted, Vv=VM code)
j  org.eclipse.swt.internal.webkit.WebKitGTK._soup_session_feature_detach(JJ)V+0
j  org.eclipse.swt.internal.webkit.WebKitGTK.soup_session_feature_detach(JJ)V+9
j  org.eclipse.swt.browser.WebKit.create(Lorg/eclipse/swt/widgets/Composite;I)V+920
j  org.eclipse.swt.browser.Browser.<init>(Lorg/eclipse/swt/widgets/Composite;I)V+81
j  org.eclipse.jface.internal.text.html.BrowserInformationControl.isAvailable(Lorg/eclipse/swt/widgets/Composite;)Z+12
j  org.eclipse.jdt.internal.ui.text.java.AbstractJavaCompletionProposal.getInformationControlCreator()Lorg/eclipse/jface/text/IInformationControlCreator;+9
j  org.eclipse.jface.text.contentassist.AdditionalInfoController.computeInformation()V+18
j  org.eclipse.jface.text.AbstractInformationControlManager.doShowInformation()V+11
j  org.eclipse.jface.text.AbstractInformationControlManager.showInformation()V+8
j  org.eclipse.jface.text.contentassist.AdditionalInfoController.showInformation(Lorg/eclipse/jface/text/contentassist/ICompletionProposal;Ljava/lang/Object;)V+64
j  org.eclipse.jface.text.contentassist.AdditionalInfoController$10.showInformation(Lorg/eclipse/jface/text/contentassist/ICompletionProposal;Ljava/lang/Object;)V+25
j  org.eclipse.jface.text.contentassist.AdditionalInfoController$9.run()V+36
j  org.eclipse.swt.widgets.RunnableLock.run()V+11
j  org.eclipse.swt.widgets.Synchronizer.runAsyncMessages(Z)Z+29
j  org.eclipse.swt.widgets.Display.runAsyncMessages(Z)Z+5
j  org.eclipse.swt.widgets.Display.readAndDispatch()Z+61
j  org.eclipse.e4.ui.internal.workbench.swt.PartRenderingEngine$9.run()V+606
j  org.eclipse.core.databinding.observable.Realm.runWithDefault(Lorg/eclipse/core/databinding/observable/Realm;Ljava/lang/Runnable;)V+12
j  org.eclipse.e4.ui.internal.workbench.swt.PartRenderingEngine.run(Lorg/eclipse/e4/ui/model/application/MApplicationElement;Lorg/eclipse/e4/core/contexts/IEclipseContext;)Ljava/lang/Object;+57
j  org.eclipse.e4.ui.internal.workbench.E4Workbench.createAndRunUI(Lorg/eclipse/e4/ui/model/application/MApplicationElement;)V+20
j  org.eclipse.ui.internal.Workbench$5.run()V+256
j  org.eclipse.core.databinding.observable.Realm.runWithDefault(Lorg/eclipse/core/databinding/observable/Realm;Ljava/lang/Runnable;)V+12
j  org.eclipse.ui.internal.Workbench.createAndRunWorkbench(Lorg/eclipse/swt/widgets/Display;Lorg/eclipse/ui/application/WorkbenchAdvisor;)I+18
j  org.eclipse.ui.PlatformUI.createAndRunWorkbench(Lorg/eclipse/swt/widgets/Display;Lorg/eclipse/ui/application/WorkbenchAdvisor;)I+2
j  org.eclipse.ui.internal.ide.application.IDEApplication.start(Lorg/eclipse/equinox/app/IApplicationContext;)Ljava/lang/Object;+108
j  org.eclipse.equinox.internal.app.EclipseAppHandle.run(Ljava/lang/Object;)Ljava/lang/Object;+135
j  org.eclipse.core.runtime.internal.adaptor.EclipseAppLauncher.runApplication(Ljava/lang/Object;)Ljava/lang/Object;+103
j  org.eclipse.core.runtime.internal.adaptor.EclipseAppLauncher.start(Ljava/lang/Object;)Ljava/lang/Object;+29
j  org.eclipse.core.runtime.adaptor.EclipseStarter.run(Ljava/lang/Object;)Ljava/lang/Object;+149
j  org.eclipse.core.runtime.adaptor.EclipseStarter.run([Ljava/lang/String;Ljava/lang/Runnable;)Ljava/lang/Object;+183
v  ~StubRoutines::call_stub
j  sun.reflect.NativeMethodAccessorImpl.invoke0(Ljava/lang/reflect/Method;Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;+0
j  sun.reflect.NativeMethodAccessorImpl.invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;+87
j  sun.reflect.DelegatingMethodAccessorImpl.invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;+6
j  java.lang.reflect.Method.invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;+57
j  org.eclipse.equinox.launcher.Main.invokeFramework([Ljava/lang/String;[Ljava/net/URL;)V+211
j  org.eclipse.equinox.launcher.Main.basicRun([Ljava/lang/String;)V+126
j  org.eclipse.equinox.launcher.Main.run([Ljava/lang/String;)I+4
j  org.eclipse.equinox.launcher.Main.main([Ljava/lang/String;)V+10
v  ~StubRoutines::call_stub
```

巨大一堆日志文件，完全看不懂。
用`C  [libsoup-2.4.so.1+0x6c2a1]  soup_session_feature_detach+0x11`百度一下，竟然有解决办法:

### 解决办法

打开Eclipse文件夹下面的`eclipse.ini`
在最下面添加

```html
-Dorg.eclipse.swt.browser.DefaultType=mozilla
```

完美解决问题。

### 参考资料

+ [Ubuntu64位下使用eclipse闪退的解决](http://my.oschina.net/u/1446823/blog/294736)


