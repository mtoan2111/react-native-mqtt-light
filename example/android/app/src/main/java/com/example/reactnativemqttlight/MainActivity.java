package com.example.reactnativemqttlight;

import com.facebook.react.ReactActivity;

public abstract class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MqttLightExample";
  }
}
