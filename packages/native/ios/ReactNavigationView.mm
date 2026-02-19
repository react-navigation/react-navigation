#import "ReactNavigationView.h"

#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation ReactNavigationView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationViewProps>();
    _props = defaultProps;
  }

  return self;
}

@end
