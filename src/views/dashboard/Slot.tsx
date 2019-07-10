import React, { FC } from 'react';

import Plugin from '../../components/plugin/Plugin';
import { getPlugin } from '../../plugins';
import { WidgetPosition, WidgetState } from '../../store/reducers/profile';
import Widget from './Widget';
import './Slot.sass';

type Props = {
  position: WidgetPosition;
  widgets: WidgetState[];
};

const Slot: FC<Props> = ({ position, widgets }) => (
  <div className={`Slot ${position}`}>
    {widgets.map(({ display, id, type }) => (
      <Widget key={id} {...display}>
        <Plugin id={id} Component={getPlugin(type).Dashboard} />
      </Widget>
    ))}
  </div>
);

export default Slot;
