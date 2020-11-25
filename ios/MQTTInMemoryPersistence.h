//
//  MQTTInMemoryPersistence.h
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
//

#import <Foundation/Foundation.h>
#import "MQTTPersistence.h"

@interface MQTTInMemoryPersistence : NSObject <MQTTPersistence>
@end

@interface MQTTInMemoryFlow : NSObject <MQTTFlow>
@end

