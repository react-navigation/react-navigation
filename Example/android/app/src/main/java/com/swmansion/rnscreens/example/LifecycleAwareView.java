package com.swmansion.rnscreens.example;

import android.arch.lifecycle.Lifecycle;
import android.arch.lifecycle.LifecycleObserver;
import android.arch.lifecycle.OnLifecycleEvent;
import android.content.Context;
import android.util.Log;

import com.facebook.react.views.view.ReactViewGroup;

public class LifecycleAwareView extends ReactViewGroup implements LifecycleObserver {
  public LifecycleAwareView(Context context) {
    super(context);
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
  public void onResume() {
    Log.e("CAT", "VIEW RESUME");
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
  public void onPause() {
    Log.e("CAT", "VIEW PAUSE");
  }
}
