import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';
import simicart from '@helper/simicart';

export default async (message: RemoteMessage) => {
    // handle your message
    if (message && message.data && message.data.message) {
        console.log('Background Message Received');
        console.log(JSON.stringify(message));
    
        let data = JSON.parse(message.data.message);
    
        const notification = new firebase.notifications.Notification()
            .setNotificationId(message.messageId)
            .setTitle(data.notice_title)
            .setBody(data.notice_content)
            .setData(data);
        notification
            .android.setChannelId(simicart.appID)
            .android.setSmallIcon('@drawable/ic_launcher')
            .android.setAutoCancel(true);
    
        if (data.image_url && data.image_url != null && data.image_url != '') {
            notification
                .android.setLargeIcon(data.image_url)
                .android.setBigPicture(data.image_url);
        }
    
        firebase.notifications().displayNotification(notification)
        return Promise.resolve();
    }
}