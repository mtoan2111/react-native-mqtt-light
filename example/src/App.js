import * as React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Button,
    TabBarIOS,
    TextInput,
    Switch,
    Platform,
} from 'react-native';
import Mqtt from 'react-native-mqtt-light';

export default class App extends React.Component {
    message = [];

    constructor(props) {
        super(props);
        this.state = {
            isUpdateView: false,
            isConnect: false,
            isSub: false,
            error: '',
            hostValue:
                (Platform.OS === 'android' ? 'tcp://' : '') +
                'qa-mqtt.comvpxanh.com',
            clientIdValue: 'toan93.hust@gmail.com',
            randomValue: true,
            usernameValue: 'toan93.hust@gmail.com',
            passwordValue: '1',
            Status: '',
            cleanSession: false,
            subTopic: '/mht/b827ebd00917/state',
            pubTopic: '/mht/b827ebd00917/command',
            pubStatus: '',
        };
    }
    makeid = (length) => {
        var result = '';
        var characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength),
            );
        }
        return result;
    };

    componentDidMount() {
        this.isConnect = false;
        Mqtt.init();
    }

    onHostNameChange = (text) => {
        if (text) {
            this.setState({
                hostValue: text,
            });
        } else {
            this.setState({
                hostValue: '',
            });
        }
    };

    onClientIdChange = (text) => {
        if (text) {
            this.setState({
                clientIdValue: text,
            });
        } else {
            this.setState({
                clientIdValue: '',
            });
        }
    };

    onRandomCliendIdChange = (value) => {
        this.setState({
            randomValue: value,
        });
    };

    onCleanSessionChange = (value) => {
        this.setState({
            cleanSession: value,
        });
    };

    onUsernameChange = (text) => {
        if (text) {
            this.setState({
                usernameValue: text,
            });
        } else {
            this.setState({
                usernameValue: '',
            });
        }
    };

    onPasswordChange = (text) => {
        if (text) {
            this.setState({
                passwordValue: text,
            });
        } else {
            this.setState({
                passwordValue: '',
            });
        }
    };

    onSubTopicChange = (text) => {
        if (text) {
            this.setState({
                subTopic: text,
            });
        } else {
            this.setState({
                subTopic: '',
            });
        }
    };

    onPubTopicChange = (text) => {
        if (text) {
            this.setState({
                pubTopic: text,
            });
        } else {
            this.setState({
                pubTopic: '',
            });
        }
    };

    onDataChange = (text) => {
        if (text) {
            this.setState({
                data: text,
            });
        } else {
            this.setState({
                data: '',
            });
        }
    };

    onConnect = () => {
        if (this.state.randomValue) {
            this.clientId = this.state.clientIdValue + this.makeid(20);
        }

        Mqtt.onerror = (data) => {
            this.setState({
                error: data,
            });
        };

        Mqtt.initQueue({
            uri: this.state.hostValue,
            clientId: this.clientId,
            userName: this.state.usernameValue,
            password: this.state.passwordValue,
            cleanSession: this.state.cleanSession,
            autoReconnect: true,
        })
            .then((res) => {
                this.setState({
                    isConnect: true,
                    Status: 'connected to clientId: ' + this.clientId,
                    subStatus: '',
                    pubStatus: '',
                });

                Mqtt.onmessage = (data) => {
                    try {
                        this.message.push(data);
                        this.setState({
                            isUpdateView: !this.state.isUpdateView,
                        });
                    } catch (err) {
                        console.log(err);
                    }
                };
            })
            .catch((err) => {
                this.setState({
                    Status: JSON.stringify(err),
                });
            });
    };

    onSubscribe = () => {
        if (this.state.isConnect) {
            Mqtt.subscribe(this.state.subTopic)
                .then((res) => {
                    this.setState({
                        subStatus: 'subscribed to topic' + this.state.subTopic,
                    });
                })
                .catch((err) => {
                    this.setState({
                        subStatus: err,
                    });
                });
        }
    };

    onPublishPress = () => {
        try {
            // Mqtt.isConnected()
            //     .then((res) => console.log(res))
            //     .catch((err) => {
            //         console.log(err);
            //     });
            Mqtt.publish(this.state.pubTopic, this.state.data)
                .then((res) => {
                    console.log(res);
                    this.setState({
                        pubStatus: 'published to topic' + this.state.pubTopic,
                    });
                })
                .catch((err) => {
                    this.setState({
                        pubStatus: err,
                    });
                });
        } catch {}
    };

    onScroll = (event) =>
        this.setState(
            {
                horizontalScroll: event.nativeEvent.contentOffset.x,
                VerticalScroll: event.nativeEvent.contentOffset.y,
            },
            () => {
                this.autosScroll();
            },
        );

    autosScroll = () => {
        let horizontalScroll = this.state.horizontalScroll;
        let VerticalScroll = this.state.VerticalScroll;

        this.ScrollView.scrollTo({
            x: horizontalScroll,
            y: VerticalScroll,
            animated: true,
        });
    };

    render() {
        return (
            <View style={styles.root}>
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                >
                    <View style={styles.host}>
                        <Text style={styles.lable}>Host </Text>
                        <TextInput
                            placeholder={'Host name'}
                            value={this.state.hostValue}
                            onChangeText={this.onHostNameChange}
                            style={styles.text}
                        />
                    </View>
                    <View style={styles.host}>
                        <Text style={styles.lable}>ClientId </Text>
                        <TextInput
                            placeholder={'ClientId'}
                            value={this.state.clientIdValue}
                            onChangeText={this.onClientIdChange}
                            style={styles.text}
                        />
                    </View>
                    <View style={styles.host}>
                        <Text
                            style={{
                                width: '80%',
                            }}
                        >
                            Extension the clientId with the random characters ád
                            ád jasdh kjashdkj
                        </Text>
                        <Switch
                            placeholder={'ClientId'}
                            value={this.state.randomValue}
                            onValueChange={this.onRandomCliendIdChange}
                            style={styles.text}
                        />
                    </View>
                    <View style={styles.host}>
                        <Text style={styles.lable}>Username </Text>
                        <TextInput
                            placeholder={'Username'}
                            value={this.state.usernameValue}
                            onChangeText={this.onUsernameChange}
                            style={styles.text}
                        />
                    </View>
                    <View style={styles.host}>
                        <Text style={styles.lable}>Password </Text>
                        <TextInput
                            secureTextEntry={true}
                            placeholder={'Password'}
                            value={this.state.passwordValue}
                            onChangeText={this.onPasswordChange}
                            style={styles.text}
                        />
                    </View>
                    <View style={styles.host}>
                        <Text>Clean session </Text>
                        <Switch
                            placeholder={'ClientId'}
                            value={this.state.cleanSession}
                            onValueChange={this.onCleanSessionChange}
                            style={styles.text}
                        />
                    </View>
                    <Text style={styles.status}>
                        Status: {this.state.Status}
                    </Text>
                    <Button
                        onPress={this.onConnect}
                        style={styles.buttons}
                        title={'Connect to broker'}
                    />
                    <View style={styles.hostx}>
                        <Text style={styles.lablex}>Subscription topic </Text>
                        <TextInput
                            placeholder={'topic'}
                            value={this.state.subTopic}
                            onChangeText={this.onSubTopicChange}
                            style={styles.text}
                        />
                    </View>
                    <Text style={styles.status}>
                        Status: {this.state.subStatus}
                    </Text>
                    <Button
                        disabled={!this.state.isConnect}
                        onPress={this.onSubscribe}
                        style={styles.buttons}
                        title={'Subscribe to topic'}
                    />
                    <View style={styles.scrool}>
                        <ScrollView
                            style={{
                                backgroundColor: '#efefef',
                                flex: 1,
                                height: 480,
                            }}
                            showsVerticalScrollIndicator={false}
                            ref={(ref) => (this.ScrollView = ref)}
                            // onScroll={this.onScroll}
                        >
                            {this.message.map((c, index) => {
                                return (
                                    <View key={index}>
                                        <Text>topic: {c.topic}</Text>
                                        <Text>message: {c.data}</Text>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                    <View style={styles.host}>
                        <Text style={styles.lablex}>Publish topic </Text>
                        <TextInput
                            placeholder={'topic'}
                            value={this.state.pubTopic}
                            onChangeText={this.onPubTopicChange}
                            style={styles.text}
                        />
                    </View>
                    <View style={styles.host}>
                        <Text style={styles.lablex}>data </Text>
                        <TextInput
                            placeholder={'data to publish'}
                            value={this.state.data}
                            onChangeText={this.onDataChange}
                            style={styles.text}
                        />
                    </View>
                    <Text style={styles.status}>
                        Status: {this.state.pubStatus}
                    </Text>
                    <Button
                        // disabled={!this.state.isConnect}
                        onPress={this.onPublishPress}
                        style={styles.buttons}
                        title={'Publish into topic'}
                    />
                </ScrollView>
                {/* <Text>Test</Text> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 10,
        paddingTop: 30,
        paddingBottom: 15,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },

    host: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
    },
    lable: {
        width: 80,
    },
    lablex: {
        width: 130,
    },
    hostx: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    text: {
        borderBottomWidth: 1,
        borderBottomColor: 'red',
        lineHeight: 20,
        padding: 0,
        height: 30,
        flex: 1,
    },
    scrool: {
        marginTop: 10,
        flex: 1,
    },
    buttons: {
        marginVertical: 5,
    },
    status: {
        color: 'red',
        paddingBottom: 10,
    },
});
