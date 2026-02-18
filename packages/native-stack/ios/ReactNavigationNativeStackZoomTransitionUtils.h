#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

extern NSString *const ReactNavigationRouteConfigDidChangeNotificationName;
extern NSString *const ReactNavigationRouteConfigDidChangeRouteKeyUserInfoKey;
extern NSString *const ReactNavigationPendingSourceDidChangeNotificationName;

#ifdef __cplusplus
extern "C" {
#endif

NSString *_Nullable ReactNavigationGetScreenIdForViewController(UIViewController *viewController);
BOOL ReactNavigationIsValidRect(CGRect rect);

#ifdef __cplusplus
}
#endif

NS_ASSUME_NONNULL_END
