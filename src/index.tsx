import { NativeModules, NativeEventEmitter } from 'react-native';

class Mqtt {
    Mqtt: any;
    nativeEvent: NativeEventEmitter;
    onmessage: any;
    onreconnect: any;
    onconnect: any;
    onlostconnect: any;
    onsubscription: any;
    onunsubscription: any;
    onerror: any;
    oncount: any;

    constructor() {
        try {
            console.log(1);
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
            this.nativeEvent.addListener('reconnect', (data) => {
                try {
                    typeof this.onreconnect === 'function' &&
                        this.onreconnect(
                            data && typeof data !== 'undefined' && data.message,
                        );
                } catch (err) {
                    this.sendError(
                        'MQTT/initListener/reconnect: err => ' + err,
                    );
                }
            });
            this.nativeEvent.addListener('connect', (data) => {
                try {
                    typeof this.onconnect === 'function' &&
                        this.onconnect(
                            data && typeof data !== 'undefined' && data.message,
                        );
                } catch (err) {
                    this.sendError('MQTT/initListener/connect: err => ' + err);
                }
            });
            this.nativeEvent.addListener('count', (data) => {
                try {
                    console.log(data);
                    typeof this.oncount === 'function' &&
                        this.oncount(
                            data && typeof data !== 'undefined' && data.message,
                        );
                } catch (err) {
                    this.sendError('MQTT/initListener/connect: err => ' + err);
                }
            });
            this.nativeEvent.addListener('subscription', (data) => {
                try {
                    typeof this.onsubscription === 'function' &&
                        this.onsubscription(
                            data && typeof data !== 'undefined' && data.message,
                        );
                } catch (err) {
                    this.sendError(
                        'MQTT/initListener/subscription: err => ' + err,
                    );
                }
            });
            this.nativeEvent.addListener('lostConnect', (data) => {
                try {
                    typeof this.onlostconnect === 'function' &&
                        this.onlostconnect(
                            data && typeof data !== 'undefined' && data.message,
                        );
                } catch (err) {
                    this.sendError(
                        'MQTT/initListener/lostConnect: err => ' + err,
                    );
                }
            });
            this.nativeEvent.addListener('unsubscribe', (data) => {
                try {
                    typeof this.onunsubscription === 'function' &&
                        this.onunsubscription(
                            data && typeof data !== 'undefined' && data.message,
                        );
                } catch (err) {
                    this.sendError(
                        'MQTT/initListener/lostConnect: err => ' + err,
                    );
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
            this.Mqtt.initQueue(options);
        } catch (err) {
            this.sendError('MQTT/initQueue: err => ' + err);
        }
    };

    subscribe = (topic = '') => {
        try {
            this.Mqtt.subscribe(topic);
        } catch (err) {
            this.sendError('MQTT/subscribe: err => ' + err);
        }
    };

    publish = (topic = '', message = '') => {
        try {
            this.Mqtt.publish(topic, message);
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
