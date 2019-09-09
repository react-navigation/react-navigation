package com.swmansion.rnscreens;

import android.content.Context;

import androidx.fragment.app.FragmentTransaction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ScreenStack extends ScreenContainer {

  private final ArrayList<Screen> mStack = new ArrayList<>();
  private final Set<Screen> mDismissed = new HashSet<>();

  private Screen mTopScreen = null;

  public ScreenStack(Context context) {
    super(context);
  }

  public void dismiss(Screen screen) {
    mDismissed.add(screen);
    onUpdate();
  }

  public Screen getTopScreen() {
    for (int i = getScreenCount() - 1; i >= 0; i--) {
      Screen screen = getScreenAt(i);
      if (!mDismissed.contains(screen)) {
        return screen;
      }
    }
    throw new IllegalStateException("Stack is empty");
  }

  public Screen getRootScreen() {
    for (int i = 0, size = getScreenCount(); i < size; i++) {
      Screen screen = getScreenAt(i);
      if (!mDismissed.contains(screen)) {
        return screen;
      }
    }
    throw new IllegalStateException("Stack has no root screen set");
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
    for (Screen screen : mStack) {
      if (!mScreens.contains(screen) || mDismissed.contains(screen)) {
        getOrCreateTransaction().remove(screen.getFragment());
      }
    }
    Screen newTop = null;
    Screen belowTop = null; // this is only set if newTop has TRANSPARENT_MODAL presentation mode

    for (int i = mScreens.size() - 1; i >= 0; i--) {
      Screen screen = mScreens.get(i);
      if (!mDismissed.contains(screen)) {
        if (newTop == null) {
          newTop = screen;
          if (newTop.getStackPresentation() != Screen.StackPresentation.TRANSPARENT_MODAL) {
            break;
          }
        } else {
          belowTop = screen;
          break;
        }
      }
    }


    for (Screen screen : mScreens) {
      // add all new views that weren't on stack before
      if (!mStack.contains(screen) && !mDismissed.contains(screen)) {
        getOrCreateTransaction().add(getId(), screen.getFragment());
      }
      // detach all screens that should not be visible
      if (screen != newTop && screen != belowTop && !mDismissed.contains(screen)) {
        getOrCreateTransaction().hide(screen.getFragment());
      }
    }
    // attach "below top" screen if set
    if (belowTop != null) {
      final Screen top = newTop;
      getOrCreateTransaction().show(belowTop.getFragment()).runOnCommit(new Runnable() {
        @Override
        public void run() {
          top.bringToFront();
        }
      });
    }
    getOrCreateTransaction().show(newTop.getFragment());

    if (!mStack.contains(newTop)) {
      // if new top screen wasn't on stack we do "open animation" so long it is not the very first screen on stack
      if (mTopScreen != null) {
        // there was some other screen attached before
        int transition = FragmentTransaction.TRANSIT_FRAGMENT_OPEN;
        switch (mTopScreen.getStackAnimation()) {
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
      switch (mTopScreen.getStackAnimation()) {
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
    mStack.addAll(mScreens);

    tryCommitTransaction();
  }
}
