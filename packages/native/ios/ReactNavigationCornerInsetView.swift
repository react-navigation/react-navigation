import UIKit

@objc public enum CornerInsetsDirection: Int {
  case vertical
  case horizontal
}

@objc public class ReactNavigationCornerInsetViewImplProps: NSObject {
  @objc public var direction: CornerInsetsDirection = .vertical
}

@objc public protocol ReactNavigationCornerInsetViewImplDelegate: AnyObject {
  func cornerInsetDidChange(_ cornerInset: CGFloat)
}

@objc public class ReactNavigationCornerInsetViewImpl: UIView {
  @objc public weak var delegate: ReactNavigationCornerInsetViewImplDelegate?

  private var props: ReactNavigationCornerInsetViewImplProps = ReactNavigationCornerInsetViewImplProps()
  private var currentCornerInset: CGFloat = 0
  private var windowObservation: NSObjectProtocol?

  @objc public func updateProps(_ props: ReactNavigationCornerInsetViewImplProps, oldProps: ReactNavigationCornerInsetViewImplProps) {
    self.props = props

    if props.direction != oldProps.direction {
      currentCornerInset = 0
      setNeedsLayout()
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()

    windowObservation = nil

    if let windowScene = window?.windowScene {
      windowObservation = NotificationCenter.default.addObserver(
        forName: UIScene.willEnterForegroundNotification,
        object: windowScene,
        queue: .main
      ) { [weak self] _ in
        self?.updateCornerInsets()
      }
    }

    updateCornerInsets()
  }

  public override func safeAreaInsetsDidChange() {
    super.safeAreaInsetsDidChange()
    updateCornerInsets()
  }

  public override func layoutMarginsDidChange() {
    super.layoutMarginsDidChange()
    updateCornerInsets()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    updateCornerInsets()
  }

  private func updateCornerInsets() {
    let cornerInset = calculateCornerInset()

    if cornerInset != currentCornerInset {
      currentCornerInset = cornerInset
      delegate?.cornerInsetDidChange(cornerInset)
    }
  }

  private func calculateCornerInset() -> CGFloat {
    if #available(iOS 26.0, *) {
      switch props.direction {
      case .vertical:
        let cornerMargins = self.edgeInsets(for: .margins(cornerAdaptation: .vertical))

        return cornerMargins.top
      case .horizontal:
        let cornerMargins = self.edgeInsets(for: .margins(cornerAdaptation: .horizontal))

        return cornerMargins.left
      }
    }

    return 0
  }

  deinit {
    if let observation = windowObservation {
      NotificationCenter.default.removeObserver(observation)
    }
  }
}
