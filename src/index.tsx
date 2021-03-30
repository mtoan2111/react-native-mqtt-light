import {
    NativeModules,
    NativeEventEmitter,
    EmitterSubscription,
} from 'react-native';

class Mqtt {
    Mqtt: any;
    nativeEvent: NativeEventEmitter | null = null;
    onmessage: any;
    onlostconnect: any;
    onunsubscribe: any;
    onerror: any;
    mqttMessageSubscriber: EmitterSubscription | undefined;
    mqttConnectionLostSubscriber: EmitterSubscription | undefined;
    mqttErrorSubscriber: EmitterSubscription | undefined;

    constructor() {}

    init = () => {
        try {
            this.Mqtt = NativeModules.Mqtt;
            if (!this.nativeEvent) {
                this.nativeEvent = new NativeEventEmitter(this.Mqtt);
            }
            this.mqttMessageSubscriber && this.mqttMessageSubscriber.remove();
            this.mqttConnectionLostSubscriber && this.mqttConnectionLostSubscriber.remove();
            this.mqttErrorSubscriber && this.mqttErrorSubscriber.remove();
            this.initListener();
        } catch (err) {
            this.nativeEvent = new NativeEventEmitter(null);
        }
    };

    initListener = () => {
        try {
            this.nativeEvent?.removeListener(
                'MQTTMessage',
                this.onMQTTMessageIncomming,
            );
            this.nativeEvent?.removeListener(
                'MQTTConnectionLost',
                this.onMQTTConnectionLost,
            );
            this.nativeEvent?.removeListener('MQTTError', this.onMQTTError);

            this.mqttMessageSubscriber = this.nativeEvent?.addListener(
                'MQTTMessage',
                this.onMQTTMessageIncomming,
            );

            this.mqttConnectionLostSubscriber = this.nativeEvent?.addListener(
                'MQTTConnectionLost',
                this.onMQTTConnectionLost,
            );

            this.mqttErrorSubscriber = this.nativeEvent?.addListener(
                'MQTTError',
                this.onMQTTError,
            );
        } catch (err) {
            this.sendError('MQTT/initQueue: err => ' + err);
        }
    };

    onMQTTMessageIncomming = (data: any) => {
        try {
            typeof this.onmessage === 'function' && this.onmessage?.(data);
        } catch (err) {
            this.sendError('MQTT/initListener/message: err => ' + err);
        }
    };

    onMQTTConnectionLost = (data: any) => {
        try {
            typeof this.onlostconnect === 'function' &&
                this.onlostconnect?.(data);
        } catch (err) {
            this.sendError('MQTT/initListener/lostConnect: err => ' + err);
        }
    };

    onMQTTError = (data: any) => {
        try {
            this.sendError('MQTT/initListener/error: err => ' + data.message);
        } catch (err) {
            this.sendError('MQTT/initListener/error: err => ' + err);
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

    unsubscribes = (topics = []) => {
        try {
            return this.Mqtt?.unsubscribes?.(topics);
        } catch (err) {
            this.sendError('MQTT/unsubscribes: err => ' + err);
            return Promise.reject(err);
        }
    };

    unsubscribe = (topic = '') => {
        try {
            return this.Mqtt?.unsubscribe?.(topic);
        } catch (err) {
            this.sendError('MQTT/unsubscribe: err => ' + err);
            return Promise.reject(err);
        }
    };

    isConnected = () => {
        try {
            return this.Mqtt?.isConnected();
        } catch (err) {
            this.sendError('MQTT/isConnected: err => ' + err);
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
