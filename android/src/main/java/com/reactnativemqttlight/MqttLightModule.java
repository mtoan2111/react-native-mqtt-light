package com.reactnativemqttlight;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.DisconnectedBufferOptions;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.internal.MqttPersistentData;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

public class MqttLightModule extends ReactContextBaseJavaModule {
    private MqttAsyncClient mqttAndroidClient;
    private static ReactApplicationContext reactcontext;
    private boolean MQTT_Connected = false;
    private int Count = 0;
    private String wildCardSubscriptionTopic = "/mht/+/state";
    private String mqtt_Uri = "";
    private String mqtt_ClientId = "";
    private String mqtt_SubscriptionTopic = "";
    private String mqtt_PublishTopic = "";
    private String mqtt_UserName = "";
    private String mqtt_Password = "";
    private boolean mqtt_CleanSession = false;
    private boolean mqtt_AutoReconnect = false;
    private String publishTopic = "";
    private String dbTag = "MQTT-DEBUG";

    public MqttLightModule(ReactApplicationContext context){
        super(context);
        reactcontext = context;
    }

    @NonNull
    @Override
    public String getName() {
       return "Mqtt";
    }

    @ReactMethod
    public void initQueue(ReadableMap options, Promise promise){
        MemoryPersistence memoryPersistence = new MemoryPersistence();
        this.extractOptions(options);
        if (this.mqtt_Uri != ""){
            if (this.mqtt_ClientId == ""){
                this.mqtt_ClientId = String.valueOf(System.currentTimeMillis());
            }
            try {
                mqttAndroidClient = new MqttAsyncClient(this.mqtt_Uri, this.mqtt_ClientId, memoryPersistence );
            } catch (MqttException e) {
                e.printStackTrace();
            }
            mqttAndroidClient.setCallback(new MqttCallbackExtended() {
                @Override
                public void connectComplete(boolean reconnect, String serverURI) {
                    WritableMap params = Arguments.createMap();
                    if (reconnect){
                        params.putString("message", "connection has been reconnected");
                    }else {
                        params.putString("message", "connection has been inited");
                    }
                    promise.resolve(params);
                }

                @Override
                public void connectionLost(Throwable cause) {
                    WritableMap params = Arguments.createMap();
                    params.putString("message", "connection has been lost");
                    sendEvent("MQTTConnectionLost", params);
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    WritableMap params = Arguments.createMap();
                    params.putString("topic", topic);
                    params.putString("data", new String(message.getPayload()));
                    sendEvent("MQTTMessage", params);
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {

                }
            });
            try {
                mqttAndroidClient.connect(this.createMqttConnectOptions(), null, new IMqttActionListener() {
                    @Override
                    public void onSuccess(IMqttToken asyncActionToken) {
                        DisconnectedBufferOptions disconnectedBufferOptions = new DisconnectedBufferOptions();
                        disconnectedBufferOptions.setBufferEnabled(true);
                        disconnectedBufferOptions.setBufferSize(100);
                        disconnectedBufferOptions.setPersistBuffer(false);
                        disconnectedBufferOptions.setDeleteOldestMessages(false);
                        mqttAndroidClient.setBufferOpts(disconnectedBufferOptions);
                        MQTT_Connected = true;
                    }

                    @Override
                    public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                        promise.reject("Connection Error", exception.getMessage());
                    }
              });
            } catch (MqttException e) {
              promise.reject("Init-queue Error", e);
            }
        }
    }

    @ReactMethod
    public void subscribe(String topic, int qos, Promise promise) {
        this.subscriptionTopic(topic, qos, promise);
    }

    @ReactMethod
    public void publish(String topic, String message, Promise promise){
        this.publishTopic(topic, message, promise);
    }

    @ReactMethod
	public void unsubscribes(String[] topics){
		try {
			if (this.MQTT_Connected){
				mqttAndroidClient.unsubscribe(topics, null, new IMqttActionListener() {
					@Override
					public void onSuccess(IMqttToken asyncActionToken) {
						WritableMap params = Arguments.createMap();
						params.putString("message", "Unsubscribe topic");
						sendEvent("MQTTUnsubscribe", params);
					}

					@Override
					public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
						WritableMap params = Arguments.createMap();
						params.putString("message", "Could not Unsubscribe the topic " + mqtt_PublishTopic);
						sendEvent("MQTTError", params);
					}
				});
			}
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}

