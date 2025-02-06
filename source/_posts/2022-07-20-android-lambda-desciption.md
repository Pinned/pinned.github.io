---
title: 在 Android 中使用 Lambda 的原理解析
styles: [syntax]
category: Java
tags: Java
---
Java 在 Android 的发展过程中，扮演了非常重要的角色。在有 Kotlin 之前，开发语言是使用的 Java ，即使现在使用的 Kotlin ， 也是会编译成 Java 的字节码。但受限于 Oracle 的版权，Google 在 Android 上针对 Java 版本的升级，支持的都很不积极。因此，在不同的 Android 版本中，对 JVM 的语法支持不一样？那要如何让高版本的语法，在低版本中的系统中运行呢？ 本文以 Java 8 中的 Lambda 表达式运行在 Android 中的原理，来了解编译过程中的二三事。

## 1. invokedynamic 指令

在很久很久以前， Java 7 版本发布的时候， JVM 中添加了 `invokedynamic` 指令， 这条指令用于支持动态语言。在静态类型机制下，方法调用中的类型分析都是在编译时执行的，编译结束就固定下来。而 `invokedynamic` 允许方法调用可以在运行时指定类和方法，不必在编译的时候确定。在 Java 7 的版本中，我们无法使用 javac 编译出含有 `invokedynamic` 指令的字节码。而在 Java 8 的版本中，支持的 lambda 表达式就是通过 `invokedynamic` 关键字来实现的。

为了更好地理解这个指令，我们先来看一下， Java 中另外四个指令

+ `invokevirtual`  用于执行对象实例方法
+ `invokestatic`  指令用于调用静态方法（即 static 关键字修饰的方法）
+ `invokeinterface`  该指令用于调用接口方法，在运行时去确定一个实现此接口的对象；
+ `invokespecial`  该指令用于三种场景：调用实例构造方法，调用私有方法（即 private关键字修饰的方法）和父类方法（即 super 关键字调用的方法）

先看个例子：

```java
import java.util.*;

class JvmInstruction {
	public static void main(String[] args) {
		JvmInstruction.run();
	}
	
	public static void run() {
		JvmInstruction instruction = new JvmInstruction();
		instruction.start();
	}
	
	public void start() {
		List<String> list = new ArrayList<String>();
		list.add("List");
		ArrayList<String> arrayList = new ArrayList<String>();
		arrayList.add("ArrayList");
	}
}
```

代码很简单，此处重点看一下编译生成的 `CLASS` 文件的格式， 通过命令可以输出方法以及方法调用指令， 命令如下：

```shell
javap -c -p JvmInstruction
```

![JvmInstruction 中方法列表及调用栈信息](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/969bbfb8a2314d498083188ce3be6257.png)

从上面的截图中，可以看到：

1. 代码中的 `JvmInstruction.run();` 编译后变成图中 11 行的 `invokestatic #2`。
2. 代码中的 `instruction.start();` 编译后变成图中 21 行的 `invokevirtual #5`
3. 代码中的 `list.add("List");` 编译后变成图中 32 行的 `invokeinterface #9, 2`
4. 代码中的 `new JvmInstruction();` 编译后变成图中 18 行的 `invokespecial #4`



通过上面的分析，相信都能理解这几条指令的静态类型。那关于 `invokedynamic` 的动态调用是什么意思呢？ 

在 `invokedynamic` 指令执行中，会先找到 Bootstrap method (BSM) ，使用 `invokestatic` 的指令，获取到真实**CallSite（调用点）**，JVM 会直接调用 `CallSite` 中绑定的 **MethodHandle(方法句柄)** 执行真实的逻辑。整个过程有点类似于反射。在 JVM 虚拟机中，CallSite 被抽象成了一个 Java 的类。如果想了解其实现原码，也可以参考 JDK 里 **rt.jar** 中对应的类。



## 2. Lambda 表达式的执行逻辑

为了更好的理解 `invokedynamic` 的执行，此处以 JAVA 8 支持的 Lambda 表达式为例，为减少内容，本例中使用了最简单的例子，先上代码： 

```java
class LambdaTest {
	public static void main(String[] args) {
		Runnable runable = () -> System.out.println("test");
		runable.run();
	}
}
```

在代码中的第三行，使用了 lambda 表达式定义了一个 Runnable 对象。编译执行会输出 `test` 。

