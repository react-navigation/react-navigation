#import "ReactNavigationReservedRegionsView.h"

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTMountingTransactionObserving.h>

using namespace facebook::react;

using Region = ReactNavigationReservedRegionsViewEventEmitter::OnRegionsChangeRegions;

@interface ReactNavigationReservedRegionsView () <ReactNavigationLayoutMeasurementViewDelegate, RCTMountingTransactionObserving>

@end

@implementation ReactNavigationReservedRegionsView {
  ReactNavigationLayoutMeasurementView * _view;
  std::vector<Region> _regions;
  BOOL _needsMeasurement;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationReservedRegionsViewComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationReservedRegionsViewProps>();
    _props = defaultProps;

    _view = [[ReactNavigationLayoutMeasurementView alloc] init];
    _view.delegate = self;

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &previousProps = *std::static_pointer_cast<ReactNavigationReservedRegionsViewProps const>(_props);
    const auto &nextProps = *std::static_pointer_cast<ReactNavigationReservedRegionsViewProps const>(props);

    BOOL changed = previousProps.kind != nextProps.kind ||
                   previousProps.includeInactive != nextProps.includeInactive;

    [super updateProps:props oldProps:oldProps];

    _needsMeasurement = _needsMeasurement || changed;
}

- (void)mountingTransactionDidMount:(const MountingTransaction &)transaction
               withSurfaceTelemetry:(const SurfaceTelemetry &)surfaceTelemetry
{
    // Any ancestor can move in the transaction, so we measure after all of it is mounted
    [_view updateMeasurementWithForce:_needsMeasurement animated:NO];
    _needsMeasurement = NO;
}

- (void)measureIn:(UIView *)view animated:(BOOL)animated
{
    std::vector<Region> regions;

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 270100
    if (@available(iOS 27.1, *)) {
        const auto &props = *std::static_pointer_cast<ReactNavigationReservedRegionsViewProps const>(_props);

        UIViewReservedRegionKind *kind = props.kind == ReactNavigationReservedRegionsViewKind::Division
            ? [UIViewReservedRegionKind divisionRegionKind]
            : [UIViewReservedRegionKind occlusionRegionKind];
        UIViewReservedRegionQueryOptions options = props.includeInactive
            ? UIViewReservedRegionQueryOptionsIncludeInactive
            : UIViewReservedRegionQueryOptionsNone;

        for (UIViewReservedRegion *region in [view reservedRegionsOfKind:kind options:options]) {
            regions.push_back({
                .frame = {
                    .x = region.frame.origin.x,
                    .y = region.frame.origin.y,
                    .width = region.frame.size.width,
                    .height = region.frame.size.height,
                },
                .margins = {
                    .top = region.margins.top,
                    .right = region.margins.right,
                    .bottom = region.margins.bottom,
                    .left = region.margins.left,
                },
                .active = static_cast<bool>(region.isActive),
            });
        }
    }
#endif

    BOOL changed = regions.size() != _regions.size();

    for (size_t i = 0; !changed && i < regions.size(); i++) {
        const auto &next = regions[i];
        const auto &previous = _regions[i];

        changed = next.frame.x != previous.frame.x ||
                  next.frame.y != previous.frame.y ||
                  next.frame.width != previous.frame.width ||
                  next.frame.height != previous.frame.height ||
                  next.margins.top != previous.margins.top ||
                  next.margins.right != previous.margins.right ||
                  next.margins.bottom != previous.margins.bottom ||
                  next.margins.left != previous.margins.left ||
                  next.active != previous.active;
    }

    // We only send the event when the regions change, and they start empty
    // So there's no event or re-render in JS on devices without reserved regions
    if (!changed || _eventEmitter == nullptr) {
        return;
    }

    _regions = regions;

    std::static_pointer_cast<const ReactNavigationReservedRegionsViewEventEmitter>(_eventEmitter)
        ->onRegionsChange({ .regions = regions });
}

@end
