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
    count = [];
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
        Mqtt.onconnect = (data) => {
            Mqtt.subscribe('/mht/84cca8475a66/state');
            this.setState({
                isConnect: true,
            });
        };

        Mqtt.oncount = (data) => {
            this.count.push(data);
            this.setState({
                isUpdateView: !this.state.isUpdateView,
            });
        };

        Mqtt.onunsubscription = (data) => {};

        Mqtt.onsubscription = (data) => {
            console.log(data);
            this.setState({
                isSub: true,
            });
        };

        Mqtt.onmessage = (data) => {
            try {
                console.log(data);
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
            uri: 'tcp://qa-mqtt.comvpxanh.com:1883',
            clientId: 'anhtuck0022@gmail.com',
            userName: 'anhtuck0022@gmail.com',
            password: '1',
            cleanSession: false,
            autoReconnect: true,
        });
    }

    componentWillUnmount() {
        console.log(1231231231);
    }

    render() {
        return (
            <View>
                {/* <Text>Test</Text> */}
                <Text>
                    isConnected: {this.state.isConnect ? 'true' : 'false'}
                </Text>
                <Text>isSub: {this.state.isSub ? 'true' : 'false'}</Text>
                <Text>error: {this.state.error}</Text>
                <ScrollView>
                    {this.count.map((c, index) => {
                        return <Text key={index}>Count: {c}</Text>;
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
