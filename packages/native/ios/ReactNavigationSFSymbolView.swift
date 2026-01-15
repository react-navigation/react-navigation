import UIKit

@objcMembers public class ReactNavigationSFSymbolViewImplProps: NSObject {
  public var name: String?
  public var size: CGFloat = 24
  public var color: UIColor = .black
}

@objc public class ReactNavigationSFSymbolViewImpl: UIView {
  private var imageView: UIImageView

  override init(frame: CGRect) {
    imageView = UIImageView()
    imageView.contentMode = .center
    imageView.translatesAutoresizingMaskIntoConstraints = false

    super.init(frame: frame)

    addSubview(imageView)

    NSLayoutConstraint.activate([
      imageView.topAnchor.constraint(equalTo: topAnchor),
      imageView.bottomAnchor.constraint(equalTo: bottomAnchor),
      imageView.leadingAnchor.constraint(equalTo: leadingAnchor),
      imageView.trailingAnchor.constraint(equalTo: trailingAnchor),
    ])
  }

  required init?(coder: NSCoder) {
    // This is only called for storyboard
    // So we don't need to implement it
    fatalError("init(coder:) has not been implemented")
  }

  @objc public func updateProps(_ props: ReactNavigationSFSymbolViewImplProps, oldProps: ReactNavigationSFSymbolViewImplProps) {
    if props.name != oldProps.name || props.size != oldProps.size {
      if let name = props.name {
        let configuration = UIImage.SymbolConfiguration(pointSize: props.size, weight: .regular)
        let image = UIImage(systemName: name, withConfiguration: configuration)

        imageView.image = image?.withRenderingMode(.alwaysTemplate)
        imageView.tintColor = props.color
      }
    }

    if props.color != oldProps.color {
      imageView.tintColor = props.color
    }
  }
}
