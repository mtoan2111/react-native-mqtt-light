import { NativeModules } from 'react-native';

type MqttLightType = {
  multiply(a: number, b: number): Promise<number>;
};

const { MqttLight } = NativeModules;

export default MqttLight as MqttLightType;
