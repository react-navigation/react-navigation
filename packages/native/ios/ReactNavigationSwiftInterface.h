// Objective-C declarations of the Swift views for Swift Package Manager builds.
//
// SwiftPM builds Swift and Objective-C++ in separate targets. Xcode compiles the
// Objective-C++ target with `-fno-cxx-modules`, so it can't `@import` the Swift
// target, and the generated `-Swift.h` header isn't on its header search path.
// Enabling C++ modules doesn't work either, since React Native's C++ headers
// fail to build as modules. So the declarations are repeated here instead.
//
// They must match the `@objc` declarations in the Swift files. The Swift classes
// use explicit `@objc(...)` names so that the runtime names match these.

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, CornerInsetDirection) {
  CornerInsetDirectionVertical = 0,
  CornerInsetDirectionHorizontal = 1,
};

typedef NS_ENUM(NSInteger, CornerInsetEdge) {
  CornerInsetEdgeTop = 0,
  CornerInsetEdgeRight = 1,
  CornerInsetEdgeBottom = 2,
  CornerInsetEdgeLeft = 3,
};

@interface ReactNavigationCornerInsetViewImplProps : NSObject
@property (nonatomic) CornerInsetDirection direction;
@property (nonatomic) CornerInsetEdge edge;
@property (nonatomic) BOOL adaptive;
@end

@protocol ReactNavigationCornerInsetViewImplDelegate <NSObject>
- (void)cornerInsetDidChange:(CGFloat)cornerInset animated:(BOOL)animated;
@end

@interface ReactNavigationCornerInsetViewImpl : UIView
@property (nonatomic, weak, nullable) id<ReactNavigationCornerInsetViewImplDelegate> delegate;
- (void)updateProps:(ReactNavigationCornerInsetViewImplProps *)props
           oldProps:(ReactNavigationCornerInsetViewImplProps *)oldProps;
- (void)relayout;
@end

@interface ReactNavigationSFSymbolViewImplProps : NSObject
@property (nonatomic, copy, nullable) NSString *name;
@property (nonatomic) CGFloat size;
@property (nonatomic, strong) UIColor *color;
@property (nonatomic) NSInteger weight;
@property (nonatomic, copy) NSString *scale;
@property (nonatomic, copy) NSString *renderingMode;
@property (nonatomic, strong, nullable) UIColor *colorPrimary;
@property (nonatomic, strong, nullable) UIColor *colorSecondary;
@property (nonatomic, strong, nullable) UIColor *colorTertiary;
@property (nonatomic, copy) NSString *effect;
@property (nonatomic) CGFloat variableValue;
@property (nonatomic, copy) NSString *variableValueMode;
@property (nonatomic, copy) NSString *colorRenderingMode;
@property (nonatomic, copy) NSString *effectRepeat;
@property (nonatomic) NSInteger effectRepeatCount;
@property (nonatomic) CGFloat effectRepeatDelay;
@property (nonatomic) CGFloat effectSpeed;
@property (nonatomic, copy) NSString *effectScope;
@property (nonatomic, copy) NSString *effectDirection;
@property (nonatomic, copy) NSString *effectVariant;
@property (nonatomic) CGFloat effectAngle;
@property (nonatomic) BOOL effectReversing;
@property (nonatomic) BOOL effectCumulative;
@property (nonatomic, copy) NSString *effectInactiveLayers;
@property (nonatomic, copy) NSString *effectDrawDirection;
@property (nonatomic, copy) NSString *contentTransition;
@property (nonatomic) CGFloat contentTransitionSpeed;
@property (nonatomic, copy) NSString *contentTransitionVariant;
@property (nonatomic, copy) NSString *contentTransitionScope;
@property (nonatomic) BOOL contentTransitionMagic;
@end

@interface ReactNavigationSFSymbolViewImpl : UIView
- (void)updateProps:(ReactNavigationSFSymbolViewImplProps *)props
           oldProps:(ReactNavigationSFSymbolViewImplProps *)oldProps;
@end

NS_ASSUME_NONNULL_END
