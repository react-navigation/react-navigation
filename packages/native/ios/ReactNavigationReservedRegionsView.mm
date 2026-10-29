#import "ReactNavigationReservedRegionsView.h"

#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/featureflags/ReactNativeFeatureFlags.h>
#import <react/utils/FollyConvert.h>

#import <React/RCTComponentEvent.h>
#import <React/RCTConstants.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTMountingTransactionObserving.h>

using namespace facebook::react;

@interface ReactNavigationReservedRegionsView () <RCTMountingTransactionObserving>

@end

@implementation ReactNavigationReservedRegionsView {
    folly::dynamic _payload;
    NSMutableDictionary<id<NSCopying>, NSNumber *> *_regionIds;
    int _nextRegionId;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationReservedRegionsViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ReactNavigationReservedRegionsViewProps>();
        _props = defaultProps;
        _regionIds = [NSMutableDictionary new];
    }

    return self;
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];

    _payload = nullptr;
    [_regionIds removeAllObjects];
    _nextRegionId = 0;
}

- (void)mountingTransactionDidMount:(const MountingTransaction &)transaction
               withSurfaceTelemetry:(const SurfaceTelemetry &)surfaceTelemetry
{
    if (@available(iOS 26.0, *)) {
        [self setNeedsUpdateProperties];
    }
}

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 270100
- (void)updateProperties
{
    [super updateProperties];

    if (@available(iOS 27.1, *)) {
        const std::pair<UIViewReservedRegionKind *, const char *> kinds[] = {
            { [UIViewReservedRegionKind occlusionRegionKind], "occlusion" },
            { [UIViewReservedRegionKind divisionRegionKind], "division" },
        };

        auto regions = folly::dynamic::array();
        NSMutableDictionary<id<NSCopying>, NSNumber *> *regionIds = [NSMutableDictionary new];

        for (const auto &[kind, kindName] : kinds) {
            for (UIViewReservedRegion *region in [self reservedRegionsOfKind:kind options:UIViewReservedRegionQueryOptionsIncludeInactive]) {
                NSNumber *regionId = _regionIds[region.identifier] ?: @(_nextRegionId++);

                regionIds[region.identifier] = regionId;

                regions.push_back(folly::dynamic::object
                    ("id", regionId.intValue)
                    ("kind", kindName)
                    ("frame", folly::dynamic::object
                        ("x", region.frame.origin.x)
                        ("y", region.frame.origin.y)
                        ("width", region.frame.size.width)
                        ("height", region.frame.size.height))
                    ("margins", folly::dynamic::object
                        ("top", region.margins.top)
                        ("right", region.margins.right)
                        ("bottom", region.margins.bottom)
                        ("left", region.margins.left))
                    ("active", static_cast<bool>(region.isActive)));
            }
        }

        _regionIds = regionIds;

        folly::dynamic payload = folly::dynamic::object
            ("regions", std::move(regions))
            ("size", folly::dynamic::object
                ("width", self.bounds.size.width)
                ("height", self.bounds.size.height));

        if (payload == _payload || _eventEmitter == nullptr) {
            return;
        }

        _payload = payload;

        // The legacy native Animated module doesn't receive Fabric events,
        // so we post it separately for `Animated.event` with `useNativeDriver: true`
        if (!ReactNativeFeatureFlags::cxxNativeAnimatedEnabled()) {
            RCTComponentEvent *event = [[RCTComponentEvent alloc] initWithName:@"onRegionsChange"
                                                                       viewTag:@(self.tag)
                                                                          body:convertFollyDynamicToId(_payload)];

            [[NSNotificationCenter defaultCenter] postNotificationName:RCTNotifyEventDispatcherObserversOfEvent_DEPRECATED
                                                                object:nil
                                                              userInfo:@{ @"event": event }];
        }

        _eventEmitter->experimental_flushSync([&]() {
            _eventEmitter->dispatchEvent("regionsChange", std::move(payload), RawEvent::Category::Discrete);
        });
    }
}
#endif

@end
