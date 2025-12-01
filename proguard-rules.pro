# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# ============================================
# React Native Core
# ============================================
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class com.facebook.flipper.** { *; }

# React Native classes that are referenced in JS
-keep @interface com.facebook.proguard.annotations.DoNotStrip
-keep @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

# Keep native method names
-keepclasseswithmembernames class * {
    native <methods>;
}

# ============================================
# Expo Modules (SDK 54)
# ============================================
-keep class expo.modules.** { *; }
-keep class org.unimodules.** { *; }
-keep interface expo.modules.interfaces.** { *; }

# Expo core
-keep class expo.core.** { *; }
-keep class expo.modules.core.** { *; }

# Expo modules that use reflection
-keepclassmembers class expo.modules.** {
    public <init>(...);
}

# ============================================
# React Navigation
# ============================================
-keep class com.swmansion.** { *; }
-keep class com.reactnavigation.** { *; }

# ============================================
# React Native Safe Area Context
# ============================================
-keep class com.th3rdwave.safeareacontext.** { *; }

# ============================================
# React Native Screens
# ============================================
-keep class com.swmansion.rnscreens.** { *; }

# ============================================
# AsyncStorage
# ============================================
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# ============================================
# WebView
# ============================================
-keep class com.reactnativecommunity.webview.** { *; }

# ============================================
# Expo Specific Modules
# ============================================
# Expo Location
-keep class expo.modules.location.** { *; }

# Expo Image Picker
-keep class expo.modules.imagepicker.** { *; }

# Expo Font
-keep class expo.modules.font.** { *; }

# Expo Linear Gradient
-keep class expo.modules.lineargradient.** { *; }

# Expo Blur
-keep class expo.modules.blur.** { *; }

# Expo Local Authentication
-keep class expo.modules.localauthentication.** { *; }

# Expo Splash Screen
-keep class expo.modules.splashscreen.** { *; }

# Expo Status Bar
-keep class expo.modules.statusbar.** { *; }

# ============================================
# JSON Serialization
# ============================================
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ============================================
# Remove Logging in Release Builds
# ============================================
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# ============================================
# Keep JavaScript Interface
# ============================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ============================================
# Keep Annotation default values
# ============================================
-keepattributes AnnotationDefault

# ============================================
# Keep Native methods and JNI
# ============================================
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# ============================================
# Keep custom views and classes used in layouts
# ============================================
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
    *** get*();
}

# Keep custom Application class
-keep public class * extends android.app.Application {
    public <init>();
}

