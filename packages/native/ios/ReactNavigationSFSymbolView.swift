import UIKit

@objcMembers public class ReactNavigationSFSymbolViewImplProps: NSObject {
  public var name: String?
  public var size: CGFloat = 24
  public var color: UIColor = .black
  public var weight: Int = 0
  public var scale: String = "medium"
  public var mode: String = "monochrome"
  public var colorPrimary: UIColor?
  public var colorSecondary: UIColor?
  public var colorTertiary: UIColor?
  public var animation: String = ""
  public var animationRepeating: Bool = false
  public var animationRepeatCount: Int = 0
  public var animationSpeed: CGFloat = 1
  public var animationWholeSymbol: Bool = false
  public var animationDirection: String = ""
  public var animationReversing: Bool = false
  public var animationCumulative: Bool = false
}

@objc public class ReactNavigationSFSymbolViewImpl: UIView {
  private var imageView: UIImageView
  private var currentAnimation: String = ""

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
    let needsImageUpdate =
      props.name != oldProps.name ||
      props.size != oldProps.size ||
      props.weight != oldProps.weight ||
      props.scale != oldProps.scale ||
      props.mode != oldProps.mode ||
      props.colorPrimary != oldProps.colorPrimary ||
      props.colorSecondary != oldProps.colorSecondary ||
      props.colorTertiary != oldProps.colorTertiary

    if needsImageUpdate {
      if let name = props.name {
        let symbolWeight = Self.symbolWeight(from: props.weight)
        let symbolScale = Self.symbolScale(from: props.scale)

        var configuration = UIImage.SymbolConfiguration(pointSize: props.size, weight: symbolWeight, scale: symbolScale)

        let primaryColor = props.colorPrimary ?? props.color

        switch props.mode {
        case "hierarchical":
          configuration = configuration.applying(
            UIImage.SymbolConfiguration(hierarchicalColor: primaryColor)
          )

          let image = UIImage(systemName: name, withConfiguration: configuration)

          imageView.image = image
          imageView.tintColor = nil

        case "palette":
          var paletteColors: [UIColor] = []

          paletteColors.append(primaryColor)

          if let secondary = props.colorSecondary {
            paletteColors.append(secondary)
          }

          if let tertiary = props.colorTertiary {
            paletteColors.append(tertiary)
          }

          configuration = configuration.applying(
            UIImage.SymbolConfiguration(paletteColors: paletteColors)
          )

          let image = UIImage(systemName: name, withConfiguration: configuration)

          imageView.image = image
          imageView.tintColor = nil

        case "multicolor":
          configuration = configuration.applying(
            UIImage.SymbolConfiguration.preferringMulticolor()
          )

          let image = UIImage(systemName: name, withConfiguration: configuration)

          imageView.image = image
          imageView.tintColor = nil

        default:
          // monochrome
          let image = UIImage(systemName: name, withConfiguration: configuration)

          imageView.image = image?.withRenderingMode(.alwaysTemplate)
          imageView.tintColor = primaryColor
        }
      }
    }

    if !needsImageUpdate && props.color != oldProps.color && props.mode == "monochrome" {
      imageView.tintColor = props.colorPrimary ?? props.color
    }

    let animationChanged =
      props.animation != oldProps.animation ||
      props.animationRepeating != oldProps.animationRepeating ||
      props.animationRepeatCount != oldProps.animationRepeatCount ||
      props.animationSpeed != oldProps.animationSpeed ||
      props.animationWholeSymbol != oldProps.animationWholeSymbol ||
      props.animationDirection != oldProps.animationDirection ||
      props.animationReversing != oldProps.animationReversing ||
      props.animationCumulative != oldProps.animationCumulative

    if animationChanged {
      updateAnimation(props)
    }
  }

  private func updateAnimation(_ props: ReactNavigationSFSymbolViewImplProps) {
    guard #available(iOS 17.0, *) else { return }

    imageView.removeAllSymbolEffects()

    guard !props.animation.isEmpty else { return }

    var options: SymbolEffectOptions = .default

    if props.animationRepeating {
      options = options.repeating
    } else if props.animationRepeatCount > 0 {
      options = options.repeat(props.animationRepeatCount)
    }

    if props.animationSpeed != 1 {
      options = options.speed(props.animationSpeed)
    }

    switch props.animation {
    case "bounce":
      var effect = BounceSymbolEffect.bounce

      if props.animationWholeSymbol {
        effect = effect.wholeSymbol
      }

      if props.animationDirection == "up" {
        effect = effect.up
      }

      if props.animationDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "pulse":
      var effect = PulseSymbolEffect.pulse

      if props.animationWholeSymbol {
        effect = effect.wholeSymbol
      }

      imageView.addSymbolEffect(effect, options: options)

    case "appear":
      var effect = AppearSymbolEffect.appear

      if props.animationWholeSymbol {
        effect = effect.wholeSymbol
      }

      if props.animationDirection == "up" {
        effect = effect.up
      }

      if props.animationDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "disappear":
      var effect = DisappearSymbolEffect.disappear

      if props.animationWholeSymbol {
        effect = effect.wholeSymbol
      }

      if props.animationDirection == "up" {
        effect = effect.up
      }

      if props.animationDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "variableColor":
      var effect = VariableColorSymbolEffect.variableColor

      if props.animationReversing {
        effect = props.animationCumulative ? effect.reversing.cumulative : effect.reversing.iterative
      } else {
        effect = props.animationCumulative ? effect.nonReversing.cumulative : effect.nonReversing.iterative
      }

      imageView.addSymbolEffect(effect, options: options)

    case "breathe":
      if #available(iOS 18.0, *) {
        var effect = BreatheSymbolEffect.breathe

        if props.animationWholeSymbol {
          effect = effect.wholeSymbol
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    case "wiggle":
      if #available(iOS 18.0, *) {
        var effect = WiggleSymbolEffect.wiggle

        if props.animationWholeSymbol {
          effect = effect.wholeSymbol
        }

        if props.animationDirection == "up" {
          effect = effect.up
        }

        if props.animationDirection == "down" {
          effect = effect.down
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    case "rotate":
      if #available(iOS 18.0, *) {
        var effect = RotateSymbolEffect.rotate

        if props.animationWholeSymbol {
          effect = effect.wholeSymbol
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    default: break
    }
  }

  private static func symbolWeight(from value: Int) -> UIImage.SymbolWeight {
    switch value {
    case 100: return .thin
    case 200: return .ultraLight
    case 300: return .light
    case 400: return .regular
    case 500: return .medium
    case 600: return .semibold
    case 700: return .bold
    case 800: return .heavy
    case 900: return .black
    default: return .regular
    }
  }

  private static func symbolScale(from value: String) -> UIImage.SymbolScale {
    switch value {
    case "small": return .small
    case "large": return .large
    default: return .medium
    }
  }
}
