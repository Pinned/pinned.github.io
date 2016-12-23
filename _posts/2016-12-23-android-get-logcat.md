---
title: 获取Logcat信息
type: snippet
---

```java
private void getLogcat( final LogcatListener listener ) {

    new Thread() {
        @Override
        public void run() {
            try {
                String processId = Integer.toString( android.os.Process.myPid() );
                String[] command = new String[]{
                        "logcat",
                        "-d",
                        "-v",
                        "threadtime"
                };
                Process process = Runtime.getRuntime().exec( command );
                BufferedReader bufferedReader = new BufferedReader( new InputStreamReader( process
                        .getInputStream() ) );

                StringBuilder log = new StringBuilder();
                String line;
                while ( ( line = bufferedReader.readLine() ) != null ) {
                    if ( line.contains( processId ) ) {
                        int lineColor = verboseColor;

                        if ( line.contains( " I " ) ) {
                            lineColor = infoColor;
                        } else if ( line.contains( " E " ) ) {
                            lineColor = errorColor;
                        } else if ( line.contains( " D " ) ) {
                            lineColor = debugColor;
                        } else if ( line.contains( " W " ) ) {
                            lineColor = warningColor;
                        }

                        log.append( "<font color=\"#" + Integer.toHexString( lineColor )
                                .toUpperCase()
                                .substring( 2 ) + "\">" + line + "</font><br><br>" );
                    }
                }
                listener.onLogcatCaptured( log.toString() );
            } catch ( Exception e ) {
                e.printStackTrace();
            }
        }
    }.start();
}

```java