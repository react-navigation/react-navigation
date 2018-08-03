#import <React/RCTViewManager.h>

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;
- (void)didUpdateChildren;

@end

@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate>

- (void)markChildUpdated;
- (void)didUpdateChildren;

@end

@interface RNSScreenContainerManager : RCTViewManager
@end
