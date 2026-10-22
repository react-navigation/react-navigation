#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTConversions.h>
#import <React/RCTViewComponentView.h>
#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

using namespace facebook::react;

@interface ReactNavigationLiquidGlassView : RCTViewComponentView
@end

@implementation ReactNavigationLiquidGlassView {
    ReactNavigationLiquidGlassViewImpl * _view;
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

        _view = [[ReactNavigationLiquidGlassViewImpl alloc] initWithEffect:nil];

        self.contentView = _view;
    }

    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newViewProps = *std::static_pointer_cast<ReactNavigationLiquidGlassViewProps const>(props);

    _view.interactive = newViewProps.interactive;
    _view.colorScheme = RCTNSStringFromString(toString(newViewProps.colorScheme));

    [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
    [super finalizeUpdates:updateMask];

    const auto borderMetrics = _props->resolveBorderMetrics(_layoutMetrics);
    const auto radii = borderMetrics.borderRadii;

    [_view setCornerRadiiWithTopLeft:CGSizeMake(radii.topLeft.horizontal, radii.topLeft.vertical)
                            topRight:CGSizeMake(radii.topRight.horizontal, radii.topRight.vertical)
                          bottomLeft:CGSizeMake(radii.bottomLeft.horizontal, radii.bottomLeft.vertical)
                         bottomRight:CGSizeMake(radii.bottomRight.horizontal, radii.bottomRight.vertical)
                        borderWidths:RCTUIEdgeInsetsFromEdgeInsets(borderMetrics.borderWidths)];
}

- (void)updateLayoutMetrics:(const LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const LayoutMetrics &)oldLayoutMetrics
{
    [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];

    [_view updateFrame:RCTCGRectFromRect(layoutMetrics.getPaddingFrame()) hostBounds:self.bounds];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [_view.childContainerView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    [childComponentView removeFromSuperview];
}

@end
