import React, {Component} from 'react';
import {AsyncStorage, Dimentions} from 'react-native';
import {AppRegistry, StatusBar} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import SideMenu from './Menu/SideMenu';
import ReserveScreen from './screens/ReserveScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import GuidScreen from './screens/GuidScreen';
import NoticeScreen from './screens/NoticeScreen';
import MoreInfo from './screens/MoreInfo';
import SearchMedicalCenter from './screens/SearchMedicalCenter';
import ShowReservesScreen from './screens/ShowReservesScreen';
import MedicalFilesScreen from './screens/MedicalFilesScreen';
// import OldReservesScreen from './screens/OldReservesScreen';
import MessageDetailScreen from './screens/MessageDetail'
import ChatScreen from './screens/MyChatScreen';
import GetVerificationCodeScreen from './screens/GetVerificationCodeScreen';
import VerifyScreen from './screens/VerifyScreen';
import SearchDoctorScreen from './screens/SearchDoctorScreen';
import AdvanceSearchScreen from './screens/AdvanceSearchScreen';
import DetailsScreen from './screens/DetailsScreen';
import RegisterScreen from './screens/RegisterScreen';
import DetailsForMedicalCenterScreen from './screens/DetailsForMedicalCenterScreen';
import MedicalCentersResult from './screens/MedicalCentersResult';
import DoctorsResult from './screens/DoctorsResult';
import ServicePlanResult from './screens/ServicePlanResult';
import MapScreen from './screens/MapScreen';
import NationalCodeScreen from './screens/NationalCodeScreen';
import RatingScreen from './screens/RatingScreen';
import MessengerScreen from './screens/MessengerScreen'
import {I18nManager} from 'react-native';

var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const SAVENOTIFICATIONTOKEN = '/SaveNotificationToken'
const testNotifToken = '/api/SaveNotificationToken'


PushNotification.configure({
    onRegister: async function (token) {
        const userId = await AsyncStorage.getItem('userId')
        const baseUrl = await AsyncStorage.getItem('baseUrl')
        const hub = await AsyncStorage.getItem('hub')
        console.log('idddddddddddddddddddddddddddd : \n ', userId)
        console.log('baseeeeeeeeeeeeeeeeeeeeeeeeee : \n ', baseUrl)
        console.log('hubbbbbbbbbbbbbbbbbbbbbbbbbbb : \n ', hub)

        if ((userId != null && typeof userId !== 'undefined') && (baseUrl != null && typeof baseUrl !== 'undefined')
            && (hub != null && typeof hub !== 'undefined')
        ) {

            const url = baseUrl + hub
            console.log('\n URL : \n', url)
            var body = {
                UserId: userId,
                Token: token.token
            }

            let Body = {
                method: "POST",
                Url: SAVENOTIFICATIONTOKEN,
                username: '',
                nationalCode: '',
                Body: body
            }

            console.log('idddddddddddddddddddddddddddd : \n ', userId)
            console.log('baseeeeeeeeeeeeeeeeeeeeeeeeee : \n ', baseUrl)
            console.log('hubbbbbbbbbbbbbbbbbbbbbbbbbbb : \n ', hub)
            console.log('bodyyyyyyyyyyyyyyyyyyyyyyyyyy : \n ', body)
            console.log('bodyyyyyyyyyyyyyyyyyyyyyyyyyy : \n ', Body)
            fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': 'Bearer ' + "false"
                },
                body: JSON.stringify(Body)
            })
                .then(response => response.json())
                .then(responseData => {
                    console.log("SAVE NOTIFICATION RESPONSE : \n ", responseData)
                })
                .catch(error => {
                    console.error(error);
                    // alert(error)
                });

        }


        console.log("TOKEN:", token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {

        console.log("NOTIFICATION:", notification);
        //
        PushNotification.localNotification({
            /* Android Only Properties */

            id: notification.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            showWhen: true, // (optional) default: true
            autoCancel: true, // (optional) default: true
            // bigText: notification.title, // (optional) default: "message" prop
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            priority: "high", // (optional) set notification priority, default: high
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
            tag: "some_tag", // (optional) add tag to message
            group: "group", // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
            channelId: "your-custom-channel-id",


            /* iOS only properties */
            alertAction: "view", // (optional) default: view
            category: "", // (optional) default: empty string
            userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)

            /* iOS and Android properties */
            title: notification.title, // (optional)
            message: notification.message, // (required)
            sound: true,
            playSound: true, // (optional) default: true
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            repeatType: "day",
        });


        // (required) Called when a remote is received or opened, or local notification is opened
        // PushNotification.cancelAllLocalNotifications()
        notification.finish(PushNotificationIOS.FetchResult.NoData);
        PushNotification.cancelLocalNotifications({id: notification.id});
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
        console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
});


