cordova build android --release 
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Volumes/SecureDisk/Keys/persoenlikeitsDiagnostik-key.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk alias_name
~/Library/Android/sdk/build-tools/25.0.2/zipalign -f -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk ~/Downloads/persoenlichkeitsDiagnostik-armv7.apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Volumes/SecureDisk/Keys/persoenlikeitsDiagnostik-key.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk alias_name
~/Library/Android/sdk/build-tools/25.0.2/zipalign -f -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk ~/Downloads/persoenlichkeitsDiagnostik-x86.apk
