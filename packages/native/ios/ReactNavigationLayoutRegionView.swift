import UIKit

@objc public protocol ReactNavigationLayoutRegionViewImplDelegate {
  @available(iOS 26.0, *)
  func barLayoutRegion(onEdge edge: NSDirectionalRectEdge, extent: CGFloat) -> __UIViewLayoutRegion?

  func updateInsets(top: CGFloat, bottom: CGFloat, start: CGFloat, end: CGFloat, isRTL: Bool)
}

private struct LayoutRegionProps: Equatable {
  var region = "safeArea"
  var cornerAdaptation = "none"
  var onEdge = "top"
  var extent: CGFloat = 0
}

private struct LayoutMeasurementState: Equatable {
  var props: LayoutRegionProps
  var frame: CGRect
  var isFlippedX: Bool
  var isFlippedY: Bool
  var windowBounds: CGRect
  var isRTL: Bool
}

private class LayoutMeasurementView: UIView {
  var onChange: ((UIView) -> Void)?

  @available(iOS 26.0, *)
  override func updateProperties() {
    super.updateProperties()

    onChange?(self)
  }

  override func safeAreaInsetsDidChange() {
    super.safeAreaInsetsDidChange()

    if #unavailable(iOS 26.0) {
      onChange?(self)
    }
  }

  override func layoutMarginsDidChange() {
    super.layoutMarginsDidChange()

    if #unavailable(iOS 26.0) {
      onChange?(self)
    }
  }
}

@objc public class ReactNavigationLayoutRegionViewImpl: NSObject {
  private weak var view: (UIView & ReactNavigationLayoutRegionViewImplDelegate)?

  private var props = LayoutRegionProps()
  private weak var measurementView: LayoutMeasurementView?
  private var lastMeasurementState: LayoutMeasurementState?

  @objc public init(view: UIView & ReactNavigationLayoutRegionViewImplDelegate) {
    self.view = view
  }

  @objc public static func inheritedSafeAreaInsets(of view: UIView, in host: UIView) -> UIEdgeInsets {
    let (frame, isFlippedX, isFlippedY) = resolveFrame(of: view, in: host)
    let safeArea = host.safeAreaInsets

    let top = max(0, safeArea.top - max(0, frame.minY))
    let left = max(0, safeArea.left - max(0, frame.minX))
    let bottom = max(0, safeArea.bottom - max(0, host.bounds.height - frame.maxY))
    let right = max(0, safeArea.right - max(0, host.bounds.width - frame.maxX))

    // The edges of a view flipped an odd number of times are on the opposite sides of the screen
    // So we swap the insets for the flipped axis to return them for the sides of the view
    return UIEdgeInsets(
      top: isFlippedY ? bottom : top,
      left: isFlippedX ? right : left,
      bottom: isFlippedY ? top : bottom,
      right: isFlippedX ? left : right
    )
  }

  @objc public func setProps(
    region: String,
    cornerAdaptation: String,
    onEdge: String,
    extent: CGFloat
  ) {
    props = LayoutRegionProps(
      region: region,
      cornerAdaptation: cornerAdaptation,
      onEdge: onEdge,
      extent: extent
    )
  }

  @objc public func didMoveToWindow() {
    measurementView?.removeFromSuperview()
    measurementView = nil
    lastMeasurementState = nil

    updateMeasurement()
  }

