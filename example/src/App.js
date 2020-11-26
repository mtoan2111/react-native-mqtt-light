import * as React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Button,
    TabBarIOS,
} from 'react-native';
import Mqtt from 'react-native-mqtt-light';

export default class App extends React.Component {
    message = [];
    isConnect = false;

    constructor(props) {
        super(props);
        this.state = {
            isUpdateView: false,
            isConnect: false,
            isSub: false,
            error: '',
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
        this.clientId = 'toan93.hust@gmail.com' + this.makeid(10);
        this.setState(
            {
                clientId: this.clientId,
            },
            () => {
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

                Mqtt.onerror = (data) => {
                    this.setState({
                        error: data,
                    });
                };

                Mqtt.initQueue({
                    uri: 'tcp://103.121.90.201',
                    clientId: this.clientId,
                    userName: 'toan93.hust@gmail.com',
                    password: 'admin',
                    cleanSession: false,
                    autoReconnect: true,
                })
                    .then((res) => {
                        this.setState({
                            isConnect: true,
                        });
                        Mqtt.subscribe('/mht/84cca847ab6e/state')
                            .then((res) => {
                                this.setState({
                                    isSub: true,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
        );
    }

    componentWillUnmount() {}

    onPublishPress = () => {
        Mqtt.publish('/mht/84cca8475a66/command', 'aaaaa')
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <View>
                {/* <Text>Test</Text> */}
                <Text>
                    isConnected: {this.state.isConnect ? 'true' : 'false'}
                </Text>
                <Text>clientId: {this.state.clientId}</Text>
                <Text>isSub: {this.state.isSub ? 'true' : 'false'}</Text>
                <Text>error: {this.state.error}</Text>
                <Button onPress={this.onPublishPress} title={'Publish'} />
                <ScrollView style={{
                    marginBottom: 120
                }}>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
