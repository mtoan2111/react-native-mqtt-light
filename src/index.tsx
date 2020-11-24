import { NativeModules, NativeEventEmitter } from 'react-native';

class Mqtt {
    Mqtt: any;
    nativeEvent: NativeEventEmitter;
    onmessage: any;
    onerror: any;

    constructor() {
        try {
            this.Mqtt = NativeModules.Mqtt;
            this.nativeEvent = new NativeEventEmitter(this.Mqtt);
            this.initListener();
        } catch (err) {
            this.nativeEvent = new NativeEventEmitter(null);
        }
    }

    initListener = () => {
        try {
            this.nativeEvent.addListener('message', (data) => {
                try {
                    typeof this.onmessage === 'function' &&
                        this.onmessage(data);
                } catch (err) {
                    this.sendError('MQTT/initListener/message: err => ' + err);
                }
            });
            this.nativeEvent.addListener('error', (data) => {
                try {
                    this.sendError(
                        'MQTT/initListener/error: err => ' + data.message,
                    );
                } catch (err) {
                    this.sendError('MQTT/initListener/error: err => ' + err);
                }
            });
        } catch (err) {
            this.sendError('MQTT/initQueue: err => ' + err);
        }
    };

    initQueue = (options = {}) => {
        try {
            return this.Mqtt.initQueue(options);
        } catch (err) {
            this.sendError('MQTT/initQueue: err => ' + err);
        }
    };

    subscribe = (topic = '') => {
        try {
            return this.Mqtt.subscribe(topic);
        } catch (err) {
            this.sendError('MQTT/subscribe: err => ' + err);
        }
    };

    publish = (topic = '', message = '') => {
        try {
            return this.Mqtt.publish(topic, message);
        } catch (err) {
            this.sendError('MQTT/subscribe: err => ' + err);
        }
    };

    sendError = (message = '') => {
        try {
            typeof this.onerror === 'function' && this.onerror(message);
        } catch {}
    };
}

export default new Mqtt();
