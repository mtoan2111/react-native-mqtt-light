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

    componentDidMount() {
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
            uri: 'qa-mqtt.comvpxanh.com',
            clientId: 'toan93.hust@gmail.com',
            userName: 'toan93.hust@gmail.com',
            port: 1883,
            password: 'admin',
            cleanSession: false,
            autoReconnect: true,
            tls: false,
        })
            .then((res) => {
                this.setState({
                    isConnect: true,
                });
                Mqtt.subscribe('/mht/84cca8475a67/state')
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
    }

    componentWillUnmount() {}

    onPublishPress = () => {
        Mqtt.publish('/mht/84cca8475a66/command', 'aaaaa')
            .then((res) => {})
            .catch((err) => {});
    };

    render() {
        return (
            <View style={styles.root}>
                {/* <Text>Test</Text> */}
                <Text>
                    isConnected: {this.state.isConnect ? 'true' : 'false'}
                </Text>
                <Text>isSub: {this.state.isSub ? 'true' : 'false'}</Text>
                <Text>error: {this.state.error}</Text>
                <Button onPress={this.onPublishPress} title={'Publish'} />
                <ScrollView>
                    {this.message.map((c, index) => {
                        return <Text key={index}>message: {c}</Text>;
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        paddingTop: 50,
    },
});
