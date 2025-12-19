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
  func cornerInsetDidChange(_ cornerInset: CGFloat)
}

@objc public class ReactNavigationCornerInsetViewImpl: UIView {
  @objc public weak var delegate: ReactNavigationCornerInsetViewImplDelegate?

  private var props: ReactNavigationCornerInsetViewImplProps = ReactNavigationCornerInsetViewImplProps()
  private var windowObservation: NSObjectProtocol?

  @objc public func updateProps(_ props: ReactNavigationCornerInsetViewImplProps, oldProps: ReactNavigationCornerInsetViewImplProps) {
    self.props = props

    if props.direction != oldProps.direction || props.edge != oldProps.edge {
      setNeedsLayout()
    }
  }

  public override func safeAreaInsetsDidChange() {
    super.safeAreaInsetsDidChange()
    updateCornerInset()
  }

  public override func layoutMarginsDidChange() {
    super.layoutMarginsDidChange()
    updateCornerInset()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    updateCornerInset()
  }

  private func updateCornerInset() {
    let cornerInset = calculateCornerInset()

    delegate?.cornerInsetDidChange(cornerInset)
  }

  private func calculateCornerInset() -> CGFloat {
    if #available(iOS 26.0, *) {
      let cornerMargins = self.edgeInsets(for: .margins(
        cornerAdaptation: props.direction == .horizontal ? .horizontal : .vertical
      ))

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
}
