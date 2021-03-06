import React, {Component} from 'react';
import {Rating, AirbnbRating} from 'react-native-ratings';
import DefaultDoctorImage from '../component/DefaultDoctorImage';
import {
    ActivityIndicator,
    AsyncStorage,
    BackHandler,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Button,
    Body,
    Container,
    Content,
    Card,
    Header,
    Icon,
    Left,
    Right,
    Root,
    Thumbnail,
    CardItem,
} from 'native-base';
import Modal, {ModalContent, SlideAnimation} from 'react-native-modals';

const GETDOCOTRBYID = '/GetDoctorById';
const GETDOCTORRATE = '/GetDoctorRate';
export default class DetailsScreen extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        }
        this.state = {
            token: null,
            baseUrl: null,
            selectedDoctor: null,
            progressModalVisible: false,
            doctor: null,
            photoDetection: '',
            score: 0,
            count: '0',
            selectedMedicalCenter: null,
            hub: null
        };
    }

    onBackPressed() {
        this.props.navigation.goBack();
    }

    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    handleBackButtonClick() {

        console.log(JSON.stringify(this.props.navigation.state));

        if (this.props.navigation.state.isDrawerOpen) {
            this.props.navigation.closeDrawer();
        } else {
            if (!this.state.progressModalVisible) {
                this.onBackPressed();
            }
        }
        return true;
    }

    onRegionChange(region) {
        this.setState({region});
    }

    goToReserveScreen() {
        this.props.navigation.navigate('ReserveScreenFromDoctorScreen', {
            doctor: this.state.doctor,
            medicalCenter: this.state.selectedMedicalCenter,
            goBack: null,
        });
    }

    async componentWillMount(): void {
        let selectedMedicalCenter = this.props.navigation.getParam('medicalCenter');
        if (Platform.OS === 'android') {
            BackHandler.addEventListener(
                'hardwareBackPress',
                this.handleBackButtonClick,
            );
        }
        const token = await AsyncStorage.getItem('token');
        var hub = await AsyncStorage.getItem('hub');
        var baseUrl = await AsyncStorage.getItem('baseUrl');
        const doctor = this.props.navigation.getParam('doctor');
        await this.setState(
            {
                baseUrl: baseUrl,
                hub: hub,
                selectedDoctor: doctor,
                token: token,
                selectedMedicalCenter:
                    selectedMedicalCenter != null && selectedMedicalCenter !== 'undefined'
                        ? selectedMedicalCenter
                        : null,
            },
            () => {
                this.getDoctorDetails();
            },
        );
    }

    async getDoctorDetails() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        this.setState({progressModalVisible: true});
        const value = this.state.selectedDoctor;
        let body =
            {
                title: value.LastName,
                id: value.Id
            };
        let Body = {
            Method: "POST",
            Url: GETDOCOTRBYID,
            username: '',
            nationalCode: '',
            body: body
        }
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body),
        })
            .then(response => response.json())
            .then(async responseData => {
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        await this.setState({progressModalVisible: true}, () => {
                            console.log(JSON.stringify(data));
                            this.setState(
                                {
                                    doctor: data[0],
                                },
                                async () => {
                                    this.getDoctorRate()
                                },
                            );
                        });
                    }
                } else if (responseData['StatusCode'] === 401) {
                    this.setState({progressModalVisible: false}, () => {
                        this.props.navigation.navigate(
                            'GetVerificationCodeScreen',
                            {
                                user: {
                                    username: 'adrian',
                                    password: '1234',
                                    role: 'stranger',
                                },
                            },
                        );
                    });
                } else {
                    this.setState({progressModalVisible: false}, () => {
                        alert(JSON.stringify('خطا در دسترسی به سرویس'))
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async getDoctorRate() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub
        const token = this.state.token;
        const value = this.state.selectedDoctor;
        let body =
            {
                title: value.LastName,
                id: value.Id.toString()
            };

        let Body = {
            Method: "POST",
            Url: GETDOCTORRATE,
            username: '',
            nationalCode: '',
            body: body
        }
        console.log('getDoctorRate Body : \n ', Body);
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body),
        })
            .then(response => response.json())
            .then(async responseData => {
                console.log('getDoctorRate Response : \n ', responseData);
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        let score = data['Score']
                        let count = data['Count']
                        console.log(count)
                        await this.setState({progressModalVisible: false}, () => {
                            console.log(JSON.stringify(data));
                            this.setState(
                                {
                                    score: score,
                                    count: count.toString()
                                },
                                async () => {
                                    // alert(JSON.stringify(this.state.doctor))
                                },
                            );
                        });
                    }
                } else if (responseData['StatusCode'] === 401) {
                    this.setState({progressModalVisible: false}, () => {
                        this.props.navigation.navigate(
                            'GetVerificationCodeScreen',
                            {
                                user: {
                                    username: 'adrian',
                                    password: '1234',
                                    role: 'stranger',
                                },
                            },
                        );
                    });
                } else {
                    this.setState({progressModalVisible: false}, () => {
                        alert(JSON.stringify('خطا در دسترسی به سرویس'))
                        // alert(JSON.stringify(responseData));
                    });
                }
            })
            .catch(error => {
                console.log(error);
                // alert(error)
            });
    }


    render() {
        return (
            <Container>
                <Header span style={styles.header}>
                    <Left>
                        <Button
                            transparent
                            style={styles.headerMenuIcon}
                            onPress={() => this.onBackPressed()}>
                            <Icon
                                style={styles.headerMenuIcon}
                                name="arrow-back"
                                onPress={() => this.onBackPressed()}
                            />
                        </Button>
                    </Left>
                    <Right>
                        <Text style={styles.headerText}>اطلاعات بیشتر</Text>
                    </Right>
                </Header>
                <Root>
                    <Content padder style={styles.content}>
                        {Platform.OS === 'android' && (
                            <StatusBar
                                barStyle={'dark-content'}
                                backgroundColor={'#209b9b'}
                                hidden={false}
                            />
                        )}
                        <Card
                            style={{
                                padding: 5,
                                borderColor: '#23b9b9',
                                elevation: 8,
                                borderWidth: 1,
                            }}>
                            {!this.state.progressModalVisible && this.state.doctor != null && (
                                <CardItem style={{marginTop: 5}}>
                                    <Left>
                                        {this.state.doctor.Gender !== null &&
                                        this.state.doctor.Gender !== 'زن' ?
                                            <View>
                                                {(this.state.doctor.Image !== null) &&
                                                (typeof this.state.doctor.Image !== 'undefined') ?
                                                    <View>
                                                        <Thumbnail
                                                            circular
                                                            large
                                                            style={{
                                                                height: 100,
                                                                width: 100,
                                                                resizeMode: 'cover',
                                                            }}
                                                            source={{
                                                                uri:
                                                                    'data:image/png;base64, ' +
                                                                    this.state.doctor.Image
                                                            }}/>
                                                        <AirbnbRating
                                                            showRating={false}
                                                            isDisabled={true}
                                                            style={{
                                                                marginRight: 1,
                                                                marginLeft: 1,
                                                                marginTop: 10,
                                                                marginBottom: 10,
                                                            }}
                                                            starContainerStyle={{
                                                                marginTop: 10,
                                                                backgroundColor: '#fff',
                                                                paddingRight: 10,
                                                                borderRadius: 20,
                                                                borderColor: '#d9d9d9',
                                                                borderWidth: 1,
                                                                elevation: 8,
                                                                shadowColor: '#000',
                                                            }}
                                                            count={5}
                                                            defaultRating={this.state.score}
                                                            size={12}
                                                            selectedColor={
                                                                this.state.score < 2
                                                                    ? '#d11d1d'
                                                                    : this.state.score >= 3
                                                                    ? '#26c754'
                                                                    : '#209b9b'
                                                            }
                                                        />
                                                        <Text
                                                            style={{
                                                                marginTop: 1,
                                                                fontFamily: 'IRANMarker',
                                                                fontSize: 6,
                                                                color: '#8a8a8a',
                                                                textAlign: 'center',
                                                            }}>
                                                            مجموع نظرات کاربران
                                                        </Text>
                                                    </View>
                                                    :
                                                    <View>
                                                        <DefaultDoctorImage gender={'Man'} myStyle={{
                                                            height: 100,
                                                            width: 100,
                                                            resizeMode: 'cover',
                                                        }}/>
                                                        <AirbnbRating
                                                            showRating={false}
                                                            isDisabled={true}
                                                            style={{
                                                                marginRight: 1,
                                                                marginLeft: 1,
                                                                marginTop: 10,
                                                                marginBottom: 10,
                                                            }}
                                                            starContainerStyle={{
                                                                marginTop: 10,
                                                                backgroundColor: '#fff',
                                                                paddingRight: 10,
                                                                borderRadius: 20,
                                                                borderColor: '#d9d9d9',
                                                                borderWidth: 1,
                                                                elevation: 8,
                                                                shadowColor: '#000',
                                                            }}
                                                            count={5}
                                                            defaultRating={this.state.score}
                                                            size={12}
                                                            selectedColor={
                                                                this.state.score < 2
                                                                    ? '#d11d1d'
                                                                    : this.state.score >= 3
                                                                    ? '#26c754'
                                                                    : '#209b9b'
                                                            }
                                                        />
                                                        <Text
                                                            style={{
                                                                marginTop: 1,
                                                                fontFamily: 'IRANMarker',
                                                                fontSize: 6,
                                                                color: '#8a8a8a',
                                                                textAlign: 'center',
                                                            }}>
                                                            مجموع نظرات کاربران  {this.state.count}
                                                        </Text>
                                                    </View>
                                                }

                                            </View>
                                            : (this.state.doctor.Gender !== null &&
                                                this.state.doctor.Gender === 'زن') ?
                                                <View>
                                                    {(this.state.doctor.Image !== null) &&
                                                    (typeof this.state.doctor.Image !== 'undefined') ?
                                                        <View>
                                                            <Thumbnail
                                                                circular
                                                                large
                                                                style={{
                                                                    height: 100,
                                                                    width: 100,
                                                                    resizeMode: 'cover',
                                                                }}
                                                                source={{
                                                                    uri:
                                                                        'data:image/png;base64, ' +
                                                                        this.state.doctor.Image
                                                                }}/>
                                                            <AirbnbRating
                                                                showRating={false}
                                                                isDisabled={true}
                                                                style={{
                                                                    marginRight: 1,
                                                                    marginLeft: 1,
                                                                    marginTop: 10,
                                                                    marginBottom: 10,
                                                                }}
                                                                starContainerStyle={{
                                                                    marginTop: 10,
                                                                    backgroundColor: '#fff',
                                                                    paddingRight: 10,
                                                                    borderRadius: 20,
                                                                    borderColor: '#d9d9d9',
                                                                    borderWidth: 1,
                                                                    elevation: 8,
                                                                    shadowColor: '#000',
                                                                }}
                                                                count={5}
                                                                defaultRating={this.state.score}
                                                                size={12}
                                                                selectedColor={
                                                                    this.state.score < 2
                                                                        ? '#d11d1d'
                                                                        : this.state.score >= 3
                                                                        ? '#26c754'
                                                                        : '#209b9b'
                                                                }
                                                            />
                                                            <Text
                                                                style={{
                                                                    marginTop: 1,
                                                                    fontFamily: 'IRANMarker',
                                                                    fontSize: 6,
                                                                    color: '#8a8a8a',
                                                                    textAlign: 'center',
                                                                }}>
                                                                مجموع نظرات کاربران
                                                            </Text>
                                                        </View>
                                                        :
                                                        <View>
                                                            <DefaultDoctorImage gender={'Woman'} myStyle={{
                                                                height: 100,
                                                                width: 100,
                                                                resizeMode: 'cover',
                                                            }}/>
                                                            <AirbnbRating
                                                                showRating={false}
                                                                isDisabled={true}
                                                                style={{
                                                                    marginRight: 1,
                                                                    marginLeft: 1,
                                                                    marginTop: 10,
                                                                    marginBottom: 10,
                                                                }}
                                                                starContainerStyle={{
                                                                    marginTop: 10,
                                                                    backgroundColor: '#fff',
                                                                    paddingRight: 10,
                                                                    borderRadius: 20,
                                                                    borderColor: '#d9d9d9',
                                                                    borderWidth: 1,
                                                                    elevation: 8,
                                                                    shadowColor: '#000',
                                                                }}
                                                                count={5}
                                                                defaultRating={this.state.score}
                                                                size={12}
                                                                selectedColor={
                                                                    this.state.score < 2
                                                                        ? '#d11d1d'
                                                                        : this.state.score >= 3
                                                                        ? '#26c754'
                                                                        : '#209b9b'
                                                                }
                                                            />
                                                            <Text
                                                                style={{
                                                                    marginTop: 1,
                                                                    fontFamily: 'IRANMarker',
                                                                    fontSize: 6,
                                                                    color: '#8a8a8a',
                                                                    textAlign: 'center',
                                                                }}>
                                                                مجموع نظرات کاربران
                                                            </Text>
                                                        </View>
                                                    }
                                                </View> :
                                                <View>

                                                </View>
                                        }

                                        <Text
                                            style={{
                                                marginTop: 1,
                                                fontFamily: 'IRANMarker',
                                                fontSize: 8,
                                                color: '#8a8a8a',
                                                textAlign: 'center',
                                            }}>
                                            {this.state.count}
                                        </Text>

                                        <Body
                                            style={{
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                            }}>
                                            <Button
                                                bordered
                                                info
                                                style={{
                                                    padding: 2,
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                    backgroundColor: '#23b9b9',
                                                    borderColor: '#23b9b9',
                                                }}
                                                onPress={() => {
                                                    this.goToReserveScreen();
                                                }}>
                                                <Text style={{color: '#fff', fontFamily: 'IRANMarker'}}>
                                                    رزرو نوبت
                                                </Text>
                                            </Button>
                                        </Body>
                                    </Left>
                                </CardItem>
                            )}
                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 5}}>
                                    <Left>
                                        <Body
                                            style={{
                                                justifyContent: 'flex-end',
                                                alignContent: 'flex-end',
                                            }}>
                                            {this.state.doctor != null && (
                                                <Text
                                                    style={{
                                                        fontFamily: 'IRANMarker',
                                                        textAlign: 'right',
                                                        alignSelf: 'flex-end',
                                                        fontSize: 20,
                                                        color: '#000',
                                                        fontWeight: 'bold',
                                                    }}>
                                                    {this.state.doctor.FirstName != null
                                                        ? this.state.doctor.FirstName
                                                        : null}{' '}
                                                    {this.state.doctor.LastName != null
                                                        ? this.state.doctor.LastName
                                                        : null}
                                                </Text>
                                            )}
                                        </Body>
                                    </Left>
                                </CardItem>
                            )}

                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 5}}>
                                    <Left
                                        style={{
                                            justifyContent: 'flex-end',
                                            alignContent: 'flex-end',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANMarker',
                                                textAlign: 'right',
                                                alignSelf: 'flex-end',
                                                fontSize: 13,
                                                padding: 1,
                                                margin: 1,
                                                color: '#000',
                                            }}>
                                            {this.state.doctor.Description
                                                ? this.state.doctor.Description
                                                : null}
                                        </Text>
                                    </Left>
                                </CardItem>
                            )}

                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 2}}>
                                    <Body>
                                        {this.state.doctor.Age != null && (
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANMarker',
                                                    textAlign: 'right',
                                                    alignSelf: 'flex-end',
                                                    fontSize: 12,
                                                    color: '#a7a7a7',
                                                }}>
                                                {' '}
                                                سن : {this.state.doctor.Age}
                                            </Text>
                                        )}
                                    </Body>
                                </CardItem>
                            )}

                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 2}}>
                                    <Body>
                                        <Text
                                            style={{
                                                fontFamily: 'IRANMarker',
                                                textAlign: 'right',
                                                alignSelf: 'flex-end',
                                                fontSize: 12,
                                                color: '#a7a7a7',
                                            }}>
                                            {' '}
                                            جنسیت : {this.state.doctor.Gender}
                                        </Text>
                                    </Body>
                                </CardItem>
                            )}
                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 2}}>
                                    <Body>
                                        {
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANMarker',
                                                    textAlign: 'right',
                                                    alignSelf: 'flex-end',
                                                    fontSize: 12,
                                                    color: '#a7a7a7',
                                                }}>
                                                {' '}
                                                آخرین مدرک تحصیلی : {this.state.doctor.Certificate}
                                            </Text>
                                        }
                                    </Body>
                                </CardItem>
                            )}
                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 2}}>
                                    <Body style={{flexDirection: 'row-reverse'}}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANMarker',
                                                    textAlign: 'right',
                                                    fontSize: 14,
                                                    color: '#a7a7a7',
                                                    marginBottom: 1,
                                                }}>
                                                تخصص ها :{' '}
                                            </Text>

                                            {this.state.doctor.Skills.map((item, key) => (
                                                <View key={key}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'IRANMarker',
                                                            textAlign: 'right',
                                                            fontSize: 12,
                                                            margin: 1,
                                                            padding: 1,
                                                            color: '#a7a7a7',
                                                        }}>
                                                        {' '}
                                                        - {item.Title ? item.Title : null}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </Body>
                                </CardItem>
                            )}
                            {this.state.doctor != null && (
                                <CardItem style={{marginTop: 2}}>
                                    <Body style={{flexDirection: 'row-reverse'}}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontFamily: 'IRANMarker',
                                                    textAlign: 'right',
                                                    fontSize: 14,
                                                    color: '#a7a7a7',
                                                    marginBottom: 1,
                                                }}>
                                                آدرس مراکز درمانی :{' '}
                                            </Text>

                                            {this.state.doctor.MedicalCenters.map((item, key) => (
                                                <View key={key}>
                                                    <Text
                                                        style={{
                                                            fontFamily: 'IRANMarker',
                                                            textAlign: 'right',
                                                            fontSize: 12,
                                                            margin: 2,
                                                            padding: 1,
                                                            color: '#a7a7a7',
                                                        }}>
                                                        {' '}
                                                        - {item.Title ? item.Title : null} :{' '}
                                                        {item.Address ? item.Address : null}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </Body>
                                </CardItem>
                            )}
                        </Card>

                        <Modal
                            style={{opacity: 0.7}}
                            width={300}
                            visible={this.state.progressModalVisible}
                            modalAnimation={
                                new SlideAnimation({
                                    slideFrom: 'bottom',
                                })
                            }>
                            <ModalContent
                                style={[
                                    styles.modalContent,
                                    {backgroundColor: 'rgba(47,246,246,0.02)'},
                                ]}>
                                <ActivityIndicator
                                    animating={true}
                                    size="small"
                                    color={'#23b9b9'}
                                />
                            </ModalContent>
                        </Modal>
                    </Content>
                </Root>
            </Container>
        );
    }
}

DetailsScreen.navigationOptions = {
    header: null,
    title: 'اطلاعات بیشتر',
    headerStyle: {
        backgroundColor: '#23b9b9',
    },
    headerTitleStyle: {
        color: '#fff',
    },
    headerLeft: null,
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        margin: 2,
        padding: 2,
        flexDirection: 'column',
    },
    headerMenuIcon: {
        fontSize: 30,
        padding: 5,
        color: '#fff',
    },
    headerText: {
        fontFamily: 'IRANMarker',
        padding: 5,
        fontSize: 18,
        color: '#fff',
    },
    header: {
        backgroundColor: '#23b9b9',
    },
    footer: {
        backgroundColor: '#23b9b9',
    },
    viewStyle: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
        flexDirection: 'column',
    },
    row: {
        width: '100%',
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    top: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
    bottom: {
        flex: 2,
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
    },
});
