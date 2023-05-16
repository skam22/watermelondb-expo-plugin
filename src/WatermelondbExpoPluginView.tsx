import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { WatermelondbExpoPluginViewProps } from './WatermelondbExpoPlugin.types';

const NativeView: React.ComponentType<WatermelondbExpoPluginViewProps> =
  requireNativeViewManager('WatermelondbExpoPlugin');

export default function WatermelondbExpoPluginView(props: WatermelondbExpoPluginViewProps) {
  return <NativeView {...props} />;
}
