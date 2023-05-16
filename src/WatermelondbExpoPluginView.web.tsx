import * as React from 'react';

import { WatermelondbExpoPluginViewProps } from './WatermelondbExpoPlugin.types';

export default function WatermelondbExpoPluginView(props: WatermelondbExpoPluginViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
