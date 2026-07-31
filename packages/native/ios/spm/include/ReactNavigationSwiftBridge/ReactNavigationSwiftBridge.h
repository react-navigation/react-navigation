#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, ReactNavigationCornerInsetDirection) {
  ReactNavigationCornerInsetDirectionVertical,
  ReactNavigationCornerInsetDirectionHorizontal,
};

typedef NS_ENUM(NSInteger, ReactNavigationCornerInsetEdge) {
  ReactNavigationCornerInsetEdgeTop,
  ReactNavigationCornerInsetEdgeRight,
  ReactNavigationCornerInsetEdgeBottom,
  ReactNavigationCornerInsetEdgeLeft,
};

@interface ReactNavigationCornerInsetViewBridgeProps : NSObject
@property (nonatomic) ReactNavigationCornerInsetDirection direction;
@property (nonatomic) ReactNavigationCornerInsetEdge edge;
@property (nonatomic) BOOL adaptive;
@end

@protocol ReactNavigationCornerInsetViewBridgeDelegate <NSObject>
- (void)cornerInsetDidChange:(CGFloat)cornerInset animated:(BOOL)animated;
@end

@interface ReactNavigationCornerInsetViewBridge : UIView
@property (nonatomic, weak, nullable) id<ReactNavigationCornerInsetViewBridgeDelegate> delegate;
- (void)updateProps:(ReactNavigationCornerInsetViewBridgeProps *)props
           oldProps:(ReactNavigationCornerInsetViewBridgeProps *)oldProps;
- (void)relayout;
@end

@interface ReactNavigationSFSymbolViewBridgeProps : NSObject
@property (nonatomic, nullable) NSString *name;
@property (nonatomic) CGFloat size;
@property (nonatomic, nullable) UIColor *color;
@property (nonatomic) NSInteger weight;
@property (nonatomic) NSString *scale;
@property (nonatomic) NSString *renderingMode;
@property (nonatomic, nullable) UIColor *colorPrimary;
@property (nonatomic, nullable) UIColor *colorSecondary;
@property (nonatomic, nullable) UIColor *colorTertiary;
@property (nonatomic) NSString *effect;
@property (nonatomic) CGFloat variableValue;
@property (nonatomic) NSString *variableValueMode;
@property (nonatomic) NSString *colorRenderingMode;
@property (nonatomic) NSString *effectRepeat;
@property (nonatomic) NSInteger effectRepeatCount;
@property (nonatomic) CGFloat effectRepeatDelay;
@property (nonatomic) CGFloat effectSpeed;
@property (nonatomic) NSString *effectScope;
@property (nonatomic) NSString *effectDirection;
@property (nonatomic) NSString *effectVariant;
@property (nonatomic) CGFloat effectAngle;
@property (nonatomic) BOOL effectReversing;
@property (nonatomic) BOOL effectCumulative;
@property (nonatomic) NSString *effectInactiveLayers;
@property (nonatomic) NSString *effectDrawDirection;
@property (nonatomic) NSString *contentTransition;
@property (nonatomic) CGFloat contentTransitionSpeed;
@property (nonatomic) NSString *contentTransitionVariant;
@property (nonatomic) NSString *contentTransitionScope;
@property (nonatomic) BOOL contentTransitionMagic;
@end

@interface ReactNavigationSFSymbolViewBridge : UIView
- (void)updateProps:(ReactNavigationSFSymbolViewBridgeProps *)props
           oldProps:(ReactNavigationSFSymbolViewBridgeProps *)oldProps;
@end

NS_ASSUME_NONNULL_END
