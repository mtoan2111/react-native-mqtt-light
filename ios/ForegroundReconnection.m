//
//  ForegroundReconnection.m
//  MqttLight
//
//  Created by Nguyễn Mạnh Toàn on 11/25/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "ForegroundReconnection.h"

#if TARGET_OS_IPHONE == 1
#import "MQTTSessionManager.h"
#import <UIKit/UIKit.h>
@interface ForegroundReconnection ()

@property (nonatomic) UIBackgroundTaskIdentifier backgroundTask;

@end

@implementation ForegroundReconnection

- (instancetype)initWithMQTTSessionManager:(MQTTSessionManager *)manager {
    self = [super init];
    self.sessionManager = manager;
    self.backgroundTask = UIBackgroundTaskInvalid;
    
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    
    [defaultCenter addObserver:self
                      selector:@selector(appWillResignActive)
                          name:UIApplicationWillResignActiveNotification
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(appDidEnterBackground)
                          name:UIApplicationDidEnterBackgroundNotification
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(appDidBecomeActive)
                          name:UIApplicationDidBecomeActiveNotification
                        object:nil];
    return self;
}

- (void)dealloc {
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter removeObserver:self name:UIApplicationWillResignActiveNotification object:nil];
    [defaultCenter removeObserver:self name:UIApplicationDidEnterBackgroundNotification object:nil];
    [defaultCenter removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
}

- (void)appWillResignActive {
    [self.sessionManager disconnectWithDisconnectHandler:nil];
}

- (void)appDidEnterBackground NS_EXTENSION_UNAVAILABLE_IOS("Use view controller based solutions where appropriate instead.") {
    if (!self.sessionManager.requiresTearDown) {
        // we don't want to tear down session as it's already closed
        return;
    }
    
    __weak typeof(self) weakSelf = self;
    self.backgroundTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
        __strong typeof(weakSelf) strongSelf = weakSelf;
        [strongSelf endBackgroundTask];
    }];
}

- (void)appDidBecomeActive {
    [self.sessionManager connectToLast:nil];
}

- (void)endBackgroundTask NS_EXTENSION_UNAVAILABLE_IOS("Use view controller based solutions where appropriate instead.") {
    if (self.backgroundTask) {
        [[UIApplication sharedApplication] endBackgroundTask:self.backgroundTask];
        self.backgroundTask = UIBackgroundTaskInvalid;
    }
}

@end

#endif

