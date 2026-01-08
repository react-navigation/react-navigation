#import "ReactNavigationSFSymbolView.h"

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTConversions.h>
#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/renderer/components/ReactNavigationSpec/RCTComponentViewHelpers.h>
#import <react/renderer/core/State.h>

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

    return swiftProps;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [_view updateProps:convertProps(props) oldProps:convertProps(_props)];
    [super updateProps:props oldProps:oldProps];
}

@end
