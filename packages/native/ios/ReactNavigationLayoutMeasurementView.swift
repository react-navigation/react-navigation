import UIKit

@objc public protocol ReactNavigationLayoutMeasurementViewDelegate: NSObjectProtocol {
  // We read the regions in Objective-C since they are only in the iOS 27.1 SDK
  // In Swift, we can't check the SDK version at compile time to leave them out
  func measure(in view: UIView, animated: Bool)
}

private struct LayoutMeasurementState: Equatable {
  var frame: CGRect
  var windowBounds: CGRect
  var isRightToLeft: Bool
}

@objc public class ReactNavigationLayoutMeasurementView: UIView {
  @objc public weak var delegate: ReactNavigationLayoutMeasurementViewDelegate?

  private weak var measurementView: UIView?
  private var lastMeasurementState: LayoutMeasurementState?
  private var geometryObservation: NSKeyValueObservation?
  private var geometryDisplayLink: CADisplayLink?
  private var geometryChangeTime: CFTimeInterval = 0

  // We don't get notified when the view moves in the window, e.g. when an ancestor moves
  // So we call this after each mounting transaction, and only measure again when the position changed
  @objc public func updateMeasurement(force: Bool, animated: Bool) {
    guard let window else {
      return
    }

    // The layout direction is set on the component view, which is the superview of this view
    let isRightToLeft = (superview ?? self).effectiveUserInterfaceLayoutDirection == .rightToLeft
    let state = LayoutMeasurementState(
      frame: resolveFrame(),
      windowBounds: window.bounds,
      isRightToLeft: isRightToLeft
    )

    if !force && state == lastMeasurementState {
      return
    }

    lastMeasurementState = state

    delegate?.measure(in: prepareMeasurementView(in: window, state: state), animated: animated)
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()

    if window == nil {
      measurementView?.removeFromSuperview()
      measurementView = nil
    }

    geometryObservation = nil
    geometryDisplayLink?.invalidate()
    geometryDisplayLink = nil

    if #available(iOS 16.0, *), let windowScene = window?.windowScene {
      // While the window resizes (e.g. when folding iPhone Duo), the regions can be for the old size for a few frames
      // There's no callback when they're updated, and the position of the view may not change after that
      // So we measure again on each frame for a short time after the geometry changes
      geometryObservation = windowScene.observe(\.effectiveGeometry) { [weak self] _, _ in
        self?.startGeometryDisplayLink()
      }
    }

    updateMeasurement(force: true, animated: false)
  }

  private func startGeometryDisplayLink() {
    geometryChangeTime = CACurrentMediaTime()

    if geometryDisplayLink == nil {
      let displayLink = CADisplayLink(target: self, selector: #selector(handleGeometryFrame))

      displayLink.add(to: .main, forMode: .common)
      geometryDisplayLink = displayLink
    }
  }

  @objc private func handleGeometryFrame() {
    if CACurrentMediaTime() - geometryChangeTime > 0.5 {
      geometryDisplayLink?.invalidate()
      geometryDisplayLink = nil
      return
    }

    updateMeasurement(force: true, animated: true)
  }

  private func resolveFrame() -> CGRect {
    // We use the layout frame instead of the current frame
    // So transforms don't change the regions, e.g. while a modal is sliding in
    var origin = CGPoint.zero
    var current: UIView = self

    while let parent = current.superview {
      var offset = parent.bounds.origin

      // We use the offset before scrolling, so scrolling doesn't change the regions
      // At rest, the offset is the negative of the adjusted content inset (e.g. for the safe area)
      if let scrollView = parent as? UIScrollView {
        offset = CGPoint(x: -scrollView.adjustedContentInset.left, y: -scrollView.adjustedContentInset.top)
      }

      origin.x += current.center.x - current.bounds.width / 2 - offset.x
      origin.y += current.center.y - current.bounds.height / 2 - offset.y
      current = parent
    }

    return CGRect(origin: origin, size: bounds.size)
  }

  private func prepareMeasurementView(in window: UIWindow, state: LayoutMeasurementState) -> UIView {
    let measurementView = resolveMeasurementView(in: window)

    measurementView.frame = state.frame

    // The hidden view isn't inside the component view, so we need to set the layout direction ourselves
    measurementView.semanticContentAttribute = state.isRightToLeft ? .forceRightToLeft : .forceLeftToRight

    if #available(iOS 26.0, *) {
      window.setNeedsUpdateProperties()
      measurementView.setNeedsUpdateProperties()
      window.updatePropertiesIfNeeded()
      measurementView.updatePropertiesIfNeeded()
    }

    return measurementView
  }

  private func resolveMeasurementView(in window: UIWindow) -> UIView {
    if let measurementView, measurementView.window === window {
      return measurementView
    }

    measurementView?.removeFromSuperview()

    // We use a hidden view in the window, so we can read the regions
    // at the resting position even while transforms are animating
    let view = UIView(frame: .zero)

    view.backgroundColor = .clear
    view.isUserInteractionEnabled = false
    view.isAccessibilityElement = false
    view.alpha = 0

    window.addSubview(view)
    measurementView = view

    return view
  }
}
