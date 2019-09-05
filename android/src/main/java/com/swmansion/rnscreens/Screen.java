package com.swmansion.rnscreens;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.annotation.SuppressLint;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.PointerEvents;
import com.facebook.react.uimanager.ReactPointerEventsView;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;

public class Screen extends ViewGroup implements ReactPointerEventsView {

  public enum StackPresentation {
    PUSH,
    MODAL,
    TRANSPARENT_MODAL
  }

  public enum StackAnimation {
    DEFAULT,
    NONE,
    FADE
  }

  public static class ScreenFragment extends Fragment {

    private Screen mScreenView;

    public ScreenFragment() {
      throw new IllegalStateException("Screen fragments should never be restored");
    }

    @SuppressLint("ValidFragment")
    public ScreenFragment(Screen screenView) {
      super();
      mScreenView = screenView;
    }

    @Override
    public View onCreateView(LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
      return mScreenView;
    }

    @Override
    public void onDestroy() {
      super.onDestroy();
      mScreenView.mEventDispatcher.dispatchEvent(new ScreenDismissedEvent(mScreenView.getId()));
    }
  }

  private final Fragment mFragment;
  private final EventDispatcher mEventDispatcher;
  private @Nullable ScreenContainer mContainer;
  private boolean mActive;
  private boolean mTransitioning;
  private StackPresentation mStackPresentation = StackPresentation.PUSH;
  private StackAnimation mStackAnimation = StackAnimation.DEFAULT;

  public Screen(ReactContext context) {
    super(context);
    mFragment = new ScreenFragment(this);
    mEventDispatcher = context.getNativeModule(UIManagerModule.class).getEventDispatcher();
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int b, int r) {
    // no-op
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    clearDisappearingChildren();
  }

  /**
   * While transitioning this property allows to optimize rendering behavior on Android and provide
   * a correct blending options for the animated screen. It is turned on automatically by the container
   * when transitioning is detected and turned off immediately after
   */
  public void setTransitioning(boolean transitioning) {
    if (mTransitioning == transitioning) {
      return;
    }
    mTransitioning = transitioning;
    super.setLayerType(transitioning ? View.LAYER_TYPE_HARDWARE : View.LAYER_TYPE_NONE, null);
  }

  public void setStackPresentation(StackPresentation stackPresentation) {
    mStackPresentation = stackPresentation;
  }

  public void setStackAnimation(StackAnimation stackAnimation) {
    mStackAnimation = stackAnimation;
  }

  public StackAnimation getStackAnimation() {
    return mStackAnimation;
  }

  public StackPresentation getStackPresentation() {
    return mStackPresentation;
  }

  @Override
  public PointerEvents getPointerEvents() {
    return mTransitioning ? PointerEvents.NONE : PointerEvents.AUTO;
  }

  @Override
  public void setLayerType(int layerType, @Nullable Paint paint) {
    // ignore - layer type is controlled by `transitioning` prop
  }

  protected void setContainer(@Nullable ScreenContainer container) {
    mContainer = container;
  }

  protected @Nullable ScreenContainer getContainer() {
    return mContainer;
  }

  protected Fragment getFragment() {
    return mFragment;
  }

  public void setActive(boolean active) {
    if (active == mActive) {
      return;
    }
    mActive = active;
    if (mContainer != null) {
      mContainer.notifyChildUpdate();
    }
  }

  public boolean isActive() {
    return mActive;
  }
}