const ReserveStackNavigator = createStackNavigator(
    {
        ReserveScreen: {screen: ReserveScreen},
        ServicePlanResultScreen: {screen: ServicePlanResult},
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    },
);

const SearchDoctorNavigator = createStackNavigator(
    {
        SearchDoctorScreen: {screen: SearchDoctorScreen},
        AdvanceSearchScreen: {screen: AdvanceSearchScreen},
        DetailsScreen: {screen: DetailsScreen},
        DoctorsResultScreen: {screen: DoctorsResult},
        ReserveScreenFromDoctorScreen: {screen: ReserveScreen},
        // ReserveStack: ReserveStackNavigator,
        HomeScreen: {screen: HomeScreen},
    },
    {
        defaultNavigationOptions: {
            // gesturesEnabled: false,
            gestureEnabled: false,
            // header: null,
            headerShown: false,
        },
    },
);
const SearchMedicalCenterNavigator = createStackNavigator(
    {
        SearchMedicalCenter: {screen: SearchMedicalCenter},
        AdvanceSearchScreen: {screen: AdvanceSearchScreen},
        DetailsForMedicalCenterScreen: {screen: DetailsForMedicalCenterScreen},
        MedicalCenterResultScreen: {screen: MedicalCentersResult},
        // SearchDoctorScreen: {screen:SearchDoctorNavigator},
        SearchDoctorScreen: {screen: SearchDoctorScreen},
        ReserveScreenFromMedicalCenterScreen: {screen: ReserveScreen},
        DetailsScreenForMedicalCenterAndDoctor: {screen: DetailsScreen},
        // ReserveNavigator: ReserveStackNavigator,
        // ReserveScreen: ReserveStackNavigator,
        MapScreen: {screen: MapScreen},
    },
    {
        defaultNavigationOptions: {
            // header: null,
            // gesturesEnabled: false,
            gestureEnabled: false,
            headerShown: false,
        },
    },
);

// const SearchDoctorNavigator = createStackNavigator({
//     SearchDoctorScreen: {screen: SearchDoctorScreen},
//     AdvanceSearchScreen: {screen: AdvanceSearchScreen},
//     DetailsScreen: {screen: DetailsScreen},
//     DoctorsResultScreen: {screen: DoctorsResult},
//     ReserveScreen: ReserveStackNavigator,
// }, {
//     defaultNavigationOptions: {
//         gesturesEnabled: false,
//         header: null,
//     }
// });

const VerificationStackNavigator = createStackNavigator(
    {
        GetVerificationCodeScreen: {screen: GetVerificationCodeScreen},
        VerifyScreen: {screen: VerifyScreen},
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
        },
    },
);

// const ChatStackNavigator = createStackNavigator(
//   {
//     ChatScreen: {screen: ChatScreen},
//   },
//   {
//     defaultNavigationOptions: {
//       // header: null,
//       // gesturesEnabled: false,
//       gestureEnabled: false,
//       headerShown: false,
//     },
//   },
// );

const GuidStackNavigator = createStackNavigator(
    {
        GuideScreen: {screen: GuidScreen},
        MoreInfo: {screen: MoreInfo},
    },
    {
        defaultNavigationOptions: {
            // gesturesEnabled: false,
            gestureEnabled: false,
            headerShown: false,
        },
    },
);

const HistoryStackNavigator = createStackNavigator(
    {
        HistoryScreen: {screen: HistoryScreen},
        // InboxScreen: ChatStackNavigator,
        // InboxScreen:{screen:InboxScreen},
        // ChatScreen: {screen: ChatScreen},
        MedicalFilesScreen: {screen: MedicalFilesScreen},
        ShowReservesScreen: {screen: ShowReservesScreen},
        // OldReservesScreen: {screen: OldReservesScreen},
        Rating: RatingScreen,
    },
    {
        initialRouteName: 'HistoryScreen',
        defaultNavigationOptions: {
            // header: null,
            // gesturesEnabled: false,
            gestureEnabled: false,
            headerShown: false,
        },
    },
);

