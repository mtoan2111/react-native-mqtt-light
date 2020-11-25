//
//  MQTTStrict.m
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
//

#import "MQTTStrict.h"

@implementation MQTTStrict
static BOOL internalStrict = false;

+ (BOOL)strict {
    return internalStrict;
}

+ (void)setStrict:(BOOL)strict {
    internalStrict = strict;
}

@end

