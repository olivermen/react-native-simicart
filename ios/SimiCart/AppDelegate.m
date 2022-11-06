/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <RNCPushNotificationIOS.h>
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <Firebase/Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNFirebaseLinks.h"
#import <React/RCTLinkingManager.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <GoogleMaps/GoogleMaps.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "RNSplashScreen.h"



@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [[FBSDKApplicationDelegate sharedInstance] application:application
                             didFinishLaunchingWithOptions:launchOptions];
  [FIRApp configure];
  NSURL *jsCodeLocation;
    
  [GMSServices provideAPIKey:@"AIzaSyAmBe73HHr9CU1lYU96CFg6PTwG2i6NDwU"];  

  [Fabric with:@[[Crashlytics class]]];
  // jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  // RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
  //                                                     moduleName:@"SimiCart"
  //                                              initialProperties:nil
  //                                                  launchOptions:launchOptions];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"SimiCart"
                                            initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
  
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 0];

  [[UIApplication sharedApplication] registerForRemoteNotifications];

  if (@available(iOS 13, *)) {
    self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
  }

  [RNSplashScreen show];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  BOOL handleRCT = [RCTLinkingManager application:application openURL:url options:options];
    
//    return [[RNFirebaseLinks instance] application:application openURL:url options:options] || [[Twitter sharedInstance] application:application openURL:url options:options];
  
  return [[RNFirebaseLinks instance] application:application openURL:url options:options] || [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options] || handleRCT;
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
      [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
      [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
      [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSLog(@"%@",userInfo);
  });
}
  
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

 - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
   sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    
     BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                     openURL:url
                                                           sourceApplication:sourceApplication
                                                                  annotation:annotation
                       ];
    
     BOOL handledRCT = [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
    
     return handledFB || handledRCT;
 }

@end