	@ReactMethod
	public void unsubscribe(String topics){
		try {
			if (this.MQTT_Connected){
				mqttAndroidClient.unsubscribe(topics, null, new IMqttActionListener() {
					@Override
					public void onSuccess(IMqttToken asyncActionToken) {
						WritableMap params = Arguments.createMap();
						params.putString("message", "Unsubscribe topic");
						sendEvent("MQTTUnsubscribe", params);
					}

					@Override
					public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
						WritableMap params = Arguments.createMap();
						params.putString("message", "Could not Unsubscribe the topic " + mqtt_PublishTopic);
						sendEvent("MQTTError", params);
					}
				});
			}
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}

    @ReactMethod
    public void isConnected(Promise promise){
        if (this.mqttAndroidClient != null){
            boolean connected = this.mqttAndroidClient.isConnected();
            WritableMap params = Arguments.createMap();
            params.putString("isConnected", "Client is still connected to broker");
            promise.resolve(params);
        }
        else {
            promise.reject("Connection Error", "Connection error");
        }
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        try {
            this.mqttAndroidClient.disconnect(null, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    WritableMap params = Arguments.createMap();
                    params.putString("message", "Disconnect successfully");
                    promise.resolve(params);
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    promise.reject("Disconnect Error", exception.getMessage());
                }
            });
        } catch (MqttException e) {
            promise.reject("Disconnect Error", e.getMessage());
        }
    }

    private void publishTopic(String topic, String mess, Promise promise){
        MqttMessage message = new MqttMessage();
        message.setPayload(mess.getBytes());
        try {
            if(this.MQTT_Connected){
                mqttAndroidClient.publish(topic, message, null, new IMqttActionListener() {
                    @Override
                    public void onSuccess(IMqttToken asyncActionToken) {
                        WritableMap params = Arguments.createMap();
                        params.putString("message", "Message has been sent to topic " + mqtt_PublishTopic + " ");
                        promise.resolve(params);
                    }

                    @Override
                    public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                        WritableMap params = Arguments.createMap();
                        params.putString("message", "Could not send the message to the topic " + mqtt_PublishTopic);
                        promise.reject("Publish Error", exception.getMessage());
                    }
                });
            }
        } catch (MqttException e) {
            WritableMap params = Arguments.createMap();
            params.putString("message", e.getMessage());
            sendEvent("MQTTError", params);
        }
    }

    private void subscriptionTopic(String topic, int qos, Promise promise) {
        try {
            if (mqttAndroidClient != null && mqttAndroidClient.isConnected()){
                mqttAndroidClient.subscribe(topic, qos, null, new IMqttActionListener() {
                    @Override
                    public void onSuccess(IMqttToken asyncActionToken) {
                        WritableMap params = Arguments.createMap();
                        params.putString("message", "Topic " + mqtt_SubscriptionTopic + " has been subscribed");
                        promise.resolve(params);
                    }

                    @Override
                    public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                        WritableMap params = Arguments.createMap();
                        params.putString("message", "Could not subscribe into the topic " + mqtt_SubscriptionTopic);
                        promise.reject("Subscription Error", exception.getMessage());
                    }
                });
            }
        } catch (MqttException e) {
            WritableMap params = Arguments.createMap();
            params.putString("message", e.getMessage());
            sendEvent("MQTTError", params);
        }
    }

    private void sendEvent(String eventName, WritableMap params){
        reactcontext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    private void extractOptions(ReadableMap options){
        if(options != null){
            if (options.hasKey("uri")){
                this.mqtt_Uri = options.getString("uri");
            }
            if (options.hasKey("clientId")){
                this.mqtt_ClientId = options.getString("clientId");
            }
            if (options.hasKey("userName")){
                this.mqtt_UserName = options.getString("userName");
            }
            if (options.hasKey("password")){
                this.mqtt_Password = options.getString("password");
            }
            if(options.hasKey("cleanSession")){
                this.mqtt_CleanSession = options.getBoolean("cleanSession");
            }
            if(options.hasKey("autoReconnect")){
                this.mqtt_AutoReconnect = options.getBoolean("autoReconnect");
            }
        }
    }

    private MqttConnectOptions createMqttConnectOptions() {
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(this.mqtt_AutoReconnect);
        options.setCleanSession(this.mqtt_CleanSession);
        if (this.mqtt_UserName != ""){
            options.setUserName(this.mqtt_UserName);
        }
        if (this.mqtt_Password != ""){
            options.setPassword(this.mqtt_Password.toCharArray());
        }
        return options;
    }
}