先看一下编译后的 class 文件中的内容，使用如下命令：

```shell
javap -c -p LambdaTest
```

得到如下结果：

![CLASS 中的方法列表](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/f54ea5042f364961b949bc428a91618f.png)

在上述代码与编译后的字节码中，我们可以看到，代码中的 lambda 表达式变成了字节码中的 `11` 行，即 `0: invokedynamic #2,  0`。当然，从这个字节码中，可以看到，除了代码中写的 `main` 方法，`System.out.println("test")` 被放到了 `lambda$main$0()` 这个私有的静态方法中去了。

为了更好的看清楚 `invokedynamic` 的执行逻辑，可以通过：

```shell
javap -v LambdaTest
```

输出CLASS 文件中的常量池等信息，因文件里面的内容信息较多，省略了一些不需要关注的点，如下图所示：

![CLASS 详细信息](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/c3a95e1118d7495ea86f888364c62f9a.png)

根据上面的信息，可以看到，整个逻辑如下图所示：

![Lambda 表达式的整个过程 ](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/a0a28f6ffd564c1c8d513e233561b6a5.png)

如前文所示，在执行 `InvokeDynamic` 指令会调用 BootstapMethods，返回一个 CallSite 对象，对应代码在 rt.jar 中。

> PS: BootstapMethods 中，第一次执行时，会生成 `LambdaTest$$Lambda$1` 的 class，可以通过参数  **-Djdk.internal.lambda.dumpProxyClasses** 将生成的 class 缓存下来。

有了整体概括，再来看一下 BootstapMethod 里面的源码逻辑：

1. invokestatic 调用 LambdaMetafactory 中的 metafactory 方法

```java
public static CallSite metafactory(MethodHandles.Lookup caller,
                                   String invokedName,
                                   MethodType invokedType,
                                   MethodType samMethodType,
                                   MethodHandle implMethod,
                                   MethodType instantiatedMethodType)
  throws LambdaConversionException {
  AbstractValidatingLambdaMetafactory mf;
  // 通过传入的参数去创建 factory
  mf = new InnerClassLambdaMetafactory(caller, invokedType,
                                       invokedName, samMethodType,
                                       implMethod, instantiatedMethodType,
                                       false, EMPTY_CLASS_ARRAY, EMPTY_MT_ARRAY);
  mf.validateMetafactoryArgs();
  // 返回 JVM invokedymaic 需要的 CallSite
  return mf.buildCallSite();
}

```

2. InnerClassLambdaMetafactory 的初始化过程

```java
public InnerClassLambdaMetafactory(MethodHandles.Lookup caller,
                                   MethodType invokedType,
                                   String samMethodName,
                                   MethodType samMethodType,
                                   MethodHandle implMethod,
                                   MethodType instantiatedMethodType,
                                   boolean isSerializable,
                                   Class<?>[] markerInterfaces,
                                   MethodType[] additionalBridges)
  throws LambdaConversionException {
  super(caller, invokedType, samMethodName, samMethodType,
        implMethod, instantiatedMethodType,
        isSerializable, markerInterfaces, additionalBridges);
  implMethodClassName = implDefiningClass.getName().replace('.', '/');
  implMethodName = implInfo.getName();
  implMethodDesc = implMethodType.toMethodDescriptorString();
  implMethodReturnClass = (implKind == MethodHandleInfo.REF_newInvokeSpecial)
    ? implDefiningClass
    : implMethodType.returnType();
  constructorType = invokedType.changeReturnType(Void.TYPE);
  // 拿到要生成的 lambdaClassName, 即本例中的 LambdaTest$$Lambda$1
  lambdaClassName = targetClass.getName().replace('.', '/') + "$$Lambda$" + counter.incrementAndGet();
  // 使用 ClassWriter 生成最后的 class 文件
  cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
  int parameterCount = invokedType.parameterCount();
  if (parameterCount > 0) {
    argNames = new String[parameterCount];
    argDescs = new String[parameterCount];
    for (int i = 0; i < parameterCount; i++) {
      argNames[i] = "arg$" + (i + 1);
      argDescs[i] = BytecodeDescriptor.unparse(invokedType.parameterType(i));
    }
  } else {
    argNames = argDescs = EMPTY_STRING_ARRAY;
  }
}
```

