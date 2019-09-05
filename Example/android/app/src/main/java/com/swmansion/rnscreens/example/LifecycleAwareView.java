package com.swmansion.rnscreens.example;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.OnLifecycleEvent;

import com.facebook.react.views.view.ReactViewGroup;

public class LifecycleAwareView extends ReactViewGroup implements LifecycleObserver {
  public LifecycleAwareView(Context context) {
    super(context);
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
  public void onResume() {
    Log.e("CAT", "VIEW RESUME " + this);
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
  public void onPause() {
    Log.e("CAT", "VIEW PAUSE " + this);
  }
}
