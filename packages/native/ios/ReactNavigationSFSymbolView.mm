#import "ReactNavigationSFSymbolView.h"

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTConversions.h>
#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation ReactNavigationSFSymbolView {
    ReactNavigationSFSymbolViewImpl * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationSFSymbolViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationSFSymbolViewProps>();
    _props = defaultProps;

    _view = [[ReactNavigationSFSymbolViewImpl alloc] init];

    self.contentView = _view;
  }

  return self;
}

static ReactNavigationSFSymbolViewImplProps *convertProps(const Props::Shared &props) {
    const auto &viewProps = *std::static_pointer_cast<ReactNavigationSFSymbolViewProps const>(props);

    ReactNavigationSFSymbolViewImplProps *swiftProps = [[ReactNavigationSFSymbolViewImplProps alloc] init];

    swiftProps.name = RCTNSStringFromString(viewProps.name);
    swiftProps.size = viewProps.size;
    swiftProps.color = RCTUIColorFromSharedColor(viewProps.color);
    swiftProps.weight = viewProps.weight;
    swiftProps.scale = RCTNSStringFromString(viewProps.scale);
    swiftProps.variableValue = viewProps.variableValue;
    swiftProps.variableValueMode = RCTNSStringFromString(viewProps.variableValueMode);
    swiftProps.colorRenderingMode = RCTNSStringFromString(viewProps.colorRenderingMode);
    swiftProps.renderingMode = RCTNSStringFromString(viewProps.renderingMode);
    swiftProps.effect = RCTNSStringFromString(viewProps.effect);
    swiftProps.effectRepeat = RCTNSStringFromString(viewProps.effectRepeat);
    swiftProps.effectRepeatCount = viewProps.effectRepeatCount;
    swiftProps.effectRepeatDelay = viewProps.effectRepeatDelay;
    swiftProps.effectSpeed = viewProps.effectSpeed;
    swiftProps.effectScope = RCTNSStringFromString(viewProps.effectScope);
    swiftProps.effectDirection = RCTNSStringFromString(viewProps.effectDirection);
    swiftProps.effectVariant = RCTNSStringFromString(viewProps.effectVariant);
    swiftProps.effectAngle = viewProps.effectAngle;
    swiftProps.effectReversing = viewProps.effectReversing;
    swiftProps.effectCumulative = viewProps.effectCumulative;
    swiftProps.effectInactiveLayers = RCTNSStringFromString(viewProps.effectInactiveLayers);
    swiftProps.effectDrawDirection = RCTNSStringFromString(viewProps.effectDrawDirection);
    swiftProps.contentTransition = RCTNSStringFromString(viewProps.contentTransition);
    swiftProps.contentTransitionSpeed = viewProps.contentTransitionSpeed;
    swiftProps.contentTransitionVariant = RCTNSStringFromString(viewProps.contentTransitionVariant);
    swiftProps.contentTransitionScope = RCTNSStringFromString(viewProps.contentTransitionScope);
    swiftProps.contentTransitionMagic = viewProps.contentTransitionMagic;

    if (viewProps.colorPrimary) {
        swiftProps.colorPrimary = RCTUIColorFromSharedColor(viewProps.colorPrimary);
    }
    if (viewProps.colorSecondary) {
        swiftProps.colorSecondary = RCTUIColorFromSharedColor(viewProps.colorSecondary);
    }
    if (viewProps.colorTertiary) {
        swiftProps.colorTertiary = RCTUIColorFromSharedColor(viewProps.colorTertiary);
    }

    return swiftProps;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [_view updateProps:convertProps(props) oldProps:convertProps(_props)];
    [super updateProps:props oldProps:oldProps];
}

@end
