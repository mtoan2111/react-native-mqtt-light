import { NativeModules, NativeEventEmitter } from 'react-native';

class Mqtt {
    Mqtt: any;
    nativeEvent: any;
    onmessage: any;
    onlostconnect: any;
    onerror: any;

    constructor() {
    }

    init = () => {
        try {
            this.Mqtt = NativeModules.Mqtt;
            this.nativeEvent = new NativeEventEmitter(this.Mqtt);
            this.initListener();
        } catch (err) {
            this.nativeEvent = new NativeEventEmitter(null);
        }
    };

    initListener = () => {
        try {
            this.nativeEvent?.addListener?.('message', (data) => {
                try {
                    typeof this.onmessage === 'function' &&
                        this.onmessage?.(data);
                } catch (err) {
                    this.sendError('MQTT/initListener/message: err => ' + err);
                }
            });

            this.nativeEvent?.addListener?.('lostConnect', (data) => {
                try {
                    typeof this.onlostconnect === 'function' &&
                        this.onlostconnect?.(data);
                } catch (err) {
                    this.sendError(
                        'MQTT/initListener/lostConnect: err => ' + err,
                    );
                }
            });

            this.nativeEvent?.addListener?.('error', (data) => {
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
            return this.Mqtt?.initQueue?.(options);
        } catch (err) {
            this.sendError('MQTT/initQueue: err => ' + err);
            return Promise.reject(err);
        }
    };

    subscribe = (topic = '', qos = 0) => {
        try {
            return this.Mqtt?.subscribe?.(topic, qos);
        } catch (err) {
            this.sendError('MQTT/subscribe: err => ' + err);
            return Promise.reject(err);
        }
    };

    publish = (topic = '', message = '') => {
        try {
            return this.Mqtt?.publish?.(topic, message);
        } catch (err) {
            this.sendError('MQTT/subscribe: err => ' + err);
            return Promise.reject(err);
        }
    };

    unsubscribe = (topics = []) => {
        try {
            return this.Mqtt?.unsubscribe?.(topics);
        } catch (err) {
            this.sendError('MQTT/unsubscribe: err => ' + err);
            return Promise.reject(err);
        }
    };

    disconnect = () => {
        try {
            return this.Mqtt?.disconnect?.();
        } catch (err) {
            this.sendError('MQTT/disconnect: err => ' + err);
            return Promise.reject(err);
        }
    };

    sendError = (message = '') => {
        try {
            typeof this.onerror === 'function' && this.onerror(message);
        } catch {}
    };
}

export default new Mqtt();
