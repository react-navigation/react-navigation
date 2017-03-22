#import <UIKit/UIKit.h>

@protocol AppNavigationDelegate <NSObject>

- (void)openViewWithName:(NSString *)name andParams:(NSDictionary *)params;

@optional

@end