const SplashStackNavigator = createStackNavigator(
    {
        // test:{screen:MyChatScreen},
        SplashScreen: {screen: SplashScreen},
        GetVerificationCodeScreen: {screen: GetVerificationCodeScreen},
        VerifyScreen: {screen: VerifyScreen},
        RegisterScreen: {screen: RegisterScreen},
        NationalCodeScreen: {screen: NationalCodeScreen},
    },
    {
        // initialRouteName: 'test',
        initialRouteName: 'SplashScreen',
        defaultNavigationOptions: {
            // gesturesEnabled: false,
            gestureEnabled: false,
            headerShown: false,
        },
    },
);

const NavigateBetweenMapAndHome = createStackNavigator(
    {
        HomeScreen: {screen: HomeScreen},
        MapSearchDoctorScreen: SearchDoctorNavigator,
        MapSearchMedicalCenterScreen: SearchMedicalCenterNavigator,
    },
    {
        defaultNavigationOptions: {
            // header: null,
            // gesturesEnabled: false,
            gestureEnabled: false,
            headerShown: false,
        },
    },
);

const AppDrawerNavigator = createDrawerNavigator(
    {
        RegisterScreen: {screen: RegisterScreen},

        // HomeScreen: {screen: HomeScreen},
        HomeScreen: NavigateBetweenMapAndHome,
        ReserveNavigator: ReserveStackNavigator,
        // ReserveScreen: ReserveStackNavigator,
        HistoryNavigator: HistoryStackNavigator,
        ProfileScreen: {screen: ProfileScreen},
        GuideScreen: GuidStackNavigator,
        InfoScreen: {screen: NoticeScreen},
        SearchMedicalCenterScreen: SearchMedicalCenterNavigator,
        SearchDoctorNavigator: SearchDoctorNavigator,
        // SearchDoctorScreen: SearchDoctorNavigator,
        GetVerificationCodeScreen: {screen: GetVerificationCodeScreen},
        VerifyScreen: VerificationStackNavigator,
        RatingScreen: RatingScreen,
        ChatScreen: {screen: ChatScreen},
        MessengerScreen: {screen: MessengerScreen},
        MessageDetailScreen: {screen: MessageDetailScreen}
    },
    {
        // drawerWidth:'100%',
        hideStatusBar: true,
        statusBarAnimation: 'fade',
        keyboardDismissMode: 'on-drag',
        defaultNavigationOptions: {
            // gesturesEnabled: false,
            gestureEnabled: false,
            headerShown: false,
        },
        initialRouteName: 'HomeScreen',
        contentComponent: SideMenu,
        user: {username: 'empty', password: 'empty', role: 'stranger'},
        drawerPosition: 'right',
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
    },
);

const defaultGetStateForAction = AppDrawerNavigator.router.getStateForAction;

AppDrawerNavigator.router.getStateForAction = (action, state) => {
    if (
        state &&
        action.type === 'Navigation/NAVIGATE' &&
        action.routeName === 'DrawerClose'
    ) {
        StatusBar.setHidden(false);
    }

    if (
        state &&
        action.type === 'Navigation/NAVIGATE' &&
        action.routeName === 'DrawerOpen'
    ) {
        StatusBar.setHidden(true);
    }

    return defaultGetStateForAction(action, state);
};

const AppSwitchNavigator = createSwitchNavigator(
    {
        SplashItem: SplashStackNavigator,
        HomeItem: AppDrawerNavigator,
    },
    {
        initialRouteName: 'SplashItem',
        defaultNavigationOptions: {
            headerShown: false,
        },
    },
);

// const MyContainer = () => {
//     return (createAppContainer(AppSwitchNavigator))
// }
// const MyContainer = createAppContainer(AppSwitchNavigator);
export default createAppContainer(AppSwitchNavigator);

//AppRegistry.registerComponent('salamat', () => MyContainer);

// AppRegistry.registerComponent('salamat', () => App);
