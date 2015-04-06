---
title: gradle打包的时候，自动重命名APK文件
type: snippet
---

```bash
android.applicationVariants.all { variant ->
    variant.outputs.each { output ->
        def outputFile = output.outputFile
        if (outputFile != null && outputFile.name.endsWith('.apk')) {
            def fileName = outputFile.name.replace(".apk", "-${defaultConfig.versionName}-${ defaultConfig.versionCode}.apk")
            output.outputFile = new File(outputFile.parent, fileName)
        }
    }
}
```