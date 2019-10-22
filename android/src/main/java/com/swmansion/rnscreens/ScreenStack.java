package com.swmansion.rnscreens;

import android.content.Context;

import androidx.fragment.app.FragmentTransaction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ScreenStack extends ScreenContainer<ScreenStackFragment> {

  private final ArrayList<ScreenStackFragment> mStack = new ArrayList<>();
  private final Set<ScreenStackFragment> mDismissed = new HashSet<>();

  private ScreenStackFragment mTopScreen = null;
  private boolean mLayoutEnqueued = false;

  public ScreenStack(Context context) {
    super(context);
  }

  public void dismiss(ScreenStackFragment screenFragment) {
    mDismissed.add(screenFragment);
    onUpdate();
  }

  public Screen getTopScreen() {
    return mTopScreen.getScreen();
  }

  public Screen getRootScreen() {
    for (int i = 0, size = getScreenCount(); i < size; i++) {
      Screen screen = getScreenAt(i);
      if (!mDismissed.contains(screen.getFragment())) {
        return screen;
      }
    }
    throw new IllegalStateException("Stack has no root screen set");
  }

  @Override
  protected ScreenStackFragment adapt(Screen screen) {
    return new ScreenStackFragment(screen);
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    for (int i = 0, size = getChildCount(); i < size; i++) {
      getChildAt(i).layout(0, 0, getWidth(), getHeight());
    }
  }

  @Override
  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    for (int i = 0, size = getChildCount(); i < size; i++) {
      getChildAt(i).measure(widthMeasureSpec, heightMeasureSpec);
    }
  }

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

  @Override
  public void requestLayout() {
    super.requestLayout();

    if (!mLayoutEnqueued) {
      mLayoutEnqueued = true;
      post(mLayoutRunnable);
    }
  }

  @Override
  protected void removeScreenAt(int index) {
    Screen toBeRemoved = getScreenAt(index);
    mDismissed.remove(toBeRemoved);
    super.removeScreenAt(index);
  }

  @Override
  protected void onUpdate() {
    // remove all screens previously on stack
    for (ScreenStackFragment screen : mStack) {
      if (!mScreenFragments.contains(screen) || mDismissed.contains(screen)) {
        getOrCreateTransaction().remove(screen);
      }
    }
    ScreenStackFragment newTop = null;
    ScreenStackFragment belowTop = null; // this is only set if newTop has TRANSPARENT_MODAL presentation mode

    for (int i = mScreenFragments.size() - 1; i >= 0; i--) {
      ScreenStackFragment screen = mScreenFragments.get(i);
      if (!mDismissed.contains(screen)) {
        if (newTop == null) {
          newTop = screen;
          if (newTop.getScreen().getStackPresentation() != Screen.StackPresentation.TRANSPARENT_MODAL) {
            break;
          }
        } else {
          belowTop = screen;
          break;
        }
      }
    }


    for (ScreenStackFragment screen : mScreenFragments) {
      // add all new views that weren't on stack before
      if (!mStack.contains(screen) && !mDismissed.contains(screen)) {
        getOrCreateTransaction().add(getId(), screen);
      }
      // detach all screens that should not be visible
      if (screen != newTop && screen != belowTop && !mDismissed.contains(screen)) {
        getOrCreateTransaction().hide(screen);
      }
    }
    // attach "below top" screen if set
    if (belowTop != null) {
      final ScreenStackFragment top = newTop;
      getOrCreateTransaction().show(belowTop).runOnCommit(new Runnable() {
        @Override
        public void run() {
          top.getScreen().bringToFront();
        }
      });
    }
    getOrCreateTransaction().show(newTop);

    if (!mStack.contains(newTop)) {
      // if new top screen wasn't on stack we do "open animation" so long it is not the very first screen on stack
      if (mTopScreen != null) {
        // there was some other screen attached before
        int transition = FragmentTransaction.TRANSIT_FRAGMENT_OPEN;
        switch (mTopScreen.getScreen().getStackAnimation()) {
          case NONE:
            transition = FragmentTransaction.TRANSIT_NONE;
            break;
          case FADE:
            transition = FragmentTransaction.TRANSIT_FRAGMENT_FADE;
            break;
        }
        getOrCreateTransaction().setTransition(transition);
      }
    } else if (mTopScreen != null && !mTopScreen.equals(newTop)) {
      // otherwise if we are performing top screen change we do "back animation"
      int transition = FragmentTransaction.TRANSIT_FRAGMENT_CLOSE;
      switch (mTopScreen.getScreen().getStackAnimation()) {
        case NONE:
          transition = FragmentTransaction.TRANSIT_NONE;
          break;
        case FADE:
          transition = FragmentTransaction.TRANSIT_FRAGMENT_FADE;
          break;
      }
      getOrCreateTransaction().setTransition(transition);
    }

    mTopScreen = newTop;

    mStack.clear();
    mStack.addAll(mScreenFragments);

    tryCommitTransaction();

    for (ScreenStackFragment screen : mStack) {
      screen.onStackUpdate();
    }
  }
}
