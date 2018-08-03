package com.swmansion.rnscreens.example;

import android.util.Log;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.swmansion.rnscreens.LifecycleHelper;

@ReactModule(name = SampleLifecycleAwareViewManager.REACT_CLASS)
public class SampleLifecycleAwareViewManager extends ViewGroupManager<LifecycleAwareView> {

  protected static final String REACT_CLASS = "RNSLifecycleAwareView";

  private LifecycleHelper mLifecycleHelper = new LifecycleHelper();

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected LifecycleAwareView createViewInstance(ThemedReactContext reactContext) {
    Log.e("CAT", "CREATE!!!");
    LifecycleAwareView view = new LifecycleAwareView(reactContext);
    mLifecycleHelper.register(view);
    return view;
  }

  @Override
  public void onDropViewInstance(LifecycleAwareView view) {
    mLifecycleHelper.unregister(view);
    super.onDropViewInstance(view);
  }
}