因此， `runable.run();` 相当于调用了 `LambdaTest$$Lambda$1().run()`，而在生成的这个 `class` 文件中，又调用了 `LambdaTest.lambda$main$0()`。



## 3. Lambda 表达式脱糖（Desugaring）

前面讲到了 Lambda 在高版本 JVM 中，使用 InvokeDynamic 指令，得以在运行时，执行 Lambda 表达式，那针对 Android 来讲，低版本 Android OS 无法执行，要怎么样处理呢？答案是脱糖。

![Android 中 Java 文件变成 Dex 的过程](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/e308940a26dc4d00b5c2b4ede7191d1b.png)

在 D8/R8 中，进行了 class 文件到 Dex 文件的优化，并且在这一步完成了脱糖。脱糖的实现思路是什么样子的？ 本文以开源库的 retrolambda 为例分析，脱糖的过程。

> PS： R8 将 Proguard 整合，故没有单独的 Proguard 流程。

从前面的内容中，我们知道 Lambda 在执行中，使用的是 `invokedynamic` 来实现的，要在低版本中执行，那就需要把这个指令换成低版本 JVM 支持的指令。在前文提到， Lambda 表达式，在运行的时候，会动态生成 `LambdaTest$$Lambda$1.class` ， 在脱糖的过程中，将动态生成的逻辑，前置到编译时完成即可。

### 3.1 LambdaTest.class 读取

为了方便读取 Class 文件的内容，在 `retrolambda` 库中使用了 `org.ow2.asm:asm-all:5.2` 进行 Class 读取与生成。 有关 asm 的使用，可以参考其官方文档，此处不进行讨论。

使用 ASM 遍历现有的 class 文件，找到方法中，使用了 invokedynamic 的位置，此处使用的是BSM来查找的，Lambda 表达式编译后，使用的是 `java/lang/invoke/LambdaMetafactory`，处理代码逻辑如下：

```java 
@Override
public void visitInvokeDynamicInsn(String name, String desc, Handle bsm, Object... bsmArgs) {
  // 此处找到 BSM 为 LambdaMetafactory 的调用点，将此处的调用使用我们生成的代码进行替换。
  if (bsm.getOwner().equals("java/lang/invoke/LambdaMetafactory")) {
    backportLambda(name, Type.getType(desc), bsm, bsmArgs);
  } else {
    super.visitInvokeDynamicInsn(name, desc, bsm, bsmArgs);
  }
}

private void backportLambda(String invokedName, Type invokedType, Handle bsm, Object[] bsmArgs) {
  Class<?> invoker = loadClass(className);
  Handle implMethod = (Handle) bsmArgs[1];
  Handle accessMethod = implMethod;
  EnclosingClass enclosingClass = new EnclosingClass();
  enclosingClass.sourceFile = source;
  // 获取生成的Lambda 的class 名： LambdaTest$$Lambda$1, 方法为固定的 lambdaFactory$
  LambdaFactoryMethod factory = LambdaReifier.reifyLambdaClass(enclosingClass, implMethod, accessMethod,
                                                               invoker, invokedName, invokedType, bsm, bsmArgs);
  // invokestatic  #19  // Method LambdaTest$$Lambda$1.lambdaFactory$:()Ljava/lang/Runnable;
  super.visitMethodInsn(INVOKESTATIC, factory.getOwner(), factory.getName(), factory.getDesc(), false);
}
```

### 3.2  LambdaTest$$Lambda$1.class 的生成

在前面的 lambda 执行的流程中，可以在运行时添加 jvm 参数 `-Djdk.internal.lambda.dumpProxyClasses` 来生成 LambdaTest$$Lambda$1.class 文件。因此，在脱糖的过程中，也可以使用它来实现 class 文件生成。

在步骤 1 中，通过遍历所有的 method 的内容，查找到 **LambdaMetafactory** 的调用点，这个时候，可以模拟调用 LambdaMetafactory， 代码实现如下： 

```java
// 此处的 bsm 就是 class 文件中， bootstrap 中定义的那个 bsm
private static CallSite callBootstrapMethod(Class<?> invoker, String invokedName, Type invokedType, Handle bsm, Object[] bsmArgs) throws Throwable {
  ClassLoader cl = invoker.getClassLoader();
  MethodHandles.Lookup caller = getLookup(invoker);

  List<Object> args = new ArrayList<>();
  args.add(caller);
  args.add(invokedName);
  args.add(toMethodType(invokedType, cl));
  for (Object arg : bsmArgs) {
    args.add(asmToJdkType(arg, cl, caller));
  }

  MethodHandle bootstrapMethod = toMethodHandle(bsm, cl, caller);
  // 使用 MethodHandle 模拟调用，会触发 class 文件生成。
  return (CallSite) bootstrapMethod.invokeWithArguments(args);
}
```

