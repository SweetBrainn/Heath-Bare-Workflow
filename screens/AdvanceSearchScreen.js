import React, {Component} from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    BackHandler,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    PermissionsAndroid,
} from 'react-native';
import {
    ActionSheet,
    Button,
    Card,
    Body,
    Container,
    Content,
    Header,
    Icon,
    Left,
    Right,
    Root,
    CardItem,
    CheckBox,
    Footer,
    Toast,
} from 'native-base';
import Modal, {ModalContent, SlideAnimation} from 'react-native-modals';
import Geolocation from '@react-native-community/geolocation';

const GETSERVICES = '/GetServices';
const GETFACILITIES = '/GetFacilities';
const GETSERVICEDETAILS = '/GetServiceDetails';
const GETGENDERS = '/GetGenders';
const GETSKILLS = '/GetSkills';
const GETCERTIFICATES = '/GetCertificates';
const MEDICALCENTERADVANCESEARCH = '/MedicalCenterAdvanceSearch';
const DOCTORADVANCESEARCH = '/DoctorAdvanceSearch';
const CANCEL_TEXT = 'انصراف';
const DOCTOROFSPECIFICMEDICALCENTERADVANCESEARCH =
    '/DoctorOfSpecificMedicalCenterAdvanceSearch';

export default class AdvanceSearchScreen extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        }
        this.state = {
            progressModalVisible: false,
            token: null,
            baseUrl: null,
            checkAddress: false,
            selectedState: {id: -100, value: 'انتخاب منطقه'},
            selectedService: {id: -100, value: ' انتخاب سرویس'},
            selectedKind: {id: -100, value: 'انتخاب نوع مرکز'},
            selectedServiceDetail: {id: -100, value: ' انتخاب زیرخدمت'},
            selectedFacility: {id: -100, value: 'انتخاب بخش'},
            selectedSkill: {id: -100, value: ' انتخاب تخصص'},
            selectedGender: {id: -100, value: ' انتخاب جنسیت'},
            selectedCertificate: {id: -100, value: ' انتخاب سطح علمی'},
            states: [
                {id: 0, value: '1'},
                {id: 1, value: '2'},
                {id: 2, value: '3'},
                {id: 3, value: '4'},
                {id: 4, value: '5'},
                {id: 5, value: '6'},
                {id: 6, value: '7'},
                {id: 7, value: '8'},
                {id: 8, value: '9'},
                {id: 9, value: '10'},
                {id: 10, value: '11'},
                {id: 11, value: '12'},
                {id: 12, value: '13'},
                {id: 13, value: '14'},
                {id: 14, value: '15'},
                {id: 15, value: '16'},
                {id: 16, value: '17'},
                {id: 17, value: '18'},
                {id: 18, value: '19'},
                {id: 19, value: '20'},
                {id: 20, value: '21'},
                {id: 21, value: '22'},
            ],
            kinds: [
                {id: 0, value: 'هر دو'},
                {id: 1, value: 'درمانگاه شهرداری'},
                {id: 2, value: 'درمانگاه طرف قرارداد شهرداری'},
            ],
            services: null,
            facilities: null,
            skills: [
                {id: 0, value: 'دندانپزشک'},
                {id: 1, value: 'چشم پزشک'},
                {id: 2, value: 'فیزیوتراپ'},
                {id: 3, value: 'روانپزشک'},
                {id: 4, value: 'جراح فک و دندان'},
                {id: 5, value: 'پزشک داخلی'},
            ],
            genders: null,
            certificates: [
                {id: 0, value: 'تخصص'},
                {id: 1, value: 'فوق تخصص'},
                {id: 2, value: 'عمومی'},
                {id: 3, value: 'هر سه'},
            ],
            serviceDetails: null,
            medicalCenterResult: null,
            location: null,
            hub: null
        };
    }

    checkLocationPermission = async () => {
        try {
            const permission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                this.getCurrentLocation();
                return;
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Salamat App Camera Permission',
                        message: 'Salamat App needs access to your Location ',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getCurrentLocation();
                    return;
                } else {
                    return;
                }
            }
        } catch (e) {
            console.log(e);
            return;
        }
    };

    showToast() {
        Toast.show({
            text: 'برنامه به موقعیت جغرافیایی دسترسی ندارد',
            textStyle: {
                fontFamily: 'IRANMarker',
                fontSize: 10,
            },
            duration: 4000,
            type: 'danger',
            position: 'bottom',
        });
    }

    getCurrentLocation() {
        try {
            Geolocation.getCurrentPosition(
                position => {
                    let lat = position.coords.latitude;
                    let long = position.coords.longitude;
                    let location = {
                        latitude: lat,
                        longitude: long,
                    };
                    this.setState({location: location, checkAddress: true});
                },
                e => {
                    // console.log(JSON.stringify);
                    this.showToast();
                },
            );
        } catch (e) {
            console.log(e);
        }
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

    getOptions(array) {
        let options = [];
        for (let item of array) {
            options.push(item.value);
        }
        options.push(CANCEL_TEXT);
        return options;
    }

    getObject(array, title) {
        let obj = {id: 0, value: title};
        for (let item of array) {
            if (item.value === title) {
                obj.id = item.id;
            }
            break;
        }
        return obj;
    }

    getCancelButtonIndex(array) {
        return array.indexOf(CANCEL_TEXT);
    }

    onBackPressed() {
        if (this.props.navigation.getParam('doctor')) {
            this.props.navigation.navigate('SearchDoctorScreen', {
                medicalCenter: this.props.navigation.getParam('medicalCenter'),
            });
        } else {
            this.props.navigation.goBack();
        }
    }

    async componentWillMount(): void {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener(
                'hardwareBackPress',
                this.handleBackButtonClick,
            );
        }
        var hub = await AsyncStorage.getItem('hub');
        var baseUrl = await AsyncStorage.getItem('baseUrl');
        var token = await AsyncStorage.getItem('token');
        this.setState({baseUrl: baseUrl, hub: hub, token: token}, () => {
            if (this.props.navigation.getParam('doctor')) {
                this.getGenders();
            } else {
                this.getServices();
            }
        });
    }

    async doctorAdvanceSearch(gender, skill, certificate) {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        if (gender.id === -100 && skill.id === -100 && certificate.id === -100) {
            alert('لطفا فیلد ها را انتخاب کنید');
        } else {
            if (this.state.medicalCenter != null) {
                await this.setState({progressModalVisible: true});
                let Body = {
                    Method: "POST",
                    Url: DOCTOROFSPECIFICMEDICALCENTERADVANCESEARCH,
                    username: '',
                    nationalCode: '',
                    body: {
                        Skill: skill.value,
                        Gender: gender.id === -200 ? null : gender.value,
                        Certificate: certificate.value,
                        medicalCenter: this.state.medicalCenter,

                    }
                }
                await fetch(
                    baseUrl + hub,
                    {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            Accept: 'application/json',
                            'Authorization': 'Bearer ' + new String(token)
                        },
                        body: JSON.stringify(Body),
                    },
                )
                    .then(response => response.json())
                    .then(async responseData => {
                        if (responseData['StatusCode'] === 200) {
                            if (responseData['Data'] != null) {
                                let data = responseData['Data'];
                                if (data.length > 0) {
                                    this.setState({progressModalVisible: false}, () => {
                                        this.setState({medicalCenterResult: data}, () => {
                                            this.props.navigation.navigate('DoctorsResultScreen', {
                                                result: data,
                                                Gender: gender.id === -200 ? 'مرد یا زن' : gender.value,
                                                Certificate: certificate.value,
                                                Skill: skill.value,
                                                MedicalCenter: this.state.medicalCenter.Title,
                                            });
                                        });
                                    });
                                } else {
                                    this.setState({progressModalVisible: false}, () => {
                                        alert('موردی یافت نشد');
                                    });
                                }
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
                                alert(JSON.stringify('خطا در دسترسی به سرویس'));
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                await this.setState({progressModalVisible: true});
                let Body = {
                    Method: "POST",
                    Url: DOCTORADVANCESEARCH,
                    username: '',
                    nationalCode: '',
                    body: {
                        Skill: skill.value,
                        Gender: gender.id === -200 ? null : gender.value,
                        Certificate: certificate.value,
                        medicalCenter: null,
                    }
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
                                if (data.length > 0) {
                                    this.setState({progressModalVisible: false}, () => {
                                        this.setState({medicalCenterResult: data}, () => {
                                            this.props.navigation.navigate('DoctorsResultScreen', {
                                                result: data,
                                                Gender: gender.id === -200 ? 'مرد یا زن' : gender.value,
                                                Certificate: certificate.value,
                                                Skill: skill.value,
                                            });
                                        });
                                    });
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
                                        alert('موردی یافت نشد');
                                    });
                                }
                            }
                        } else {
                            this.setState({progressModalVisible: false}, () => {
                                alert(JSON.stringify('خطا در دسترسی به سرویس'));
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }

    async getServices() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        let Body = {
            Method: "GET",
            Url: GETSERVICES,
            username: '',
            nationalCode: '',
            body: null
        }
        await this.setState({progressModalVisible: true});
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body)
        })
            .then(response => response.json())
            .then(async responseData => {
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        this.setState({progressModalVisible: false}, async () => {
                            await this.setState({services: data});
                            await this.getFacilities();
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
                        alert('خطا در اتصال به سرویس');
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async getFacilities() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        let Body = {
            Method: "GET",
            Url: GETFACILITIES,
            username: '',
            nationalCode: '',
            body: null
        }
        await this.setState({progressModalVisible: true});
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body)
        })
            .then(response => response.json())
            .then(async responseData => {
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        this.setState({progressModalVisible: false}, async () => {
                            await this.setState({facilities: data});
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
                        alert('خطا در اتصال به سرویس');
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async getGenders() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        let Body = {
            Method: "GET",
            Url: GETGENDERS,
            username: '',
            nationalCode: '',
            body: null
        }
        await this.setState({progressModalVisible: true});
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body)
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        this.setState({progressModalVisible: false}, () => {
                            data.push({id: -200, value: 'هردو'});
                            this.setState({genders: data});
                            this.getSkills();
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
                        alert('خطا در اتصال به سرویس');
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async getSkills() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        let Body = {
            Method: "GET",
            Url: GETSKILLS,
            username: '',
            nationalCode: '',
            body: null
        }
        await this.setState({progressModalVisible: true});
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body)
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        this.setState({progressModalVisible: false}, () => {
                            this.setState({skills: data});
                            this.getCertificates();
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
                        alert('خطا در اتصال به سرویس');
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async getCertificates() {
        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        let Body = {
            Method: "GET",
            Url: GETCERTIFICATES,
            username: '',
            nationalCode: '',
            body: null
        }
        await this.setState({progressModalVisible: true});
        await fetch(baseUrl + hub, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + new String(token)
            },
            body: JSON.stringify(Body)
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData['StatusCode'] === 200) {
                    if (responseData['Data'] != null) {
                        let data = responseData['Data'];
                        this.setState({progressModalVisible: false}, () => {
                            this.setState({certificates: data});
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
                        alert('خطا در اتصال به سرویس');
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async medicalCenterAdvanceSearch(
        state,
        facility,
        kind,
        service,
        serviceDetail,
        location,
    ) {

        const baseUrl = this.state.baseUrl;
        const hub = this.state.hub;
        const token = this.state.token;
        if (facility.id === -100 || kind.id === -100 || service.id === -100) {
            alert('لطفا فیلد ها را انتخاب کنید');
        } else {
            var body = {
                IsContract: kind.id === 0 ? null : kind.id === 1 ? false : true,
                Service: service.value,
                ServiceDetails:
                    serviceDetail.id === -100 ? null : serviceDetail.value,
                // State: await state.value,
                Facility: facility.value,
                Latitude: location != null ? location.latitude : null,
                Longitude: location != null ? location.longitude : null,
            };
            let Body = {
                Method: "POST",
                Url: MEDICALCENTERADVANCESEARCH,
                username: '',
                nationalCode: '',
                body: body
            }
            await this.setState({progressModalVisible: true});
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
                            if (data.length > 0) {
                                this.setState({progressModalVisible: false}, () => {
                                    this.setState({medicalCenterResult: data}, () => {
                                        this.props.navigation.navigate(
                                            'MedicalCenterResultScreen',
                                            {
                                                result: data,
                                                IsContract:
                                                    kind.id === 0
                                                        ? 'طرف قرارداد یا آزاد'
                                                        : kind.id === 1
                                                        ? 'آزاد'
                                                        : 'طرف قرارداد',
                                                Service: service.value,
                                                ServiceDetails:
                                                    serviceDetail.id === -100
                                                        ? null
                                                        : serviceDetail.value,
                                                // State: await state.value,
                                                Facility: facility.value,
                                            },
                                        );
                                    });
                                });
                            } else {
                                this.setState({progressModalVisible: false}, () => {
                                    alert('موردی یافت نشد');
                                });
                            }
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
                            alert(JSON.stringify('خطا در دسترسی به سرویس'));
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    CheckBoxHandler() {
        let checkAddress = this.state.checkAddress;
        if (!checkAddress) {
            this.getCurrentLocation();
        } else {
            this.setState({checkAddress: !checkAddress});
        }
    }

    render() {
        if (this.props.navigation.getParam('doctor')) {
            return (
                <Container>
                    <Header style={styles.header}>
                        <Left style={{flex: 1}}>
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
                        <Right style={{flex: 5}}>
                            <Text
                                style={[
                                    styles.headerText,
                                    {
                                        fontSize:
                                            this.props.navigation.getParam('medicalCenter') !== null
                                                ? this.props.navigation.getParam('headerFontSize')
                                                : 20,
                                    },
                                ]}>
                                {this.props.navigation.getParam('medicalCenter') != null
                                    ? 'جستجو در ' +
                                    this.props.navigation.getParam('medicalCenter').Title
                                    : 'جستجوی پیشرفته '}
                            </Text>
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
                            {/*skill*/}
                            {this.state.skills != null && (
                                <CardItem bordered>
                                    <Body style={styles.row}>
                                        <Button
                                            onPress={() => {
                                                ActionSheet.show(
                                                    {
                                                        options: this.getOptions(this.state.skills),
                                                        cancelButtonIndex: this.getCancelButtonIndex(
                                                            this.getOptions(this.state.skills),
                                                        ),
                                                        title: 'انتخاب تخصص',
                                                    },
                                                    buttonIndex => {
                                                        if (buttonIndex <= this.state.skills.length - 1)
                                                            this.setState({
                                                                selectedSkill: this.state.skills[buttonIndex],
                                                            });
                                                    },
                                                );
                                            }}
                                            bordered
                                            style={styles.buttonStyle}>
                                            <Text style={styles.filters}>
                                                {this.state.selectedSkill.value}
                                            </Text>
                                        </Button>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                            }}>
                                            <Text style={styles.label}>تخصص</Text>
                                        </View>
                                    </Body>
                                </CardItem>
                            )}
                            {/*gender*/}
                            {this.state.genders != null && (
                                <CardItem bordered>
                                    <Body style={styles.row}>
                                        <Button
                                            onPress={() => {
                                                ActionSheet.show(
                                                    {
                                                        options: this.getOptions(this.state.genders),
                                                        cancelButtonIndex: this.getCancelButtonIndex(
                                                            this.getOptions(this.state.genders),
                                                        ),
                                                        title: 'انتخاب جنسیت',
                                                    },
                                                    buttonIndex => {
                                                        if (buttonIndex <= this.state.genders.length - 1)
                                                            this.setState({
                                                                selectedGender: this.state.genders[buttonIndex],
                                                            });
                                                    },
                                                );
                                            }}
                                            bordered
                                            style={styles.buttonStyle}>
                                            <Text style={styles.filters}>
                                                {this.state.selectedGender.value}
                                            </Text>
                                        </Button>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                            }}>
                                            <Text style={styles.label}>جنسیت</Text>
                                        </View>
                                    </Body>
                                </CardItem>
                            )}
                            {/*certificate*/}
                            {this.state.certificates != null && (
                                <CardItem bordered>
                                    <Body style={styles.row}>
                                        <Button
                                            bordered
                                            style={styles.buttonStyle}
                                            onPress={() =>
                                                ActionSheet.show(
                                                    {
                                                        options: this.getOptions(this.state.certificates),
                                                        cancelButtonIndex: this.getCancelButtonIndex(
                                                            this.getOptions(this.state.certificates),
                                                        ),
                                                        title: 'انتخاب سطح علمی',
                                                    },
                                                    buttonIndex => {
                                                        if (
                                                            buttonIndex <=
                                                            this.state.certificates.length - 1
                                                        )
                                                            this.setState({
                                                                selectedCertificate: this.state.certificates[
                                                                    buttonIndex
                                                                    ],
                                                            });
                                                    },
                                                )
                                            }>
                                            <Text style={styles.filters}>
                                                {this.state.selectedCertificate.value}
                                            </Text>
                                        </Button>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'left'}]}>
                                                سطح علمی
                                            </Text>
                                        </View>
                                    </Body>
                                </CardItem>
                            )}
                            <Modal
                                style={{opacity: 0.7}}
                                width={300}
                                visible={this.state.progressModalVisible}
                                modalAnimation={
                                    new SlideAnimation({
                                        slideFrom: 'bottom',
                                    })
                                }>
                                <ModalContent style={styles.modalContent}>
                                    <ActivityIndicator
                                        animating={true}
                                        size="small"
                                        color={'#23b9b9'}
                                    />
                                </ModalContent>
                            </Modal>
                        </Content>
                        <Footer style={{backgroundColor: '#fff'}}>
                            <Button
                                style={{
                                    backgroundColor: '#23b9b9',
                                    alignSelf: 'center',
                                    width: '80%',
                                    marginRight: 10,
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.doctorAdvanceSearch(
                                        this.state.selectedGender,
                                        this.state.selectedSkill,
                                        this.state.selectedCertificate,
                                    );
                                }}>
                                <Text
                                    style={{
                                        color: '#fff',
                                        textAlign: 'center',
                                        fontSize: 15,
                                        fontFamily: 'IRANMarker',
                                    }}>
                                    جستجو
                                </Text>
                            </Button>
                        </Footer>
                    </Root>
                </Container>
            );
        } else if (this.props.navigation.getParam('medicalCenter')) {
            return (
                <Container>
                    <Header style={styles.header}>
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
                            <Text style={styles.headerText}>جستجوی پیشرفته</Text>
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
                            <Card>
                                {/*kinds*/}
                                <CardItem>
                                    <Body style={styles.row}>
                                        <Button
                                            onPress={() => {
                                                ActionSheet.show(
                                                    {
                                                        options: this.getOptions(this.state.kinds),
                                                        cancelButtonIndex: this.getCancelButtonIndex(
                                                            this.getOptions(this.state.kinds),
                                                        ),
                                                        title: 'انتخاب نوع مرکز',
                                                    },
                                                    buttonIndex => {
                                                        if (buttonIndex <= this.state.kinds.length - 1)
                                                            this.setState({
                                                                selectedKind: this.state.kinds[buttonIndex],
                                                            });
                                                    },
                                                );
                                            }}
                                            bordered
                                            style={styles.buttonStyle}>
                                            <Text style={styles.filters}>
                                                {this.state.selectedKind.value}
                                            </Text>
                                        </Button>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                            }}>
                                            <Text style={styles.label}>نوع مرکز</Text>
                                        </View>
                                    </Body>
                                </CardItem>
                                {this.state.facilities != null && (
                                    <CardItem bordered>
                                        <Body style={styles.row}>
                                            <Button
                                                onPress={() => {
                                                    ActionSheet.show(
                                                        {
                                                            options: this.getOptions(this.state.facilities),
                                                            cancelButtonIndex: this.getCancelButtonIndex(
                                                                this.getOptions(this.state.facilities),
                                                            ),
                                                            title: 'انتخاب بخش',
                                                        },
                                                        buttonIndex => {
                                                            if (
                                                                buttonIndex <=
                                                                this.state.facilities.length - 1
                                                            )
                                                                this.setState({
                                                                    selectedFacility: this.state.facilities[
                                                                        buttonIndex
                                                                        ],
                                                                });
                                                        },
                                                    );
                                                }}
                                                bordered
                                                style={styles.buttonStyle}>
                                                <Text style={styles.filters}>
                                                    {this.state.selectedFacility.value}
                                                </Text>
                                            </Button>
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                }}>
                                                <Text style={styles.label}>بخش </Text>
                                            </View>
                                        </Body>
                                    </CardItem>
                                )}
                                {/*states*/}
                                {/* <CardItem bordered>
                                    <Body style={styles.row}>
                                        <Button
                                            onPress={() => {
                                                ActionSheet.show(
                                                    {
                                                        options: this.getOptions(this.state.states),
                                                        cancelButtonIndex: this.getCancelButtonIndex(
                                                            this.getOptions(this.state.states)),
                                                        title: "انتخاب منطقه"
                                                    },
                                                    buttonIndex => {
                                                        if (buttonIndex <= this.state.states.length - 1)
                                                            this.setState(
                                                                {selectedState: this.state.states[buttonIndex]});
                                                    }
                                                )
                                            }}
                                            bordered style={styles.buttonStyle}>
                                            <Text style={styles.filters}>{this.state.selectedState.value}</Text>
                                        </Button>
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignContent: 'center'
                                        }}>
                                            <Text style={styles.label}
                                            >منطقه</Text>
                                        </View>
                                    </Body>
                                </CardItem> */}
                                {/*services*/}
                                {this.state.services != null && (
                                    <CardItem>
                                        <Body style={styles.row}>
                                            <Button
                                                onPress={() => {
                                                    ActionSheet.show(
                                                        {
                                                            options: this.getOptions(this.state.services),
                                                            cancelButtonIndex: this.getCancelButtonIndex(
                                                                this.getOptions(this.state.services),
                                                            ),
                                                            title: 'انتخاب سرویس',
                                                        },
                                                        buttonIndex => {
                                                            if (buttonIndex <= this.state.services.length - 1)
                                                                this.setState({
                                                                    selectedService: this.state.services[
                                                                        buttonIndex
                                                                        ],
                                                                    serviceDetails: this.state.services[
                                                                        buttonIndex
                                                                        ].serviceDetails,
                                                                    selectedServiceDetail: {
                                                                        id: -100,
                                                                        value: ' انتخاب زیرخدمت',
                                                                    },
                                                                });
                                                        },
                                                    );
                                                }}
                                                bordered
                                                style={styles.buttonStyle}>
                                                <Text style={styles.filters}>
                                                    {this.state.selectedService.value}
                                                </Text>
                                            </Button>
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                }}>
                                                <Text style={styles.label}>سرویس</Text>
                                            </View>
                                        </Body>
                                    </CardItem>
                                )}
                                {/*serviceDetails*/}
                                {this.state.selectedService.id != -100 &&
                                this.state.serviceDetails.length > 0 && (
                                    <CardItem bordered>
                                        {this.state.serviceDetails != null && (
                                            <Body style={styles.row}>
                                                <Button
                                                    onPress={() => {
                                                        ActionSheet.show(
                                                            {
                                                                options: this.getOptions(
                                                                    this.state.serviceDetails,
                                                                ),
                                                                cancelButtonIndex: this.getCancelButtonIndex(
                                                                    this.getOptions(this.state.serviceDetails),
                                                                ),
                                                                title: 'انتخاب زیر قدمت',
                                                            },
                                                            buttonIndex => {
                                                                if (
                                                                    buttonIndex <=
                                                                    this.state.serviceDetails.length - 1
                                                                )
                                                                    this.setState({
                                                                        selectedServiceDetail: this.state
                                                                            .serviceDetails[buttonIndex],
                                                                    });
                                                            },
                                                        );
                                                    }}
                                                    bordered
                                                    style={styles.buttonStyle}>
                                                    <Text style={styles.filters}>
                                                        {this.state.selectedServiceDetail.value}
                                                    </Text>
                                                </Button>
                                                <View
                                                    style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        alignContent: 'center',
                                                    }}>
                                                    <Text style={styles.label}>زیر خدمت</Text>
                                                </View>
                                            </Body>
                                        )}
                                    </CardItem>
                                )}
                                {/*facilities*/}

                                {/*location*/}
                                <CardItem bordered>
                                    <Left>
                                        <CheckBox
                                            color={'#23b9b9'}
                                            checked={this.state.checkAddress}
                                            onPress={() => {
                                                this.CheckBoxHandler();
                                            }}
                                        />
                                    </Left>
                                    <Body style={styles.row}>
                                        <Text
                                            style={styles.locationText}
                                            onPress={() => {
                                                this.CheckBoxHandler();
                                            }}>
                                            نزدیک به من
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                        <Modal
                            style={{opacity: 0.7}}
                            width={300}
                            visible={this.state.progressModalVisible}
                            modalAnimation={
                                new SlideAnimation({
                                    slideFrom: 'bottom',
                                })
                            }>
                            <ModalContent style={styles.modalContent}>
                                <ActivityIndicator
                                    animating={true}
                                    size="small"
                                    color={'#23b9b9'}
                                />
                            </ModalContent>
                        </Modal>
                        <Footer style={{backgroundColor: '#fff'}}>
                            <Button
                                style={{
                                    backgroundColor: '#23b9b9',
                                    alignSelf: 'center',
                                    width: '80%',
                                    marginRight: 10,
                                    marginLeft: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.medicalCenterAdvanceSearch(
                                        this.state.selectedState,
                                        this.state.selectedFacility,
                                        this.state.selectedKind,
                                        this.state.selectedService,
                                        this.state.selectedServiceDetail,
                                        this.state.location,
                                    );
                                }}>
                                <Text
                                    style={{
                                        color: '#fff',
                                        textAlign: 'center',
                                        fontSize: 15,
                                        fontFamily: 'IRANMarker',
                                    }}>
                                    جستجو
                                </Text>
                            </Button>
                        </Footer>
                    </Root>
                </Container>
            );
        }
    }
}

