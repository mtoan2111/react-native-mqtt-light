//#import "MQTTSession.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "MQTTClient.h"


@interface Mqtt : RCTEventEmitter <RCTBridgeModule, MQTTSessionManagerDelegate>
//@interface RCT_EXTERN_MODULE(Mqtt, NSObject)


@property (strong, nonatomic) MQTTSessionManager *manager;
@property (strong, nonatomic) NSDictionary *defaultOptions;
@property (strong, nonatomic) NSDictionary *options;

@end
