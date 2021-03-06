import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Linking,
    StatusBar,
    Platform,
    ActivityIndicator,
    Dimensions,
    Image,
    AsyncStorage,
    Constants
} from 'react-native';
import {Container, Header, Footer, Fab, Button, Left, Right, Icon, Text, Content} from 'native-base';
import Modal, {ModalContent, SlideAnimation} from "react-native-modals";
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps'


class MyMarker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Marker
                title={this.props.title}
                description={this.props.description}
                coordinate={this.props.coordinate}>
                <Icon type={'FontAwesome5'} name={'map-marker-alt'}
                      style={{color: '#23b9b9', fontSize: 45}}/>
            </Marker>
        );
    }
}


export default class MapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            baseUrl: null,
            token: null,
            medicalCenter: {Id: -100, Title: ''},
            title:null,
            progressModalVisible: false,
            lat: 0,
            long: 0
        }

    }

    _getLocationAsync = async () => {
        try {
            let {status} = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                this.setState({errorMessage: 'Permission to access location denied'})
            }
            let location = await Location.getCurrentPositionAsync({});
            this.setState({location})
        } catch (error) {
            let status = Location.getProviderStatusAsync();
            // if (!status.locationServicesEnabled) {
            //     Alert.alert(
            //     Alert.alert(
            //         '',
            //         'لطفا به برنامه برای دسترسی به موقعیت فعلی خود دسترسی دهید'
            //         ,
            //         [
            //             {
            //                 text: 'انصراف',
            //                 styles: 'cancel'
            //             },
            //             {text: 'تایید', onPress: () => this.openSettings()},
            //         ],
            //         {cancelable: true},
            //     );
            // }
        }

    }


    async componentWillMount(): void {
        let location = this.props.navigation.getParam('location')
        let title = this.props.navigation.getParam('title');
        await this.setState(
            {lat: location.Latitude, long: location.Longitude,title : title})

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'try on device'
            })
        } else {
        
        }
    }

    onBackPressed() {
        this.props.navigation.goBack()
    }

   

    render() {

        return (
            <Container>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent style={styles.headerMenuIcon}
                                onPress={() => this.onBackPressed()}>
                            <Icon style={styles.headerMenuIcon} name='arrow-back'
                                  onPress={() => this.onBackPressed()}/>
                        </Button>
                    </Left>
                    <Right>
                        <Text style={styles.headerText}>موقعیت مرکز درمانی</Text>
                    </Right>
                </Header>
                <Content scrollEnabled={true} style={{flex: 1, backgroundColor: '#fff'}}>
                    {Platform.OS === 'android' &&
                    <StatusBar barStyle={"dark-content"} backgroundColor={'#209b9b'}
                               hidden={false}/>
                    }

                    {Platform.OS === 'android' ? <MapView
                        provider={'google'}
                        userLocationAnnotationTitle={"موقعیت من"}
                        showsMyLocationButton={true}
                        loadingEnabled={true}
                        loadingIndicatorColor={'#23b9b9'}
                        showsUserLocation={true}
                        minZoomLevel={0}
                        style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height,
                        }}
                        initialRegion={{
                            latitude: this.state.lat,
                            longitude: this.state.long,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        <MyMarker
                            title={this.state.title}
                            coordinate={{
                                latitude: this.state.lat,
                                longitude: this.state.long,
                            }}/>

                    </MapView>: 
                    <MapView
                        userLocationAnnotationTitle={"موقعیت من"}
                        showsMyLocationButton={true}
                        loadingEnabled={true}
                        loadingIndicatorColor={'#23b9b9'}
                        showsUserLocation={true}
                        minZoomLevel={0}
                        style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height,
                        }}
                        initialRegion={{
                            latitude: this.state.lat,
                            longitude: this.state.long,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        <MyMarker
                            title={this.state.title}
                            coordinate={{
                                latitude: this.state.lat,
                                longitude: this.state.long,
                            }}/>

                    </MapView>
                    }

                    

                    <Modal style={{opacity: 0.7}}
                           width={300}
                           visible={this.state.progressModalVisible}
                           modalAnimation={new SlideAnimation({
                               slideFrom: 'bottom'
                           })}
                    >
                        <ModalContent style={[styles.modalContent, {backgroundColor: 'rgba(47,246,246,0.02)'}]}>
                            <ActivityIndicator animating={true} size="small" color={"#23b9b9"}/>
                        </ModalContent>
                    </Modal>
                </Content>
            </Container>
        );
    }

}

MapScreen.navigationOptions = {
    header: null,
    title: 'نرم افزار سلامت',
    headerStyle: {
        backgroundColor: '#23b9b9'
    },
    headerTitleStyle: {
        color: '#fff',

    },
    headerLeft: null
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

    },
    headerMenuIcon: {
        padding: 5,
        color: '#fff',
    },
    headerText: {
        padding: 5,
        fontSize: 20,
        color: '#fff',

    },
    header: {
        backgroundColor: '#23b9b9'
    },
    footer: {
        backgroundColor: '#23b9b9'
    },
    modalContent: {
        marginTop: 5,
        padding: 2,
        alignContent: 'center',
        backgroundColor: 'rgba(47,246,246,0.06)'
    }
});