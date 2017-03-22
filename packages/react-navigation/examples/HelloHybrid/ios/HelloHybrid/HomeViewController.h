
#import <UIKit/UIKit.h>
#import "AppNavigationDelegate.h"

@interface HomeViewController : UIViewController {
  id<AppNavigationDelegate> navigation;
}

- (id) initWithDelegate:(id<AppNavigationDelegate>)delegate;

@end

