#import "ReactNavigationLiquidGlassView.h"

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTConversions.h>
#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

using namespace facebook::react;

@implementation ReactNavigationLiquidGlassView {
    ReactNavigationLiquidGlassViewImpl * _view;

    // We make the glass fill the padding frame, so it doesn't cover the border
    // But frames of children are relative to the bounds of this view, which include the border
    // So we mount children into a separate view that's offset by the border to match the bounds
    UIView * _childContainerView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationLiquidGlassViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ReactNavigationLiquidGlassViewProps>();
        _props = defaultProps;

        _view = [[ReactNavigationLiquidGlassViewImpl alloc] init];

        _childContainerView = [[UIView alloc] init];

        [_view.contentView addSubview:_childContainerView];

        self.contentView = _view;
    }

    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<ReactNavigationLiquidGlassViewProps const>(props);

    _view.interactive = newViewProps.interactive;

    switch (newViewProps.colorScheme) {
        case ReactNavigationLiquidGlassViewColorScheme::Light:
            _view.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
            break;

        case ReactNavigationLiquidGlassViewColorScheme::Dark:
            _view.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
            break;

        case ReactNavigationLiquidGlassViewColorScheme::System:
            _view.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
            break;
    }

    [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
    [super finalizeUpdates:updateMask];

    if (@available(iOS 26.0, *)) {
        const auto borderMetrics = _props->resolveBorderMetrics(_layoutMetrics);
        const auto radii = borderMetrics.borderRadii;
        const auto widths = borderMetrics.borderWidths;

        auto innerRadius = [](const CornerRadii &radius, Float horizontalWidth, Float verticalWidth) {
            return [UICornerRadius fixedRadius:MAX(MAX(radius.horizontal - horizontalWidth, radius.vertical - verticalWidth), 0)];
        };

        _view.cornerConfiguration = [UICornerConfiguration
            configurationWithTopLeftRadius:innerRadius(radii.topLeft, widths.left, widths.top)
                            topRightRadius:innerRadius(radii.topRight, widths.right, widths.top)
                          bottomLeftRadius:innerRadius(radii.bottomLeft, widths.left, widths.bottom)
                         bottomRightRadius:innerRadius(radii.bottomRight, widths.right, widths.bottom)];
    }
}

- (void)updateLayoutMetrics:(const LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const LayoutMetrics &)oldLayoutMetrics
{
    [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];

    _view.frame = RCTCGRectFromRect(layoutMetrics.getPaddingFrame());
    _childContainerView.frame = [_view.contentView convertRect:self.bounds fromView:self];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_childContainerView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [childComponentView removeFromSuperview];
}

@end
