
#import <UIKit/UIKit.h>
#import "AppNavigationDelegate.h"

@interface ProfileViewController : UIViewController {
  id<AppNavigationDelegate> navigation;
}

- (id) initWithDelegate:(id<AppNavigationDelegate>)delegate;

@end

