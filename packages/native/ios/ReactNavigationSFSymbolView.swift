import UIKit

@objcMembers public class ReactNavigationSFSymbolViewImplProps: NSObject {
  public var name: String?
  public var size: CGFloat = 24
  public var color: UIColor = .black
  public var weight: Int = 0
  public var scale: String = "medium"
  public var renderingMode: String = "monochrome"
  public var colorPrimary: UIColor?
  public var colorSecondary: UIColor?
  public var colorTertiary: UIColor?
  public var effect: String = ""
  public var variableValue: CGFloat = -1
  public var variableValueMode: String = "automatic"
  public var colorRenderingMode: String = "automatic"
  public var effectRepeat: String = ""
  public var effectRepeatCount: Int = 0
  public var effectRepeatDelay: CGFloat = 0
  public var effectSpeed: CGFloat = 1
  public var effectScope: String = ""
  public var effectDirection: String = ""
  public var effectVariant: String = ""
  public var effectAngle: CGFloat = -1
  public var effectReversing: Bool = false
  public var effectCumulative: Bool = false
  public var effectInactiveLayers: String = ""
  public var effectDrawDirection: String = ""
  public var contentTransition: String = ""
  public var contentTransitionSpeed: CGFloat = 1
  public var contentTransitionVariant: String = ""
  public var contentTransitionScope: String = ""
  public var contentTransitionMagic: Bool = false
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
    let needsImageUpdate =
      props.name != oldProps.name ||
      props.size != oldProps.size ||
      props.weight != oldProps.weight ||
      props.scale != oldProps.scale ||
      props.variableValue != oldProps.variableValue ||
      props.variableValueMode != oldProps.variableValueMode ||
      props.colorRenderingMode != oldProps.colorRenderingMode ||
      props.renderingMode != oldProps.renderingMode ||
      props.colorPrimary != oldProps.colorPrimary ||
      props.colorSecondary != oldProps.colorSecondary ||
      props.colorTertiary != oldProps.colorTertiary

