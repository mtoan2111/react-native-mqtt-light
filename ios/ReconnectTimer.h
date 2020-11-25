//
//  ReconnectTimer.h
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
//


#import <Foundation/Foundation.h>

@interface ReconnectTimer : NSObject

- (instancetype)initWithRetryInterval:(NSTimeInterval)retryInterval
                     maxRetryInterval:(NSTimeInterval)maxRetryInterval
                                queue:(dispatch_queue_t)queue
                       reconnectBlock:(void (^)(void))block;
- (void)schedule;
- (void)stop;
- (void)resetRetryInterval;

@end