  // We don't get notified when an ancestor moves the view in the window
  // So we check the position after each mounting transaction, once the whole transaction is mounted
  @objc public func updateMeasurement() {
    guard let view, let window = view.window else {
      return
    }

    // The layout of the ancestors can still be pending
    // e.g. a scroll view without the safe area applied yet
    // So we lay out the window first, otherwise we get the insets for the old position in the first frame
    window.layoutIfNeeded()

    let host = sequence(first: view, next: \.superview).first { $0.next is UIViewController } ?? window

    let (frame, isFlippedX, isFlippedY) = Self.resolveFrame(of: view, in: host)

    let state = LayoutMeasurementState(
      props: props,
      frame: frame,
      isFlippedX: isFlippedX,
      isFlippedY: isFlippedY,
      windowBounds: window.bounds,
      isRTL: view.effectiveUserInterfaceLayoutDirection == .rightToLeft
    )

    if state == lastMeasurementState, measurementView?.superview === host {
      return
    }

    lastMeasurementState = state

    let measurementView = resolveMeasurementView(in: host)

    measurementView.frame = state.frame

    // The hidden view is outside the component view,
    // so it doesn't get the same layout direction as the component
    // We need to set the layout direction ourselves so it matches
    measurementView.semanticContentAttribute = state.isRTL ? .forceRightToLeft : .forceLeftToRight

    if #available(iOS 26.0, *) {
      measurementView.setNeedsUpdateProperties()
      measurementView.updatePropertiesIfNeeded()
    } else {
      measurementView.onChange?(measurementView)
    }
  }

  private func measureInsets(in measurementView: UIView) -> NSDirectionalEdgeInsets {
    guard #available(iOS 26.0, *) else {
      switch props.region {
      case "safeArea":
        let insets = measurementView.safeAreaInsets
        let isRTL = measurementView.effectiveUserInterfaceLayoutDirection == .rightToLeft

        return NSDirectionalEdgeInsets(
          top: insets.top,
          leading: isRTL ? insets.right : insets.left,
          bottom: insets.bottom,
          trailing: isRTL ? insets.left : insets.right
        )
      case "margins":
        return measurementView.directionalLayoutMargins
      default:
        return .zero
      }
    }

    if props.region == "bar" {
      let edge: NSDirectionalRectEdge = switch props.onEdge {
      case "bottom": .bottom
      case "start": .leading
      case "end": .trailing
      default: .top
      }

      guard let region = view?.barLayoutRegion(onEdge: edge, extent: props.extent) else {
        return .zero
      }

      return measurementView.__directionalEdgeInsets(for: region)
    }

    let cornerAdaptation: UIView.LayoutRegion.AdaptivityAxis? = switch props.cornerAdaptation {
    case "horizontal": .horizontal
    case "vertical": .vertical
    default: nil
    }

    return measureInsets(in: measurementView, cornerAdaptation: cornerAdaptation)
  }

  @available(iOS 26.0, *)
  private func measureInsets(
    in measurementView: UIView,
    cornerAdaptation: UIView.LayoutRegion.AdaptivityAxis?
  ) -> NSDirectionalEdgeInsets {
    let region: UIView.LayoutRegion = switch props.region {
    case "margins": .margins(cornerAdaptation: cornerAdaptation)
    case "readableContent": .readableContent(cornerAdaptation: cornerAdaptation)
    default: .safeArea(cornerAdaptation: cornerAdaptation)
    }

    return measurementView.directionalEdgeInsets(for: region)
  }

  private static func resolveFrame(of view: UIView, in host: UIView) -> (frame: CGRect, isFlippedX: Bool, isFlippedY: Bool) {
    var origin = CGPoint.zero
    var isFlippedX = false
    var isFlippedY = false
    var current = view

    while current !== host, let parent = current.superview {
      // We ignore transforms since they're often used for animations (e.g. a modal sliding in)
      // But horizontal scroll views in RTL and inverted lists are flipped with transforms in React Native
      // So we mirror the position within the flipped view to get where the content is on the screen
      if current.transform.a < 0 {
        origin.x = current.bounds.width - origin.x - view.bounds.width
        isFlippedX.toggle()
      }

      if current.transform.d < 0 {
        origin.y = current.bounds.height - origin.y - view.bounds.height
        isFlippedY.toggle()
      }

      var offset = parent.bounds.origin

      // We use the offset of the scroll view before any scrolling to avoid changing insets during scroll
      if let scrollView = parent as? UIScrollView {
        offset = CGPoint(x: -scrollView.adjustedContentInset.left, y: -scrollView.adjustedContentInset.top)
      }

      origin.x += current.center.x - current.bounds.width / 2 - offset.x
      origin.y += current.center.y - current.bounds.height / 2 - offset.y

      current = parent
    }

    return (CGRect(origin: origin, size: view.bounds.size), isFlippedX, isFlippedY)
  }

  private func resolveMeasurementView(in host: UIView) -> LayoutMeasurementView {
    if let measurementView, measurementView.superview === host {
      return measurementView
    }

    measurementView?.removeFromSuperview()

    // We measure with a hidden view outside the component view,
    // placed where it'd be without transforms
    // This ensures that insets don't change during transform animation in an ancestors
    let measurementView = LayoutMeasurementView(frame: .zero)

    // The hidden view is in front of the content,
    // so we need to turn off touches to avoid blocking interactions with the content
    measurementView.isUserInteractionEnabled = false

    // FIXME: Adding the view can report insets for its initial zero frame.
    // Register the callback afterwards so only the resolved frame is measured.
    host.addSubview(measurementView)

    measurementView.onChange = { [weak self] measurementView in
      guard let self else {
        return
      }

      // When the window resizes, this can be called before the React Native layout for the new size
      // Then the hidden view still has the frame for the old size,
      // so we need to wait for the next mounting transaction for correct measurement
      guard let state = lastMeasurementState, measurementView.window?.bounds == state.windowBounds else {
        return
      }

      let insets = measureInsets(in: measurementView)

      // The edges of a view flipped an odd number of times are on the opposite sides of the screen
      // So we swap the insets for the flipped axis to apply them on the sides where they're needed
      view?.updateInsets(
        top: state.isFlippedY ? insets.bottom : insets.top,
        bottom: state.isFlippedY ? insets.top : insets.bottom,
        start: state.isFlippedX ? insets.trailing : insets.leading,
        end: state.isFlippedX ? insets.leading : insets.trailing,
        isRTL: measurementView.effectiveUserInterfaceLayoutDirection == .rightToLeft
      )
    }

    self.measurementView = measurementView

    return measurementView
  }
}