### 3.3 代理 dummper

JVM 运行时使用的是 InnerClassLambdaMetafactory 进行类生成的，可以通过反射，修改实例变量  `dumper` 来实现缓存生成的 Class 文件。实现代码如下：

```java
public void install() {
  try {
    Class<?> mf = Class.forName("java.lang.invoke.InnerClassLambdaMetafactory");
    dumperField = mf.getDeclaredField("dumper");
    makeNonFinal(dumperField);
    dumperField.setAccessible(true);

    Path p = new VirtualPath("");
    dumperField.set(null, newProxyClassesDumper(p));
  } catch (Exception e) {
    throw new IllegalStateException("Cannot initialize dumper; unexpected JDK implementation. " +
                                    "Please run Retrolambda using the Java agent (enable forking in the Maven plugin).", e);
  }
}
```

### 3.4 lambdaFactory$ 方法生成

读取第 3 步产生的 class 文件，并为其添加 instance 实例以及 factory method ， 生成代码类似： 

```java
// 需要添加的实例
private static final LambdaTest$$Lambda$1 instance = new LambdaTest$$Lambda$1();
// factory 方法。
public static Runnable lambdaFactory$() {
  return instance;
}
```

在 `visitEnd` 的时候，添加 `instance` 以及 `lambdaFactory$`方法到 class 文件中，实现代码如下：

```java
@Override
public void visitEnd() {
  makeSingleton();
  generateFactoryMethod();
  if (sourceFile == null) {
    sourceFile = enclosingClass.sourceFile;
  }
  super.visitSource(sourceFile, sourceDebug);
  super.visitEnd();
}

private void makeSingleton() {
  FieldVisitor fv = super.visitField(ACC_PRIVATE | ACC_STATIC | ACC_FINAL,
                                     SINGLETON_FIELD_NAME, singletonFieldDesc(), null, null);
  fv.visitEnd();

  MethodVisitor mv = super.visitMethod(ACC_STATIC, "<clinit>", "()V", null, null);
  mv.visitCode();
  mv.visitTypeInsn(NEW, lambdaClass);
  mv.visitInsn(DUP);
  mv.visitMethodInsn(INVOKESPECIAL, lambdaClass, "<init>", "()V", false);
  mv.visitFieldInsn(PUTSTATIC, lambdaClass, SINGLETON_FIELD_NAME, singletonFieldDesc());
  mv.visitInsn(RETURN);
  mv.visitMaxs(-1, -1); // rely on ClassWriter.COMPUTE_MAXS
  mv.visitEnd();
}

private void generateFactoryMethod() {
  MethodVisitor mv = cv.visitMethod(ACC_PUBLIC | ACC_STATIC,
                                    factoryMethod.getName(), factoryMethod.getDesc(), null, null);
  mv.visitCode();
  mv.visitFieldInsn(GETSTATIC, lambdaClass, SINGLETON_FIELD_NAME, singletonFieldDesc());
  mv.visitInsn(ARETURN);
  mv.visitMaxs(-1, -1); // rely on ClassWriter.COMPUTE_MAXS
  mv.visitEnd();
}
```

### 3.5 结果

为了更清晰地理解结果，此处使用 `java -c -p ` 将 class 文件中所有的方法都打印出来，如下图所示：

![脱糖后的 LambdaTest.class](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/b68bfa4e3a1b4c3b8b61fdad736eff12.png)

![生成的 LabdaTest$$Lambda$1.class](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/855cad054761409fa063dc903bc4b1ff.png)



## 4. 思考

有了上面的脱糖流程，既然可以在编译时，就能实现 lambda 的逻辑，为什么还要添加 `invokedynamic` 指令呢？ 这不得不提 Java 是一种静态类型语言，所有的东西都是在编译时都已经确定好了，静态类型的语言在运行相对效率更高，但灵活性就有所降低。而 `invokedynamic` 的设计就是让 JVM 可以更加的灵活，让基于 JVM 的语言设计者，可以有更多的自由度。




