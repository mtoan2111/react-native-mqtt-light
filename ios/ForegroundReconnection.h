//
//  ForegroundReconnection.h
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
#import <Foundation/Foundation.h>

#if TARGET_OS_IPHONE == 1

@class MQTTSessionManager;

@interface ForegroundReconnection : NSObject

@property (weak, nonatomic) MQTTSessionManager *sessionManager;

- (instancetype)initWithMQTTSessionManager:(MQTTSessionManager *)manager;

@end

#endif
