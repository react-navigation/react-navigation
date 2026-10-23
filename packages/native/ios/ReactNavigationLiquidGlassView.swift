import UIKit

@objc public class ReactNavigationLiquidGlassViewImpl: UIVisualEffectView {
  @objc public static let isSupported: Bool = {
    guard #available(iOS 26.0, *) else {
      return false
    }

    let infoDictionary = Bundle.main.infoDictionary ?? [:]

    // UIDesignRequiresCompatibility is ignored for apps built with the iOS 27 SDK
    if #available(iOS 27.0, *), ((infoDictionary["DTPlatformVersion"] as? NSString)?.integerValue ?? 0) >= 27 {
      return true
    }

    return !(infoDictionary["UIDesignRequiresCompatibility"] as? Bool ?? false)
  }()

  @objc public var interactive: Bool = false {
    didSet {
      // Changing `isInteractive` on an existing effect doesn't change anything
      // So we remove the effect and apply a new one with the updated value
      if interactive != oldValue, window != nil {
        setEffectWithoutAnimation(nil)
        setupEffect()
      }
    }
  }

  public override func willMove(toWindow newWindow: UIWindow?) {
    super.willMove(toWindow: newWindow)

    // With interactive glass, pointer and subtree monitoring state is registered on the window
    // If that state is left behind after the view is unmounted, stale references can crash
    // So we remove the effect while the old window is still available
    // And apply it again in `didMoveToWindow` when the view moves to a new window
    if let currentWindow = window, currentWindow !== newWindow {
      setEffectWithoutAnimation(nil)
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()

    if window != nil {
      setupEffect()
    }
  }

  private func setupEffect() {
    guard #available(iOS 26.0, *), Self.isSupported else {
      return
    }

    let glassEffect = UIGlassEffect(style: .regular)

    glassEffect.isInteractive = interactive

    setEffectWithoutAnimation(glassEffect)
  }

  private func setEffectWithoutAnimation(_ effect: UIVisualEffect?) {
    UIView.performWithoutAnimation {
      self.effect = effect
    }
  }
}
