#import "ReactNavigationCornerInsetView.h"

#import <React/RCTComponentViewProtocol.h>
#import <React/RCTConversions.h>

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/renderer/components/ReactNavigationSpec/RCTComponentViewHelpers.h>
#import <react/renderer/core/State.h>
#import "ReactNavigationCornerInsetViewComponentDescriptor.h"
#import "ReactNavigationCornerInsetViewShadowNode.h"

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface ReactNavigationCornerInsetView () <RCTReactNavigationCornerInsetViewViewProtocol, ReactNavigationCornerInsetViewImplDelegate>

@end

@implementation ReactNavigationCornerInsetView {
  ReactNavigationCornerInsetViewImpl * _view;
  ReactNavigationCornerInsetViewShadowNode::ConcreteState::Shared _state;
  CGFloat _currentCornerInset;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationCornerInsetViewComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationCornerInsetViewProps>();
    _props = defaultProps;

    _view = [[ReactNavigationCornerInsetViewImpl alloc] init];
    _view.delegate = self;

    self.contentView = _view;
  }

  return self;
}

static ReactNavigationCornerInsetViewImplProps *convertProps(const Props::Shared &props) {
    const auto &viewProps = *std::static_pointer_cast<ReactNavigationCornerInsetViewProps const>(props);

    ReactNavigationCornerInsetViewImplProps *swiftProps = [[ReactNavigationCornerInsetViewImplProps alloc] init];

    swiftProps.direction = viewProps.direction == ReactNavigationCornerInsetViewDirection::Horizontal
        ? CornerInsetsDirectionHorizontal
        : CornerInsetsDirectionVertical;

    return swiftProps;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [_view updateProps:convertProps(props) oldProps:convertProps(_props)];
    [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState
{
    _state = std::static_pointer_cast<ReactNavigationCornerInsetViewShadowNode::ConcreteState const>(state);
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
    [super finalizeUpdates:updateMask];
    [self updateStateIfNeeded];
}

- (void)updateStateIfNeeded
{
    [_view setNeedsLayout];
    [_view layoutIfNeeded];
}

- (void)cornerInsetDidChange:(CGFloat)cornerInset
{
    if (_currentCornerInset == cornerInset) {
        return;
    }

    _currentCornerInset = cornerInset;

    if (!_state) {
        return;
    }

    _state->updateState([=](ReactNavigationCornerInsetViewShadowNode::ConcreteState::Data const &oldData)
        -> ReactNavigationCornerInsetViewShadowNode::ConcreteState::SharedData {
            auto newData = oldData;
            newData.cornerInset = static_cast<Float>(cornerInset);
            return std::make_shared<ReactNavigationCornerInsetViewShadowNode::ConcreteState::Data const>(newData);
        });
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _state.reset();
    _currentCornerInset = 0;
}

Class<RCTComponentViewProtocol> ReactNavigationCornerInsetViewCls(void)
{
    return ReactNavigationCornerInsetView.class;
}

@end
