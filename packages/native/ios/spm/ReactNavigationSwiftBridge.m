#import "ReactNavigationSwiftBridge/ReactNavigationSwiftBridge.h"

@import ReactNavigationSwift;

@implementation ReactNavigationCornerInsetViewBridgeProps
@end

@interface ReactNavigationCornerInsetViewBridge () <ReactNavigationCornerInsetViewImplDelegate>
@end

@implementation ReactNavigationCornerInsetViewBridge {
  ReactNavigationCornerInsetViewImpl * _view;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _view = [ReactNavigationCornerInsetViewImpl new];
    _view.frame = self.bounds;
    _view.delegate = self;
    _view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    [self addSubview:_view];
  }

  return self;
}

- (void)updateProps:(ReactNavigationCornerInsetViewBridgeProps *)props
           oldProps:(ReactNavigationCornerInsetViewBridgeProps *)oldProps
{
  ReactNavigationCornerInsetViewImplProps *newSwiftProps = [self convertProps:props];
  ReactNavigationCornerInsetViewImplProps *oldSwiftProps = [self convertProps:oldProps];

  [_view updateProps:newSwiftProps oldProps:oldSwiftProps];
}

- (void)relayout
{
  [_view relayout];
}

- (void)cornerInsetDidChange:(CGFloat)cornerInset animated:(BOOL)animated
{
  [self.delegate cornerInsetDidChange:cornerInset animated:animated];
}

- (ReactNavigationCornerInsetViewImplProps *)convertProps:(ReactNavigationCornerInsetViewBridgeProps *)props
{
  ReactNavigationCornerInsetViewImplProps *swiftProps = [[ReactNavigationCornerInsetViewImplProps alloc] init];

  swiftProps.direction = props.direction == ReactNavigationCornerInsetDirectionHorizontal
      ? CornerInsetDirectionHorizontal
      : CornerInsetDirectionVertical;

  switch (props.edge) {
    case ReactNavigationCornerInsetEdgeRight:
      swiftProps.edge = CornerInsetEdgeRight;
      break;
    case ReactNavigationCornerInsetEdgeBottom:
      swiftProps.edge = CornerInsetEdgeBottom;
      break;
    case ReactNavigationCornerInsetEdgeLeft:
      swiftProps.edge = CornerInsetEdgeLeft;
      break;
    case ReactNavigationCornerInsetEdgeTop:
      swiftProps.edge = CornerInsetEdgeTop;
      break;
  }

  swiftProps.adaptive = props.adaptive;

  return swiftProps;
}

@end

@implementation ReactNavigationSFSymbolViewBridgeProps
@end

@implementation ReactNavigationSFSymbolViewBridge {
  ReactNavigationSFSymbolViewImpl * _view;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _view = [ReactNavigationSFSymbolViewImpl new];
    _view.frame = self.bounds;
    _view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    [self addSubview:_view];
  }

  return self;
}

- (void)updateProps:(ReactNavigationSFSymbolViewBridgeProps *)props
           oldProps:(ReactNavigationSFSymbolViewBridgeProps *)oldProps
{
  ReactNavigationSFSymbolViewImplProps *newSwiftProps = [self convertProps:props];
  ReactNavigationSFSymbolViewImplProps *oldSwiftProps = [self convertProps:oldProps];

  [_view updateProps:newSwiftProps oldProps:oldSwiftProps];
}

- (ReactNavigationSFSymbolViewImplProps *)convertProps:(ReactNavigationSFSymbolViewBridgeProps *)props
{
  ReactNavigationSFSymbolViewImplProps *swiftProps = [[ReactNavigationSFSymbolViewImplProps alloc] init];

  swiftProps.name = props.name;
  swiftProps.size = props.size;
  if (props.color) {
    swiftProps.color = props.color;
  }
  swiftProps.weight = props.weight;
  swiftProps.scale = props.scale;
  swiftProps.renderingMode = props.renderingMode;
  swiftProps.colorPrimary = props.colorPrimary;
  swiftProps.colorSecondary = props.colorSecondary;
  swiftProps.colorTertiary = props.colorTertiary;
  swiftProps.effect = props.effect;
  swiftProps.variableValue = props.variableValue;
  swiftProps.variableValueMode = props.variableValueMode;
  swiftProps.colorRenderingMode = props.colorRenderingMode;
  swiftProps.effectRepeat = props.effectRepeat;
  swiftProps.effectRepeatCount = props.effectRepeatCount;
  swiftProps.effectRepeatDelay = props.effectRepeatDelay;
  swiftProps.effectSpeed = props.effectSpeed;
  swiftProps.effectScope = props.effectScope;
  swiftProps.effectDirection = props.effectDirection;
  swiftProps.effectVariant = props.effectVariant;
  swiftProps.effectAngle = props.effectAngle;
  swiftProps.effectReversing = props.effectReversing;
  swiftProps.effectCumulative = props.effectCumulative;
  swiftProps.effectInactiveLayers = props.effectInactiveLayers;
  swiftProps.effectDrawDirection = props.effectDrawDirection;
  swiftProps.contentTransition = props.contentTransition;
  swiftProps.contentTransitionSpeed = props.contentTransitionSpeed;
  swiftProps.contentTransitionVariant = props.contentTransitionVariant;
  swiftProps.contentTransitionScope = props.contentTransitionScope;
  swiftProps.contentTransitionMagic = props.contentTransitionMagic;

  return swiftProps;
}

@end
