#import "ReactNavigationZoomAnchor.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/ReactNavigationNativeStackSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationNativeStackSpec/Props.h>

#import "RCTFabricComponentsPlugins.h"
#import "ReactNavigationNativeStackZoomTransitionStore.h"

#import <cmath>

using namespace facebook::react;

static BOOL ReactNavigationAreAlignmentRectsEqual(CGRect lhs, CGRect rhs)
{
  if (CGRectIsNull(lhs) && CGRectIsNull(rhs)) {
    return YES;
  }

  return CGRectEqualToRect(lhs, rhs);
}

static CGRect ReactNavigationAlignmentRectFromProps(
    const ReactNavigationZoomAnchorProps &props)
{
  if (!props.hasAlignmentRect) {
    return CGRectNull;
  }

  double x = props.alignmentRectX;
  double y = props.alignmentRectY;
  double width = props.alignmentRectWidth;
  double height = props.alignmentRectHeight;

  BOOL isValid =
      std::isfinite(x) && std::isfinite(y) && std::isfinite(width) &&
      std::isfinite(height) && width > 0 && height > 0;

  if (!isValid) {
    return CGRectNull;
  }

  return CGRectMake(x, y, width, height);
}

@implementation ReactNavigationZoomAnchor {
  NSString *_routeKey;
  NSString *_triggerId;
  CGRect _alignmentRect;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ReactNavigationZoomAnchorComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationZoomAnchorProps>();
    _props = defaultProps;
    _alignmentRect = CGRectNull;
  }

  return self;
}

- (void)prepareForRecycle
{
  [self unregisterCurrentTrigger];
  _routeKey = nil;
  _triggerId = nil;
  _alignmentRect = CGRectNull;
  [super prepareForRecycle];
}

- (void)dealloc
{
  [self unregisterCurrentTrigger];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps = *std::static_pointer_cast<const ReactNavigationZoomAnchorProps>(props);

  NSString *routeKey = newViewProps.routeKey.empty() ? nil : RCTNSStringFromString(newViewProps.routeKey);
  NSString *triggerId = newViewProps.triggerId.empty() ? nil : RCTNSStringFromString(newViewProps.triggerId);

  [self updateRegistrationWithRouteKey:routeKey
                             triggerId:triggerId
                         alignmentRect:ReactNavigationAlignmentRectFromProps(newViewProps)];
  [super updateProps:props oldProps:oldProps];
}

- (void)updateRegistrationWithRouteKey:(nullable NSString *)routeKey
                             triggerId:(nullable NSString *)triggerId
                         alignmentRect:(CGRect)alignmentRect
{
  if ([_routeKey isEqualToString:routeKey] &&
      [_triggerId isEqualToString:triggerId] &&
      ReactNavigationAreAlignmentRectsEqual(_alignmentRect, alignmentRect)) {
    return;
  }

  [self unregisterCurrentTrigger];
  _routeKey = [routeKey copy];
  _triggerId = [triggerId copy];
  _alignmentRect = alignmentRect;
  [self registerCurrentTrigger];
}

- (void)registerCurrentTrigger
{
  if (_routeKey.length == 0 || _triggerId.length == 0) {
    return;
  }

  [[ReactNavigationNativeStackZoomTransitionStore sharedStore]
      registerTriggerView:self
                 routeKey:_routeKey
                triggerId:_triggerId
            alignmentRect:_alignmentRect];
}

- (void)unregisterCurrentTrigger
{
  if (_routeKey.length == 0 || _triggerId.length == 0) {
    return;
  }

  [[ReactNavigationNativeStackZoomTransitionStore sharedStore]
      unregisterTriggerView:self
                   routeKey:_routeKey
                  triggerId:_triggerId];
}

@end
