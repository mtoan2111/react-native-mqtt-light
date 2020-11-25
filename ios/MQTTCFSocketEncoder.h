//
//  MQTTCFSocketEncoder.h
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, MQTTCFSocketEncoderState) {
    MQTTCFSocketEncoderStateInitializing,
    MQTTCFSocketEncoderStateReady,
    MQTTCFSocketEncoderStateError
};

@class MQTTCFSocketEncoder;

@protocol MQTTCFSocketEncoderDelegate <NSObject>

- (void)encoderDidOpen:(MQTTCFSocketEncoder *)sender;
- (void)encoder:(MQTTCFSocketEncoder *)sender didFailWithError:(NSError *)error;
- (void)encoderdidClose:(MQTTCFSocketEncoder *)sender;

@end

@interface MQTTCFSocketEncoder : NSObject <NSStreamDelegate>

@property (nonatomic) MQTTCFSocketEncoderState state;
@property (strong, nonatomic) NSError *error;
@property (strong, nonatomic) NSOutputStream *stream;
@property (weak, nonatomic ) id<MQTTCFSocketEncoderDelegate> delegate;

- (void)open;
- (void)close;
- (BOOL)send:(NSData *)data;

@end