AdvanceSearchScreen.navigationOptions = {
    header: null,
    title: 'جستجوی پیشرفته',
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
        backgroundColor: '#fff',
        borderColor: '#23b9b9',
        borderWidth: 1,
        margin: 2,
        padding: 2,
        flexDirection: 'column',
    },
    headerMenuIcon: {
        padding: 5,
        fontSize: 30,
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
        flex: 1,
        padding: 3,
        margin: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalContent: {
        marginTop: 5,
        padding: 2,
        alignContent: 'center',
        backgroundColor: 'rgba(47,246,246,0.02)',
    },
    filters: {
        fontFamily: 'IRANMarker',
        padding: 1,
        textAlign: 'center',
        borderRadius: 2,
        flex: 2,
        fontSize: 13,
        color: '#23b9b9',
        borderWidth: 1,
        borderColor: '#23b9b9',
    },
    label: {
        color: '#000',
        fontFamily: 'IRANMarker',
        padding: 1,
        textAlign: 'right',
        marginTop: 10,
        marginRight: 2,
        marginLeft: 2,
        alignSelf: 'center',
        fontSize: 16,
    },
    searchButton: {
        fontFamily: 'IRANMarker',
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
    },
    locationText: {
        fontFamily: 'IRANMarker',
        padding: 1,
        textAlign: 'right',
        flex: 1,
        fontSize: 13,
        color: '#23b9b9',
    },
    buttonStyle: {
        minWidth: '65%',
        maxWidth: '70%',
        // width: '70%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        margin: 1,
        borderWidth: 1,
        borderColor: '#fff',
    },
});
