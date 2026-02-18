import UIKit

@objc public enum CornerInsetDirection: Int {
  case vertical
  case horizontal
}

@objc public enum CornerInsetEdge: Int {
  case top
  case right
  case bottom
  case left
}

@objcMembers public class ReactNavigationCornerInsetViewImplProps: NSObject {
  public var direction: CornerInsetDirection = .vertical
  public var edge: CornerInsetEdge = .top
}

@objc public protocol ReactNavigationCornerInsetViewImplDelegate: NSObjectProtocol {
  func cornerInsetDidChange(_ cornerInset: CGFloat, animated: Bool)
}

@objc public class ReactNavigationCornerInsetViewImpl: UIView {
  @objc public weak var delegate: ReactNavigationCornerInsetViewImplDelegate?

  private var props: ReactNavigationCornerInsetViewImplProps = ReactNavigationCornerInsetViewImplProps()
  private var hasMeasuredCornerInset = false
  private var lastMeasuredCornerInset: CGFloat = 0
  private weak var measurementView: UIView?
  private weak var lastMeasuredWindow: UIWindow?

  @objc public func updateProps(_ props: ReactNavigationCornerInsetViewImplProps, oldProps: ReactNavigationCornerInsetViewImplProps) {
    self.props = props

    if props.direction != oldProps.direction || props.edge != oldProps.edge {
      setNeedsLayout()
      updateCornerInset(forceMeasurement: true)
    }
  }

  @objc public func relayout() {
    updateCornerInset(animated: true, forceMeasurement: true)
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()

    if window == nil {
      measurementView?.removeFromSuperview()
      measurementView = nil
    }

    updateCornerInset()
  }

  private func updateCornerInset(animated: Bool = false, forceMeasurement: Bool = false) {
    if shouldMeasureCornerInset(forceMeasurement: forceMeasurement) {
      lastMeasuredCornerInset = measureCornerInset()
      hasMeasuredCornerInset = true
      lastMeasuredWindow = window
    }

    delegate?.cornerInsetDidChange(hasMeasuredCornerInset ? lastMeasuredCornerInset : 0, animated: animated)
  }

  private func shouldMeasureCornerInset(forceMeasurement: Bool) -> Bool {
    let currentWindow = window

    if forceMeasurement {
      return currentWindow != nil || !hasMeasuredCornerInset
    }

    if !hasMeasuredCornerInset {
      return true
    }

    guard let currentWindow else {
      return false
    }

    return lastMeasuredWindow !== currentWindow
  }

  private func measureCornerInset() -> CGFloat {
    if #available(iOS 26.0, *) {
      let cornerMargins = resolveCornerMargins()

      switch props.edge {
      case .top:
        return cornerMargins.top
      case .right:
        return cornerMargins.right
      case .bottom:
        return cornerMargins.bottom
      case .left:
        return cornerMargins.left
      }
    }

    return 0
  }

  @available(iOS 26.0, *)
  private func resolveCornerMargins() -> UIEdgeInsets {
    let region = UIView.LayoutRegion.margins(
      cornerAdaptation: props.direction == .horizontal ? .horizontal : .vertical
    )

    guard let window else {
      return edgeInsets(for: region)
    }

    let measurementView = resolveMeasurementView(in: window)

    measurementView.frame = resolveFrameInWindow()

    window.setNeedsUpdateProperties()
    measurementView.setNeedsUpdateProperties()
    window.updatePropertiesIfNeeded()
    measurementView.updatePropertiesIfNeeded()

    return measurementView.edgeInsets(for: region)
  }

  @available(iOS 26.0, *)
  private func resolveMeasurementView(in window: UIWindow) -> UIView {
    if let measurementView, measurementView.window === window {
      return measurementView
    }

    measurementView?.removeFromSuperview()

    // Use a hidden view in the window so relayout can read the current corner
    // insets even while transforms are animating.
    let view = UIView(frame: .zero)

    view.backgroundColor = .clear
    view.isUserInteractionEnabled = false
    view.isAccessibilityElement = false
    view.alpha = 0

    window.addSubview(view)
    measurementView = view

    return view
  }

  private func resolveFrameInWindow() -> CGRect {
    guard let window else {
      return .zero
    }

    guard
      let superLayer = layer.superlayer,
      let presentationLayer = layer.presentation()
    else {
      return superview?.convert(frame, to: window) ?? convert(bounds, to: window)
    }

    let sourceLayer = superLayer.presentation() ?? superLayer
    let destinationLayer = window.layer.presentation() ?? window.layer
    let center = destinationLayer.convert(presentationLayer.position, from: sourceLayer)
    let bounds = presentationLayer.bounds

    return CGRect(
      x: center.x - bounds.size.width / 2,
      y: center.y - bounds.size.height / 2,
      width: bounds.size.width,
      height: bounds.size.height
    )
  }
}
