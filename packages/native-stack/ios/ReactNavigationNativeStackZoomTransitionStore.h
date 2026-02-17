#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReactNavigationNativeStackZoomRouteConfig : NSObject

@property (nonatomic, copy, nullable) NSString *sourceId;
@property (nonatomic, copy, nullable) NSString *targetId;
@property (nonatomic, strong, nullable) UIColor *dimmingColor;
@property (nonatomic, copy, nullable) NSString *dimmingBlurEffect;
@property (nonatomic, copy, nullable) NSString *interactiveDismiss;

@end

@interface ReactNavigationNativeStackZoomTransitionStore : NSObject

+ (instancetype)sharedStore;

- (void)setRouteConfigForRouteKey:(NSString *)routeKey
                         sourceId:(nullable NSString *)sourceId
                         targetId:(nullable NSString *)targetId
                     dimmingColor:(nullable UIColor *)dimmingColor
               dimmingBlurEffect:(nullable NSString *)dimmingBlurEffect
               interactiveDismiss:(nullable NSString *)interactiveDismiss;
- (void)clearRouteConfigForRouteKey:(NSString *)routeKey;
- (nullable ReactNavigationNativeStackZoomRouteConfig *)routeConfigForRouteKey:(NSString *)routeKey;

- (void)registerTriggerView:(UIView *)view
                   routeKey:(NSString *)routeKey
                  triggerId:(NSString *)triggerId
              alignmentRect:(CGRect)alignmentRect;
- (void)unregisterTriggerView:(UIView *)view
                     routeKey:(NSString *)routeKey
                    triggerId:(NSString *)triggerId;
- (nullable UIView *)triggerViewForRouteKey:(NSString *)routeKey
                                   triggerId:(NSString *)triggerId;
- (CGRect)alignmentRectForRouteKey:(NSString *)routeKey
                           triggerId:(NSString *)triggerId;

- (void)setPendingSourceTriggerId:(NSString *)triggerId;
- (nullable NSString *)consumePendingSourceTriggerId;

@end

NS_ASSUME_NONNULL_END
