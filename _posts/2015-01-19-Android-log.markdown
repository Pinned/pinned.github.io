---
layout: post
styles: [syntax]
title: Creating logs in Android applications
category: android
---

For Android applications, logging is handled by the android.util.Log class, which is a basic logging class that stores the logs in a circular buffer for the whole device. All logs for the device can be seen in the LogCat tab in Eclipse, or read using the logcat command. Here is a standard log output for the LogCat tab in Eclipse :

![Eclipse Image](./image.png)

There are five levels of logs you can use in your application, for the most verbose to the least verbose :

+ **Verbose**: For extra information messages that are only compiled in a debug application, but never included in a release application.
+ **Debug**: For debug log messages that are always compiled, but stripped at runtime in a release application.
+ **Info**: For an information in the logs that will be written in debug and release.
+ **Warning**: For a warning in the logs that will be written in debug and release.
+ **Error**: For an error in the logs that will be written in debug and release.

A log message includes a tag identifying a group of messages and the message. By default the log level of all tags is Info, which means than messages that are of level Debug and Verbose should never shown unless the setprop command is used to change the log level. So, to write a verbose message to the log, you should call the isLoggable method to check if the message can be logged, and call the logging method :

```java
if (!Log.isLoggable(logMessageTag, Log.Verbose))
   Log.v("MyApplicationTag", logMessage);
```

And to show the Debug and Verbose log message for a specific tag, run the setprop command while your device is plugged in. If you reboot the device you will have to run the command again.

```html
adb shell setprop log.tag.MyApplicationTag VERBOSE
```

Unfortunately, starting  with Android 4.0, an application can only read its own logs. It was useful for debugging to be able to read logs from another application, but in some cases sensitive information was written in those logs, and malicious apps were created to retrieve them. So if you need to have logs files send to you for debugging, you will need to create your own log class using the methods from the android.util.Log class. Remember, only Info, Warning and Error logs should be shown when the application is not run in debug mode.  Here is an example of a simple logger wrapping the call to isLoggable and storing the logs messages on the primary storage of the device (requires the permission WRITE_EXTERNAL_STORAGE) and to the standard buffer :

```java
/**
  * A logger that uses the standard Android Log class to log exceptions, and also logs them to a 
  * file on the device. Requires permission WRITE_EXTERNAL_STORAGE in AndroidManifest.xml.
  * @author Cindy Potvin
  */
 public class Logger
 {
 /**
   * Sends an error message to LogCat and to a log file.
   * @param context The context of the application.
   * @param logMessageTag A tag identifying a group of log messages. Should be a constant in the 
   *                      class calling the logger.
   * @param logMessage The message to add to the log.
   */
 public static void e(Context context, String logMessageTag, String logMessage) 
    {
    if (!Log.isLoggable(logMessageTag, Log.ERROR))
       return;

    int logResult = Log.e(logMessageTag, logMessage);
    if (logResult > 0) 
       logToFile(context, logMessageTag, logMessage);
    }

/**
   * Sends an error message and the exception to LogCat and to a log file.
   * @param context The context of the application.
   * @param logMessageTag A tag identifying a group of log messages. Should be a constant in the 
   *                      class calling the logger.
   * @param logMessage The message to add to the log.
   * @param throwableException An exception to log
   */
 public static void e(Context context, String logMessageTag, String logMessage, Throwable throwableException) 
    {
    if (!Log.isLoggable(logMessageTag, Log.ERROR))
       return;

    int logResult = Log.e(logMessageTag, logMessage, throwableException);
    if (logResult > 0) 
       logToFile(context, logMessageTag, logMessage + "\r\n" + Log.getStackTraceString(throwableException));
    }

// The i and w method for info and warning logs should be implemented in the same way as the e method for error logs.

/**
   * Sends a message to LogCat and to a log file.
   * @param context The context of the application.
   * @param logMessageTag A tag identifying a group of log messages. Should be a constant in the 
   *                      class calling the logger.
   * @param logMessage The message to add to the log.
   */
 public static void v(Context context, String logMessageTag, String logMessage) 
    {
                              // If the build is not debug, do not try to log, the logcat be 
                              // stripped at compilation.
    if (!BuildConfig.DEBUG || !Log.isLoggable(logMessageTag, Log.VERBOSE))
        return;

    int logResult = Log.v(logMessageTag, logMessage);
    if (logResult > 0) 
       logToFile(context, logMessageTag, logMessage);
    }

/**
   * Sends a message and the exception to LogCat and to a log file.
   * @param logMessageTag A tag identifying a group of log messages. Should be a constant in the 
   *                      class calling the logger.
   * @param logMessage The message to add to the log.
   * @param throwableException An exception to log
   */
 public static void v(Context context,String logMessageTag, String logMessage, Throwable throwableException) 
    {
                              // If the build is not debug, do not try to log, the logcat be 
                              // stripped at compilation.
    if (!BuildConfig.DEBUG || !Log.isLoggable(logMessageTag, Log.VERBOSE))
        return;

    int logResult = Log.v(logMessageTag, logMessage, throwableException);
    if (logResult > 0) 
       logToFile(context, logMessageTag,  logMessage + "\r\n" + Log.getStackTraceString(throwableException));
    }

// The d method for debug logs should be implemented in the same way as the v method for verbose logs.

/**
  * Gets a stamp containing the current date and time to write to the log.
  * @return The stamp for the current date and time.
  */
 private static String getDateTimeStamp()
    {
    Date dateNow = Calendar.getInstance().getTime();
                              // My locale, so all the log files have the same date and time format
    return (DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT, Locale.CANADA_FRENCH).format(dateNow));
    }

/**
  * Writes a message to the log file on the device.
  * @param logMessageTag A tag identifying a group of log messages.
  * @param logMessage The message to add to the log.
  */
 private static void logToFile(Context context, String logMessageTag, String logMessage)
    {
    try
       {
                              // Gets the log file from the root of the primary storage. If it does 
                              // not exist, the file is created.
       File logFile = new File(Environment.getExternalStorageDirectory(), "TestApplicationLog.txt");
       if (!logFile.exists())
          logFile.createNewFile();
                              // Write the message to the log with a timestamp
       BufferedWriter writer = new BufferedWriter(new FileWriter(logFile, true));
       writer.write(String.format("%1s [%2s]:%3s\r\n", getDateTimeStamp(), logMessageTag, logMessage));
       writer.close();
                              // Refresh the data so it can seen when the device is plugged in a 
                              // computer. You may have to unplug and replug to see the latest 
                              // changes
      MediaScannerConnection.scanFile(context, 
                                      new String[] { logFile.toString() }, 
                                      null, 
                                      null);

       }
    catch (IOException e)
       {
       Log.e("com.cindypotvin.Logger", "Unable to log exception to file.");
       }
    }
 }
```

If you release an application to the app store or to a client with this kind of logger, you should disable logging by default and add a switch in the preferences to enable logging on demand. If the logger is always enabled, your application will often write to the primary storage and to the logcat, which is an unnecessary overhead when everything works correctly. Also, the size of the log file should be limited in some way to avoid filling up the primary storage.