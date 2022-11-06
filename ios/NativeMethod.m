//
//  NativeMethod.m
//  SimiCart
//
//  Created by Glenn on 10/5/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NativeMethod.h"
#import "UIKit/UIKit.h"

@implementation NativeMethod

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openSetting)
{
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
}

RCT_EXPORT_METHOD(getDeviceID:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve([[[UIDevice currentDevice] identifierForVendor] UUIDString]);
}

RCT_EXPORT_METHOD(registerNotification)
{
  dispatch_async(dispatch_get_main_queue(), ^{

  [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
  
  
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  });
}

@end
