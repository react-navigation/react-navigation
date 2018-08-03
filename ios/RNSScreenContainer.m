#import "RNSScreenContainer.h"
#import "RNSScreen.h"

@interface RNSScreenContainerView ()

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableSet<RNSScreenView *> *activeScreens;
@property (nonatomic, retain) NSMutableArray<RNSScreenView *> *reactSubviews;

@end

@implementation RNSScreenContainerView {
  BOOL _needUpdate;
}

- (instancetype)init
{
  if (self = [super init]) {
    _activeScreens = [NSMutableSet new];
    _reactSubviews = [NSMutableArray new];
    _controller = [[UIViewController alloc] init];
    _needUpdate = NO;
    [self addSubview:_controller.view];
  }
  return self;
}

- (void)markChildUpdated
{
  _needUpdate = YES;
}

- (void)didUpdateChildren
{
  [self updateContainerIfNeeded];
}

- (void)insertReactSubview:(RNSScreenView *)subview atIndex:(NSInteger)atIndex
{
  _needUpdate = YES;
  subview.reactSuperview = self;
  [_reactSubviews insertObject:subview atIndex:atIndex];
}

- (void)removeReactSubview:(RNSScreenView *)subview
{
  _needUpdate = YES;
  subview.reactSuperview = nil;
  [_reactSubviews removeObject:subview];
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}

- (void)detachScreen:(RNSScreenView *)screen
{
  [screen.controller willMoveToParentViewController:nil];
  [screen.controller.view removeFromSuperview];
  [screen.controller removeFromParentViewController];
  [_activeScreens removeObject:screen];
}

- (void)attachScreen:(RNSScreenView *)screen
{
  [screen.controller willMoveToParentViewController:_controller];
  [_controller.view addSubview:screen.controller.view];
  [screen.controller didMoveToParentViewController:_controller];
  [_activeScreens addObject:screen];
}

- (void)updateContainerIfNeeded
{
  if (!_needUpdate) {
    return;
  }
  _needUpdate = NO;

  // remove screens that are no longer active
  NSMutableSet *orphaned = [NSMutableSet setWithSet:_activeScreens];
  for (RNSScreenView *screen in _reactSubviews) {
    if (!screen.active && [_activeScreens containsObject:screen]) {
      [self detachScreen:screen];
    }
    [orphaned removeObject:screen];
  }
  for (RNSScreenView *screen in orphaned) {
    [self detachScreen:screen];
  }

  // add new screens in order they are placed in subviews array
  for (RNSScreenView *screen in _reactSubviews) {
    if (screen.active && ![_activeScreens containsObject:screen]) {
      [self attachScreen:screen];
    } else if (screen.active) {
      // if the view was already there we move it to "front" so that it is in the right
      // order accoring to the subviews array
      [_controller.view bringSubviewToFront:screen.controller.view];
    }
  }
}

- (void)didUpdateReactSubviews
{
  [self updateContainerIfNeeded];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [self reactAddControllerToClosestParent:_controller];
  _controller.view.frame = self.bounds;
}

@end


@implementation RNSScreenContainerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSScreenContainerView alloc] init];
}

@end
