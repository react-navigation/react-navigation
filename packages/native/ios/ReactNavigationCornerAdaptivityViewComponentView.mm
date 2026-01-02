#import "ReactNavigationCornerAdaptivityViewComponentView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/renderer/components/ReactNavigationSpec/RCTComponentViewHelpers.h>

#import "ReactNavigationCornerAdaptivityViewComponentDescriptor.h"
#import "ReactNavigationCornerAdaptivityViewShadowNode.h"

using namespace facebook::react;



#define REACT_NAV_HAS_ADAPTIVITY                                                                     \
((defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000) ||        \
(defined(__TV_OS_VERSION_MAX_ALLOWED) && __TV_OS_VERSION_MAX_ALLOWED >= 260000))

#if REACT_NAV_HAS_ADAPTIVITY
static UIWindow *ReactNavigationGetPreferredWindow(void)
{
  NSSet<UIScene *> *connectedScenes = [UIApplication sharedApplication].connectedScenes;
  
  for (UIScene *scene in connectedScenes) {
    if (scene.activationState != UISceneActivationStateForegroundActive) {
      continue;
    }
    
    if (![scene isKindOfClass:[UIWindowScene class]]) {
      continue;
    }
    
    UIWindowScene *windowScene = (UIWindowScene *)scene;
    
    for (UIWindow *window in windowScene.windows) {
      if (window.isHidden) {
        continue;
      }
      
      if (window.isKeyWindow) {
        return window;
      }
    }
  }
  
  return nil;
}
#endif

#if REACT_NAV_HAS_ADAPTIVITY
static UIViewLayoutRegionAdaptivityAxis ReactNavigationAxisFromCppDirection(
                                                                            ReactNavigationCornerAdaptivityViewDirection direction)
{
  switch (direction) {
    case ReactNavigationCornerAdaptivityViewDirection::Horizontal:
      return UIViewLayoutRegionAdaptivityAxisHorizontal;
    case ReactNavigationCornerAdaptivityViewDirection::Vertical:
    default:
      return UIViewLayoutRegionAdaptivityAxisVertical;
  }
}
#endif

#if REACT_NAV_HAS_ADAPTIVITY
static UIEdgeInsets ReactNavigationCornerInsetsForAxis(
                                                       UIWindow *_Nullable window,
                                                       UIViewLayoutRegionAdaptivityAxis axis)
{
  if (window == nil) {
    return UIEdgeInsetsZero;
  }
  
  UIEdgeInsets insets = window.safeAreaInsets;
  
  if (@available(iOS 26.0, tvOS 26.0, *)) {
    UIViewLayoutRegion *region =
    [UIViewLayoutRegion safeAreaLayoutRegionWithCornerAdaptation:axis];
    
    insets = [window edgeInsetsForLayoutRegion:region];
  }
  
  return insets;
}
#endif
@implementation ReactNavigationCornerAdaptivityViewNativeComponent {
  UIEdgeInsets _currentCornerInsets;
#if REACT_NAV_HAS_ADAPTIVITY
  UIViewLayoutRegionAdaptivityAxis _axis;
#endif
  ReactNavigationCornerAdaptivityViewShadowNode::ConcreteState::Shared _state;
}

+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps =
    std::make_shared<const ReactNavigationCornerAdaptivityViewProps>();
    _props = defaultProps;
    
    _currentCornerInsets = UIEdgeInsetsZero;
#if REACT_NAV_HAS_ADAPTIVITY
    _axis = UIViewLayoutRegionAdaptivityAxisVertical;
#endif
    _state.reset();
  }
  
  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  [self updateCornerInsetsIfNeeded];
}

- (void)safeAreaInsetsDidChange
{
  [super safeAreaInsetsDidChange];
  [self updateCornerInsetsIfNeeded];
}

- (void)updateCornerInsetsIfNeeded
{
#if REACT_NAV_HAS_ADAPTIVITY
  if (@available(iOS 26.0, tvOS 26.0, *)) {
    UIWindow *window = self.window;
    if (window == nil) {
      window = ReactNavigationGetPreferredWindow();
    }
    
    UIEdgeInsets nextInsets = ReactNavigationCornerInsetsForAxis(window, _axis);
    if (!UIEdgeInsetsEqualToEdgeInsets(nextInsets, _currentCornerInsets)) {
      _currentCornerInsets = nextInsets;
      [self updateShadowState];
    }
    return;
  }
#endif
  
  if (!UIEdgeInsetsEqualToEdgeInsets(_currentCornerInsets, UIEdgeInsetsZero)) {
    _currentCornerInsets = UIEdgeInsetsZero;
    [self updateShadowState];
  }
}

- (void)updateShadowState
{
  if (!_state) {
    return;
  }
  
  auto convertedInsets = RCTEdgeInsetsFromUIEdgeInsets(_currentCornerInsets);
  
  _state->updateState(
                      [=](ReactNavigationCornerAdaptivityViewShadowNode::ConcreteState::Data const &oldData)
                      -> ReactNavigationCornerAdaptivityViewShadowNode::ConcreteState::SharedData {
                        auto newData = oldData;
                        newData.cornerInsets = convertedInsets;
                        return std::make_shared<ReactNavigationCornerAdaptivityViewShadowNode::ConcreteState::Data const>(newData);
                      });
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ReactNavigationCornerAdaptivityViewComponentDescriptor>();
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldViewProps =
  *std::static_pointer_cast<const ReactNavigationCornerAdaptivityViewProps>(_props);
  const auto &newViewProps =
  *std::static_pointer_cast<const ReactNavigationCornerAdaptivityViewProps>(props);
  
#if REACT_NAV_HAS_ADAPTIVITY
  if (newViewProps.direction != oldViewProps.direction) {
    _axis = ReactNavigationAxisFromCppDirection(newViewProps.direction);
    [self updateCornerInsetsIfNeeded];
  }
#endif
  
  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState
{
  _state =
  std::static_pointer_cast<ReactNavigationCornerAdaptivityViewShadowNode::ConcreteState const>(state);
  [self updateShadowState];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _currentCornerInsets = UIEdgeInsetsZero;
#if REACT_NAV_HAS_ADAPTIVITY
  _axis = UIViewLayoutRegionAdaptivityAxisVertical;
#endif
  _state.reset();
}

@end

Class<RCTComponentViewProtocol> ReactNavigationCornerAdaptivityViewCls(void)
{
  return ReactNavigationCornerAdaptivityViewNativeComponent.class;
}

#undef REACT_NAV_HAS_ADAPTIVITY
