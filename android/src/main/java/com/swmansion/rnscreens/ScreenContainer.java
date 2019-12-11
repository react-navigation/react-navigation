package com.swmansion.rnscreens;

import android.content.Context;
import android.content.ContextWrapper;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.ChoreographerCompat;
import com.facebook.react.modules.core.ReactChoreographer;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ScreenContainer<T extends ScreenFragment> extends ViewGroup {

  protected final ArrayList<T> mScreenFragments = new ArrayList<>();
  private final Set<ScreenFragment> mActiveScreenFragments = new HashSet<>();
  private final ArrayList<Runnable> mAfterTransitionRunnables = new ArrayList<>(1);

  private @Nullable FragmentManager mFragmentManager;
  private @Nullable FragmentTransaction mCurrentTransaction;
  private @Nullable FragmentTransaction mProcessingTransaction;
  private boolean mNeedUpdate;
  private boolean mIsAttached;
  private boolean mIsTransitioning;
  private boolean mLayoutEnqueued = false;

  private final ChoreographerCompat.FrameCallback mFrameCallback = new ChoreographerCompat.FrameCallback() {
    @Override
    public void doFrame(long frameTimeNanos) {
      updateIfNeeded();
    }
  };

  private final Runnable mLayoutRunnable = new Runnable() {
    @Override
    public void run() {
      mLayoutEnqueued = false;
      measure(
              MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
              MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
      layout(getLeft(), getTop(), getRight(), getBottom());
    }
  };

  public ScreenContainer(Context context) {
    super(context);
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    for (int i = 0, size = getChildCount(); i < size; i++) {
      getChildAt(i).layout(0, 0, getWidth(), getHeight());
    }
  }

  @Override
  public void requestLayout() {
    super.requestLayout();

    if (!mLayoutEnqueued) {
      mLayoutEnqueued = true;
      post(mLayoutRunnable);
    }
  }

  protected void markUpdated() {
    if (!mNeedUpdate) {
      mNeedUpdate = true;
      // enqueue callback of NATIVE_ANIMATED_MODULE type as all view operations are executed in
      // DISPATCH_UI type and we want the callback to be called right after in the same frame.
      ReactChoreographer.getInstance().postFrameCallback(
              ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE,
              mFrameCallback);
    }
  }

  protected void notifyChildUpdate() {
    markUpdated();
  }

  protected T adapt(Screen screen) {
    return (T) new ScreenFragment(screen);
  }

  protected void addScreen(Screen screen, int index) {
    T fragment = adapt(screen);
    screen.setFragment(fragment);
    mScreenFragments.add(index, fragment);
    screen.setContainer(this);
    markUpdated();
  }

  protected void removeScreenAt(int index) {
    mScreenFragments.get(index).getScreen().setContainer(null);
    mScreenFragments.remove(index);
    markUpdated();
  }

  @Override
  public void startViewTransition(View view) {
    super.startViewTransition(view);
    mIsTransitioning = true;
  }

  @Override
  public void endViewTransition(View view) {
    super.endViewTransition(view);
    if (mIsTransitioning) {
      mIsTransitioning = false;
      notifyTransitionFinished();
    }
  }

  public boolean isTransitioning() {
    return mIsTransitioning || mProcessingTransaction != null;
  }

  public void postAfterTransition(Runnable runnable) {
    mAfterTransitionRunnables.add(runnable);
  }

  protected void notifyTransitionFinished() {
    for (int i = 0, size = mAfterTransitionRunnables.size(); i < size; i++) {
      mAfterTransitionRunnables.get(i).run();
    }
    mAfterTransitionRunnables.clear();
  }

  protected int getScreenCount() {
    return mScreenFragments.size();
  }

  protected Screen getScreenAt(int index) {
    return mScreenFragments.get(index).getScreen();
  }

  private FragmentManager findFragmentManager() {
    ViewParent parent = this;
    // We traverse view hierarchy up until we find screen parent or a root view
    while (!(parent instanceof ReactRootView || parent instanceof Screen) && parent.getParent() != null) {
      parent = parent.getParent();
    }
    // If parent is of type Screen it means we are inside a nested fragment structure.
    // Otherwise we expect to connect directly with root view and get root fragment manager
    if (parent instanceof Screen) {
      return ((Screen) parent).getFragment().getChildFragmentManager();
    }

    // we expect top level view to be of type ReactRootView, this isn't really necessary but in order
    // to find root view we test if parent is null. This could potentially happen also when the view
    // is detached from the hierarchy and that test would not correctly indicate the root view. So
    // in order to make sure we indeed reached the root we test if it is of a correct type. This
    // allows us to provide a more descriptive error message for the aforementioned case.
    if (!(parent instanceof ReactRootView)) {
      throw new IllegalStateException("ScreenContainer is not attached under ReactRootView");
    }
    // ReactRootView is expected to be initialized with the main React Activity as a context but
    // in case of Expo the activity is wrapped in ContextWrapper and we need to unwrap it
    Context context = ((ReactRootView) parent).getContext();
    while (!(context instanceof FragmentActivity) && context instanceof ContextWrapper) {
      context = ((ContextWrapper) context).getBaseContext();
    }
    if (!(context instanceof FragmentActivity)) {
      throw new IllegalStateException(
              "In order to use RNScreens components your app's activity need to extend ReactFragmentActivity or ReactCompatActivity");
    }
    return ((FragmentActivity) context).getSupportFragmentManager();
  }

  protected final FragmentManager getFragmentManager() {
    if (mFragmentManager == null) {
      mFragmentManager = findFragmentManager();
    }
    return mFragmentManager;
  }

  protected FragmentTransaction getOrCreateTransaction() {
    if (mCurrentTransaction == null) {
      mCurrentTransaction = getFragmentManager().beginTransaction();
      mCurrentTransaction.setReorderingAllowed(true);
    }
    return mCurrentTransaction;
  }

  protected void tryCommitTransaction() {
    if (mCurrentTransaction != null) {
      final FragmentTransaction transaction = mCurrentTransaction;
      mProcessingTransaction = transaction;
      mProcessingTransaction.runOnCommit(new Runnable() {
        @Override
        public void run() {
         if (mProcessingTransaction == transaction) {
           // we need to take into account that commit is initiated with some other transaction while
           // the previous one is still processing. In this case mProcessingTransaction gets overwritten
           // and we don't want to set it to null until the second transaction is finished.
           mProcessingTransaction = null;
         }
        }
      });
      mCurrentTransaction.commitAllowingStateLoss();
      mCurrentTransaction = null;
    }
  }

  private void attachScreen(ScreenFragment screenFragment) {
    getOrCreateTransaction().add(getId(), screenFragment);
    mActiveScreenFragments.add(screenFragment);
  }

  private void moveToFront(ScreenFragment screenFragment) {
    FragmentTransaction transaction = getOrCreateTransaction();
    transaction.remove(screenFragment);
    transaction.add(getId(), screenFragment);
  }

  private void detachScreen(ScreenFragment screenFragment) {
    getOrCreateTransaction().remove(screenFragment);
    mActiveScreenFragments.remove(screenFragment);
  }

  protected boolean isScreenActive(ScreenFragment screenFragment) {
    return screenFragment.getScreen().isActive();
  }

  protected boolean hasScreen(ScreenFragment screenFragment) {
    return mScreenFragments.contains(screenFragment);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    mIsAttached = true;
    updateIfNeeded();
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    mIsAttached = false;
  }

  @Override
  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    for (int i = 0, size = getChildCount(); i < size; i++) {
      getChildAt(i).measure(widthMeasureSpec, heightMeasureSpec);
    }
  }

  private void updateIfNeeded() {
    if (!mNeedUpdate || !mIsAttached) {
      return;
    }
    mNeedUpdate = false;
    onUpdate();
  }

  protected void onUpdate() {
    // detach screens that are no longer active
    Set<ScreenFragment> orphaned = new HashSet<>(mActiveScreenFragments);
    for (int i = 0, size = mScreenFragments.size(); i < size; i++) {
      ScreenFragment screenFragment = mScreenFragments.get(i);
      boolean isActive = isScreenActive(screenFragment);
      if (!isActive && mActiveScreenFragments.contains(screenFragment)) {
        detachScreen(screenFragment);
      }
      orphaned.remove(screenFragment);
    }
    if (!orphaned.isEmpty()) {
      Object[] orphanedAry = orphaned.toArray();
      for (int i = 0; i < orphanedAry.length; i++) {
        detachScreen((ScreenFragment) orphanedAry[i]);
      }
    }

    // detect if we are "transitioning" based on the number of active screens
    int activeScreens = 0;
    for (int i = 0, size = mScreenFragments.size(); i < size; i++) {
      if (isScreenActive(mScreenFragments.get(i))) {
        activeScreens += 1;
      }
    }
    boolean transitioning = activeScreens > 1;

    // attach newly activated screens
    boolean addedBefore = false;
    for (int i = 0, size = mScreenFragments.size(); i < size; i++) {
      ScreenFragment screenFragment = mScreenFragments.get(i);
      boolean isActive = isScreenActive(screenFragment);
      if (isActive && !mActiveScreenFragments.contains(screenFragment)) {
        addedBefore = true;
        attachScreen(screenFragment);
      } else if (isActive && addedBefore) {
        moveToFront(screenFragment);
      }
      screenFragment.getScreen().setTransitioning(transitioning);
    }
    tryCommitTransaction();
  }
}