    if needsImageUpdate {
      if let name = props.name {
        // Content transitions animate between symbol contents, so only run them
        // when the symbol or its variable value changes and a previous image
        // exists. Configuration changes and the first appearance set the image
        // directly to match native behavior.
        let shouldAnimate =
          imageView.image != nil &&
          (props.name != oldProps.name || props.variableValue != oldProps.variableValue)

        let symbolWeight = Self.symbolWeight(from: props.weight)
        let symbolScale = Self.symbolScale(from: props.scale)

        var configuration = UIImage.SymbolConfiguration(pointSize: props.size, weight: symbolWeight, scale: symbolScale)

        if #available(iOS 26.0, *) {
          configuration = configuration.applying(
            UIImage.SymbolConfiguration(
              variableValueMode: Self.symbolVariableValueMode(from: props.variableValueMode)
            )
          )

          configuration = configuration.applying(
            UIImage.SymbolConfiguration(
              colorRenderingMode: Self.symbolColorRenderingMode(from: props.colorRenderingMode)
            )
          )
        }

        let primaryColor = props.colorPrimary ?? props.color

        switch props.renderingMode {
        case "hierarchical":
          configuration = configuration.applying(
            UIImage.SymbolConfiguration(hierarchicalColor: primaryColor)
          )

          let image = Self.symbolImage(name: name, configuration: configuration, props: props)

          imageView.tintColor = nil
          setImage(image, props: props, animated: shouldAnimate)

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

          let image = Self.symbolImage(name: name, configuration: configuration, props: props)

          imageView.tintColor = nil
          setImage(image, props: props, animated: shouldAnimate)

        case "multicolor":
          configuration = configuration.applying(
            UIImage.SymbolConfiguration.preferringMulticolor()
          )

          let image = Self.symbolImage(name: name, configuration: configuration, props: props)

          imageView.tintColor = nil
          setImage(image, props: props, animated: shouldAnimate)

        default:
          // monochrome
          let image = Self.symbolImage(name: name, configuration: configuration, props: props)

          imageView.tintColor = primaryColor
          setImage(image?.withRenderingMode(.alwaysTemplate), props: props, animated: shouldAnimate)
        }
      }
    }

    if !needsImageUpdate && props.color != oldProps.color && props.renderingMode == "monochrome" {
      imageView.tintColor = props.colorPrimary ?? props.color
    }

    let effectChanged =
      props.effect != oldProps.effect ||
      props.effectRepeat != oldProps.effectRepeat ||
      props.effectRepeatCount != oldProps.effectRepeatCount ||
      props.effectRepeatDelay != oldProps.effectRepeatDelay ||
      props.effectSpeed != oldProps.effectSpeed ||
      props.effectScope != oldProps.effectScope ||
      props.effectDirection != oldProps.effectDirection ||
      props.effectVariant != oldProps.effectVariant ||
      props.effectAngle != oldProps.effectAngle ||
      props.effectReversing != oldProps.effectReversing ||
      props.effectCumulative != oldProps.effectCumulative ||
      props.effectInactiveLayers != oldProps.effectInactiveLayers ||
      props.effectDrawDirection != oldProps.effectDrawDirection

    if effectChanged {
      updateEffect(props)
    }
  }

  private func setImage(_ image: UIImage?, props: ReactNavigationSFSymbolViewImplProps, animated: Bool) {
    guard let image else {
      imageView.image = nil
      return
    }

    guard animated, #available(iOS 17.0, *) else {
      imageView.image = image
      return
    }

    let options = Self.contentTransitionOptions(from: props)

    switch props.contentTransition {
    case "automatic":
      imageView.setSymbolImage(
        image,
        contentTransition: .automatic,
        options: options
      )

    case "replace":
      var effect = ReplaceSymbolEffect.replace

      switch props.contentTransitionVariant {
      case "upUp":
        effect = effect.upUp
      case "offUp":
        effect = effect.offUp
      default:
        effect = effect.downUp
      }

      if props.contentTransitionScope == "wholeSymbol" {
        effect = effect.wholeSymbol
      } else if props.contentTransitionScope == "byLayer" {
        effect = effect.byLayer
      }

      if props.contentTransitionMagic, #available(iOS 18.0, *) {
        imageView.setSymbolImage(
          image,
          contentTransition: effect.magic(fallback: effect),
          options: options
        )
      } else {
        imageView.setSymbolImage(
          image,
          contentTransition: effect,
          options: options
        )
      }

    default:
      imageView.image = image
    }
  }

  @available(iOS 17.0, *)
  private static func contentTransitionOptions(from props: ReactNavigationSFSymbolViewImplProps) -> SymbolEffectOptions {
    var options: SymbolEffectOptions = .default

    if props.contentTransitionSpeed != 1 {
      options = options.speed(props.contentTransitionSpeed)
    }

    return options
  }

  private func updateEffect(_ props: ReactNavigationSFSymbolViewImplProps) {
    guard #available(iOS 17.0, *) else { return }

    imageView.removeAllSymbolEffects()

    guard !props.effect.isEmpty else { return }

    let options = Self.symbolEffectOptions(from: props)

    switch props.effect {
    case "bounce":
      var effect = BounceSymbolEffect.bounce

      if props.effectScope == "wholeSymbol" {
        effect = effect.wholeSymbol
      } else if props.effectScope == "byLayer" {
        effect = effect.byLayer
      }

      if props.effectDirection == "up" {
        effect = effect.up
      }

      if props.effectDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "pulse":
      var effect = PulseSymbolEffect.pulse

      if props.effectScope == "wholeSymbol" {
        effect = effect.wholeSymbol
      } else if props.effectScope == "byLayer" {
        effect = effect.byLayer
      }

      imageView.addSymbolEffect(effect, options: options)

    case "appear":
      var effect = AppearSymbolEffect.appear

      if props.effectScope == "wholeSymbol" {
        effect = effect.wholeSymbol
      } else if props.effectScope == "byLayer" {
        effect = effect.byLayer
      }

      if props.effectDirection == "up" {
        effect = effect.up
      }

      if props.effectDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "disappear":
      var effect = DisappearSymbolEffect.disappear

      if props.effectScope == "wholeSymbol" {
        effect = effect.wholeSymbol
      } else if props.effectScope == "byLayer" {
        effect = effect.byLayer
      }

      if props.effectDirection == "up" {
        effect = effect.up
      }

      if props.effectDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "variableColor":
      var effect = VariableColorSymbolEffect.variableColor

      if props.effectReversing {
        effect = props.effectCumulative ? effect.reversing.cumulative : effect.reversing.iterative
      } else {
        effect = props.effectCumulative ? effect.nonReversing.cumulative : effect.nonReversing.iterative
      }

      if props.effectInactiveLayers == "hide" {
        effect = effect.hideInactiveLayers
      }

      if props.effectInactiveLayers == "dim" {
        effect = effect.dimInactiveLayers
      }

      imageView.addSymbolEffect(effect, options: options)

    case "scale":
      var effect = ScaleSymbolEffect.scale

      if props.effectScope == "wholeSymbol" {
        effect = effect.wholeSymbol
      } else if props.effectScope == "byLayer" {
        effect = effect.byLayer
      }

      if props.effectDirection == "up" {
        effect = effect.up
      }

      if props.effectDirection == "down" {
        effect = effect.down
      }

      imageView.addSymbolEffect(effect, options: options)

    case "breathe":
      if #available(iOS 18.0, *) {
        var effect = BreatheSymbolEffect.breathe

        if props.effectVariant == "plain" {
          effect = effect.plain
        }

        if props.effectVariant == "pulse" {
          effect = effect.pulse
        }

        if props.effectScope == "wholeSymbol" {
          effect = effect.wholeSymbol
        } else if props.effectScope == "byLayer" {
          effect = effect.byLayer
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    case "wiggle":
      if #available(iOS 18.0, *) {
        var effect = WiggleSymbolEffect.wiggle

        if props.effectScope == "wholeSymbol" {
          effect = effect.wholeSymbol
        } else if props.effectScope == "byLayer" {
          effect = effect.byLayer
        }

        if props.effectAngle >= 0 {
          effect = effect.custom(angle: Double(props.effectAngle))
        } else if props.effectDirection == "up" {
          effect = effect.up
        } else if props.effectDirection == "down" {
          effect = effect.down
        } else if props.effectDirection == "left" {
          effect = effect.left
        } else if props.effectDirection == "right" {
          effect = effect.right
        } else if props.effectDirection == "forward" {
          effect = effect.forward
        } else if props.effectDirection == "backward" {
          effect = effect.backward
        } else if props.effectDirection == "clockwise" {
          effect = effect.clockwise
        } else if props.effectDirection == "counterClockwise" {
          effect = effect.counterClockwise
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    case "rotate":
      if #available(iOS 18.0, *) {
        var effect = RotateSymbolEffect.rotate

        if props.effectScope == "wholeSymbol" {
          effect = effect.wholeSymbol
        } else if props.effectScope == "byLayer" {
          effect = effect.byLayer
        }

        if props.effectDirection == "clockwise" {
          effect = effect.clockwise
        }

        if props.effectDirection == "counterClockwise" {
          effect = effect.counterClockwise
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    case "drawOn":
      if #available(iOS 26.0, *) {
        var effect = DrawOnSymbolEffect.drawOn

        if props.effectScope == "wholeSymbol" {
          effect = effect.wholeSymbol
        } else if props.effectScope == "individually" {
          effect = effect.individually
        } else if props.effectScope == "byLayer" {
          effect = effect.byLayer
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    case "drawOff":
      if #available(iOS 26.0, *) {
        var effect = DrawOffSymbolEffect.drawOff

        if props.effectDrawDirection == "reversed" {
          effect = effect.reversed
        }

        if props.effectDrawDirection == "nonReversed" {
          effect = effect.nonReversed
        }

        if props.effectScope == "wholeSymbol" {
          effect = effect.wholeSymbol
        } else if props.effectScope == "individually" {
          effect = effect.individually
        } else if props.effectScope == "byLayer" {
          effect = effect.byLayer
        }

        imageView.addSymbolEffect(effect, options: options)
      }

    default: break
    }
  }

  @available(iOS 17.0, *)
  private static func symbolEffectOptions(from props: ReactNavigationSFSymbolViewImplProps) -> SymbolEffectOptions {
    var options: SymbolEffectOptions = .default

    switch props.effectRepeat {
    case "continuous":
      if #available(iOS 18.0, *) {
        options = options.repeat(.continuous)
      } else {
        options = options.repeating
      }

    case "nonRepeating":
      options = options.nonRepeating

    case "periodic":
      if #available(iOS 18.0, *) {
        let count: Int? = props.effectRepeatCount > 0 ? props.effectRepeatCount : nil
        let delay: Double? = props.effectRepeatDelay > 0 ? Double(props.effectRepeatDelay) : nil

        options = options.repeat(
          .periodic(count, delay: delay)
        )
      } else if props.effectRepeatCount > 0 {
        options = options.repeat(props.effectRepeatCount)
      } else {
        options = options.repeating
      }

    default:
      break
    }

    if props.effectSpeed != 1 {
      options = options.speed(props.effectSpeed)
    }

    return options
  }

  private static func symbolImage(
    name: String,
    configuration: UIImage.SymbolConfiguration,
    props: ReactNavigationSFSymbolViewImplProps
  ) -> UIImage? {
    if props.variableValue >= 0 {
      let variableValue = min(max(props.variableValue, 0), 1)

      if #available(iOS 16.0, *) {
        return UIImage(
          systemName: name,
          variableValue: Double(variableValue),
          configuration: configuration
        )
      }
    }

    return UIImage(systemName: name, withConfiguration: configuration)
  }

  @available(iOS 26.0, *)
  private static func symbolVariableValueMode(from value: String) -> UIImage.SymbolVariableValueMode {
    switch value {
    case "color": return .color
    case "draw": return .draw
    default: return .automatic
    }
  }

  @available(iOS 26.0, *)
  private static func symbolColorRenderingMode(from value: String) -> UIImage.SymbolColorRenderingMode {
    switch value {
    case "flat": return .flat
    case "gradient": return .gradient
    default: return .automatic
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
