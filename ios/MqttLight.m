#import "MqttLight.h"

@implementation Mqtt
//
RCT_EXPORT_MODULE()
- (NSArray<NSString *> *)supportedEvents{
    return @[@"MQTTMessage", @"MQTTError", @"MQTTConnectionLost"];
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
        
        [self.manager addObserver:self
                       forKeyPath:@"state"
                          options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
                          context:nil];

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
            if (error){
                reject(@"Connection error", @"Something went wrong", error);
            } else {
                resolve(@"connection has been established");
            }
        }];
    }
    else {
        [self.manager connectToLast:^(NSError *error){
            if (error){
                reject(@"Connection error", @"Something went wrong", error);
            } else {
                resolve(@"connection has been established");
            }
        }];
    }
}

RCT_REMAP_METHOD(subscribe,
                 subscribeWithTopic: (NSString *)topic
                 qos:(nonnull NSNumber *)qos
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    if (self.manager && self.manager.state == MQTTSessionManagerStateConnected){
        [self.manager setSubscription:topic
                                  qos:qos
                     subscribeHandler:^(NSError *error, NSArray<NSNumber *> *gQoss) {
            if (error){
                reject(@"subscribe error", [NSString stringWithFormat:@"Could not subscribe into the topic %@", topic], error);
            } else {
                resolve([NSString stringWithFormat:@"Topic %@ has been subscribed", topic]);
            }
        }];
    } else {
        reject(@"subscribe error", @"MQTT is not connected", nil);
    }
    
}

RCT_REMAP_METHOD(publish,
                 publishWithTopic:(NSString *)topic
                 message:(NSString *)msg
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    if (self.manager && self.manager.state == MQTTSessionManagerStateConnected){
        [self.manager sendData:[msg dataUsingEncoding:NSUTF8StringEncoding]
                         topic:topic
                           qos:0
                        retain:false
                publishHandler:^(NSError *error) {
            if (error){
                reject(@"publish error", [NSString stringWithFormat:@"Could not publish message to the topic %@", topic], error);
            } else {
                resolve([NSString stringWithFormat:@"Message has been sent to the topic %@", topic]);
            }
        }];
    } else {
        reject(@"subscribe error", @"MQTT is not connected", nil);
    }
}

RCT_REMAP_METHOD(unsubscribe,
                 unsubscribeWithTopics:(NSArray<NSString *> *)topics
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    if (self.manager && self.manager.state == MQTTSessionManagerStateConnected){
        [self.manager unsetSubscriptions:topics
                       unsubscribehandle:^(NSError *error) {
            if (error){
                reject(@"unsubscribe error", [NSString stringWithFormat:@"Could not subscribe into the topics"], error);
            } else {
                resolve([NSString stringWithFormat:@"The topics has been unsubscribed"]);
            }
        }];
    } else {
        reject(@"subscribe error", @"MQTT is not connected", nil);
    }
    
}

RCT_REMAP_METHOD(unsubscribe,
                 unsubscribeWithTopic:(NSString *)topic
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    if (self.manager && self.manager.state == MQTTSessionManagerStateConnected){
        [self.manager unsetSubscription:topic unsubscribehandle:^(NSError *error) {
            if (error){
                reject(@"unsubscribe error", [NSString stringWithFormat:@"Could not subscribe into the topics"], error);
            }else {
                resolve([NSString stringWithFormat:@"The topics has been unsubscribed"]);
            }
        }];
    } else {
        reject(@"subscribe error", @"MQTT is not connected", nil);
    }
}

RCT_REMAP_METHOD(disconnect,
                 disconnectWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    if (self.manager && self.manager.state == MQTTSessionManagerStateConnected){
        [self.manager disconnectWithDisconnectHandler:^(NSError *error) {
            if (error){
                reject(@"disconnect error", error.localizedDescription, error);
            }else {
                resolve([NSString stringWithFormat:@"The client has been disconnected"]);
            }
        }];
    }else {
        reject(@"disconnect error", @"The connection has been lost", nil);
    }
}

RCT_REMAP_METHOD(isConnected,
                 isConnectedWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
    if (self.manager && self.manager.state == MQTTSessionManagerStateConnected){
        resolve([NSString stringWithFormat:@"The client is still connect"]);
    }else {
        reject(@"connection error", @"The connection has been lost", nil);
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context{
    switch (self.manager.state) {
        case MQTTSessionManagerStateClosed:
            [self sendEventWithName:@"MQTTConnectionLost"
                               body:@"connection has been lost"];
            break;
        case MQTTSessionManagerStateClosing:
            break;
        case MQTTSessionManagerStateConnected:
            break;
        case MQTTSessionManagerStateConnecting:
            break;
        case MQTTSessionManagerStateError:
            [self sendEventWithName:@"MQTTError"
                               body:@"connection error"];
            break;
        case MQTTSessionManagerStateStarting:
            break;
        default:
            break;
    }
}

- (void)sessionManager:(MQTTSessionManager *)sessionManager didReceiveMessage:(NSData *)data onTopic:(NSString *)topic retained:(BOOL)retained{
    NSString *mess = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    [self sendEventWithName:@"MQTTMessage" body:@{
        @"topic": topic,
        @"data": mess
    }];
}




@end
