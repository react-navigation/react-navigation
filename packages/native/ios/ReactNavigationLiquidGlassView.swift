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

  // We make the glass fill the padding frame, so it doesn't cover the border
  // But frames of children are relative to the bounds of the host view, which include the border
  // So we mount children into a separate view that's offset by the border to match the bounds
  @objc public let childContainerView = UIView()

  @objc public var colorScheme: String = "system" {
    didSet {
      overrideUserInterfaceStyle = switch colorScheme {
      case "light":
        .light
      case "dark":
        .dark
      default:
        .unspecified
      }
    }
  }

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

  public override init(effect: UIVisualEffect?) {
    super.init(effect: effect)

    contentView.addSubview(childContainerView)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  @objc public func updateFrame(_ frame: CGRect, hostBounds: CGRect) {
    self.frame = frame

    childContainerView.frame = hostBounds.offsetBy(dx: -frame.minX, dy: -frame.minY)
  }

  @objc public func setCornerRadii(
    topLeft: CGSize,
    topRight: CGSize,
    bottomLeft: CGSize,
    bottomRight: CGSize,
    borderWidths: UIEdgeInsets
  ) {
    guard #available(iOS 26.0, *) else {
      return
    }

    func innerRadius(_ radius: CGSize, _ horizontalWidth: CGFloat, _ verticalWidth: CGFloat) -> UICornerRadius {
      .fixed(max(radius.width - horizontalWidth, radius.height - verticalWidth, 0))
    }

    cornerConfiguration = .corners(
      topLeftRadius: innerRadius(topLeft, borderWidths.left, borderWidths.top),
      topRightRadius: innerRadius(topRight, borderWidths.right, borderWidths.top),
      bottomLeftRadius: innerRadius(bottomLeft, borderWidths.left, borderWidths.bottom),
      bottomRightRadius: innerRadius(bottomRight, borderWidths.right, borderWidths.bottom)
    )
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
