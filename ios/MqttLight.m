#import "MqttLight.h"

@implementation Mqtt
//
RCT_EXPORT_MODULE()
- (NSArray<NSString *> *)supportedEvents{
    return @[@"message", @"error"];
}

RCT_REMAP_METHOD(initQueue,
                 initQueueWithOptions:(NSDictionary *)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    self.defaultOptions = @{
        @"uri": @"localhost",
        @"clientId": @"react-native-mqtt-light",
        @"userName": @"admin",
        @"password": @"admin",
        @"keepalive": @60,
        @"auth": @YES,
        @"port": @1883,
        @"cleanSession": @NO,
        @"autoReconnect": @YES,
        @"willTopic": @"",
        @"willQos": @0,
        @"willRetainFlag": @YES,
        @"will": @NO,
        @"tls": @NO
    };

    self.options = [NSMutableDictionary dictionaryWithDictionary:self.defaultOptions];
    for (NSString *key in options){
        [self.options setValue:options[key] forKey:key];
    }

    if (!self.manager){
        self.manager = [[MQTTSessionManager alloc] init];
        self.manager.delegate = self;

        MQTTSSLSecurityPolicy *sslPolicy = nil;
        if (self.options[@"tls"]){
            sslPolicy = [MQTTSSLSecurityPolicy policyWithPinningMode:MQTTSSLPinningModeNone];
            sslPolicy.allowInvalidCertificates = YES;
        }

        [self.manager connectTo:[self.options valueForKey:@"uri"]
                           port:[self.options[@"port"] intValue]
                            tls:[self.options[@"tls"] boolValue]
                      keepalive:[self.options[@"keepalive"] intValue]
                          clean:[self.options[@"cleanSession"] boolValue]
                           auth:[self.options[@"auth"] boolValue]
                           user:[self.options valueForKey:@"userName"]
                           pass:[self.options valueForKey:@"password"]
                           will:NO
                      willTopic:nil
                        willMsg:nil
                        willQos:MQTTQosLevelAtMostOnce
                 willRetainFlag:NO
                   withClientId:[self.options valueForKey:@"clientId"]
                 securityPolicy:sslPolicy
                   certificates:nil
                  protocolLevel:MQTTProtocolVersion311
                 connectHandler:^(NSError *error){
            NSLog(@"Connection info %@", error.localizedDescription);
        }];

        [self.manager addObserver:self
                       forKeyPath:@"state"
                          options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
                          context:nil];
    }
    else {
        [self.manager connectToLast:^(NSError *error){
            NSLog(@"Connection info %@", error.localizedDescription);
        }];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context{
    switch (self.manager.state) {
        case MQTTSessionManagerStateClosed:
            break;
        case MQTTSessionManagerStateClosing:
            break;
        case MQTTSessionManagerStateConnected:
            break;
        case MQTTSessionManagerStateConnecting:
            break;
        case MQTTSessionManagerStateError:
            break;
        case MQTTSessionManagerStateStarting:
            break;
        default:
            break;
    }
}

@end
