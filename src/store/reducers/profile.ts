import { v4 as generateId } from 'uuid';

import { ProfileActions } from '../actions/profile';

export type BackgroundDisplay = {
  blur: number;
  luminosity: number; // Positive to lighten, negative to darken
};

export type WidgetPosition =
  | 'topLeft'
  | 'topCentre'
  | 'topRight'
  | 'middleLeft'
  | 'middleCentre'
  | 'middleRight'
  | 'bottomLeft'
  | 'bottomCentre'
  | 'bottomRight';

export type WidgetDisplay = {
  colour?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  position: WidgetPosition;
};

interface PluginState {
  id: string;
  type: string;
  active: boolean;
}

export interface BackgroundState extends PluginState {
  display: BackgroundDisplay;
}

export interface WidgetState extends PluginState {
  display: WidgetDisplay;
}

export interface ProfileState {
  id: string;
  name: string;
  backgrounds: BackgroundState[];
  widgets: WidgetState[];
  data: { [id: string]: object };
}

export const defaultProfile: Pick<
  ProfileState,
  'backgrounds' | 'data' | 'widgets'
> = {
  backgrounds: [
    {
      id: generateId(),
      type: 'background/colour',
      active: true,
      display: { luminosity: 0, blur: 0 },
    },
  ],
  widgets: [
    {
      id: generateId(),
      type: 'widget/time',
      active: true,
      display: { position: 'middleCentre', colour: 'black' },
    },
    {
      id: generateId(),
      type: 'widget/greeting',
      active: true,
      display: { position: 'middleCentre', fontSize: 10 },
    },
  ],
  data: {},
};

const initialState: ProfileState = {
  ...defaultProfile,
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Default',
};

export function profile(
  state = initialState,
  action: ProfileActions,
): ProfileState {
  switch (action.type) {
    case 'SET_BACKGROUND':
      let newState = { ...state };

      if (
        !state.backgrounds.map(plugin => plugin.type).includes(action.data.type)
      ) {
        newState.backgrounds = newState.backgrounds.concat({
          id: generateId(),
          type: action.data.type,
          active: true,
          display: { luminosity: 0, blur: 0 },
        });
      }

      return {
        ...newState,
        backgrounds: newState.backgrounds.map(plugin => ({
          ...plugin,
          active: plugin.type === action.data.type,
        })),
      };

    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: state.widgets.concat({
          id: generateId(),
          type: action.data.type,
          active: true,
          display: { position: 'middleCentre' },
        }),
      };

    case 'REMOVE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.filter(plugin => plugin.id !== action.data.id),
      };

    // @todo Reorder widget?

    case 'SET_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          [action.data.id]: action.data.data,
        },
      };

    case 'SET_BACKGROUND_DISPLAY':
      return {
        ...state,
        backgrounds: state.backgrounds.map(plugin =>
          plugin.id === action.data.id
            ? {
                ...plugin,
                display: { ...plugin.display, ...action.data.display },
              }
            : plugin,
        ),
      };

    case 'SET_WIDGET_DISPLAY':
      return {
        ...state,
        widgets: state.widgets.map(plugin =>
          plugin.id === action.data.id
            ? {
                ...plugin,
                display: { ...plugin.display, ...action.data.display },
              }
            : plugin,
        ),
      };
  }

  return state;
}
