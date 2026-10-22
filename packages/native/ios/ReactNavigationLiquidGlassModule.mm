#import <ReactNavigationSpec/ReactNavigationSpec.h>

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

using namespace facebook::react;

@interface ReactNavigationLiquidGlassModule : NSObject <NativeReactNavigationLiquidGlassModuleSpec>
@end

@implementation ReactNavigationLiquidGlassModule

+ (NSString *)moduleName
{
    return @"ReactNavigationLiquidGlassModule";
}

- (NSNumber *)isSupported
{
    return @(ReactNavigationLiquidGlassViewImpl.isSupported);
}

- (std::shared_ptr<TurboModule>)getTurboModule:(const ObjCTurboModule::InitParams &)params
{
    return std::make_shared<NativeReactNavigationLiquidGlassModuleSpecJSI>(params);
}

@end
