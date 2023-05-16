import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to WatermelondbExpoPlugin.web.ts
// and on native platforms to WatermelondbExpoPlugin.ts
import WatermelondbExpoPluginModule from './WatermelondbExpoPluginModule';
import WatermelondbExpoPluginView from './WatermelondbExpoPluginView';
import { ChangeEventPayload, WatermelondbExpoPluginViewProps } from './WatermelondbExpoPlugin.types';

// Get the native constant value.
export const PI = WatermelondbExpoPluginModule.PI;

export function hello(): string {
  return WatermelondbExpoPluginModule.hello();
}

export async function setValueAsync(value: string) {
  return await WatermelondbExpoPluginModule.setValueAsync(value);
}

const emitter = new EventEmitter(WatermelondbExpoPluginModule ?? NativeModulesProxy.WatermelondbExpoPlugin);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { WatermelondbExpoPluginView, WatermelondbExpoPluginViewProps, ChangeEventPayload };
