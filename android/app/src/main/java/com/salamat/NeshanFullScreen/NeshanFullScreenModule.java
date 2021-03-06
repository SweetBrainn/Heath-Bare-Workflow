package com.salamat.NeshanFullScreen;

import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NeshanFullScreenModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context = getReactApplicationContext();

    public NeshanFullScreenModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "NeshanFullScreenModule";
    }

//    @ReactMethod
//    public void navigateToNative(double Id, String Title, String token) {
//        Toast.makeText(context, String.valueOf(Id), Toast.LENGTH_SHORT).show();
//        Intent intent = new Intent(context, NeshanFullScreenActivity.class);
//        if (intent.resolveActivity(context.getPackageManager()) != null) {
//            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            context.startActivity(intent);
//        }
//    }

    @ReactMethod
    public void navigateToNative(String latitude, String longitude) {
        Intent intent = new Intent(context, NeshanFullScreenActivity.class);
        intent.putExtra("latitude", latitude);
        intent.putExtra("longitude", longitude);
        if (intent.resolveActivity(context.getPackageManager()) != null) {
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }

}
