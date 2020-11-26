//
//  MQTTLog.m
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
//

#import "MQTTLog.h"

@implementation MQTTLog

#ifdef DEBUG

DDLogLevel ddLogLevel = DDLogLevelVerbose;

#else

DDLogLevel ddLogLevel = DDLogLevelWarning;

#endif

+ (void)setLogLevel:(DDLogLevel)logLevel {
    ddLogLevel = logLevel;
}

@end
