/** @format */

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import bgMessaging from './src/core/base/components/notification/bgMessHandler';

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);

AppRegistry.registerComponent(appName, () => App);

YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
    'Warning: componentWillUpdate is deprecated',
    'Module RCTImageLoader requires',
]);
