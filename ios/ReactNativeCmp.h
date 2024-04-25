
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNReactNativeCmpSpec.h"

@interface ReactNativeCmp : NSObject <NativeReactNativeCmpSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ReactNativeCmp : NSObject <RCTBridgeModule>
#endif

@end
