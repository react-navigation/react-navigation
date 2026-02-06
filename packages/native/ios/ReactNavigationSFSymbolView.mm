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
    swiftProps.mode = RCTNSStringFromString(viewProps.mode);
    swiftProps.animation = RCTNSStringFromString(viewProps.animation);
    swiftProps.animationRepeating = viewProps.animationRepeating;
    swiftProps.animationRepeatCount = viewProps.animationRepeatCount;
    swiftProps.animationSpeed = viewProps.animationSpeed;
    swiftProps.animationWholeSymbol = viewProps.animationWholeSymbol;
    swiftProps.animationDirection = RCTNSStringFromString(viewProps.animationDirection);
    swiftProps.animationReversing = viewProps.animationReversing;
    swiftProps.animationCumulative = viewProps.animationCumulative;

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
