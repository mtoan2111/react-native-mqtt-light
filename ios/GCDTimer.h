//
//  GCDTimer.h
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface GCDTimer: NSObject

+ (GCDTimer *)scheduledTimerWithTimeInterval:(NSTimeInterval)interval
                                     repeats:(BOOL)repeats
                                       queue:(dispatch_queue_t)queue
                                       block:(void (^)(void))block;
- (void)invalidate;

@end

