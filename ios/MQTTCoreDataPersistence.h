//
//  MQTTCoreDataPersistence.h
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "MQTTPersistence.h"

@interface MQTTCoreDataPersistence : NSObject <MQTTPersistence>

@end

@interface MQTTFlow : NSManagedObject <MQTTFlow>
@end

@interface MQTTCoreDataFlow : NSObject <MQTTFlow>
@end

