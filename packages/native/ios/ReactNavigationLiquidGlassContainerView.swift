import UIKit

@objc public class ReactNavigationLiquidGlassContainerViewImpl: UIVisualEffectView {
  @objc public var spacing: CGFloat = 0 {
    didSet {
      if spacing != oldValue || effect == nil {
        setupEffect()
      }
    }
  }

  private func setupEffect() {
    guard #available(iOS 26.0, *), ReactNavigationLiquidGlassViewImpl.isSupported else {
      return
    }

    let effect = UIGlassContainerEffect()

    effect.spacing = spacing

    UIView.performWithoutAnimation {
      self.effect = effect
    }
  }
}
