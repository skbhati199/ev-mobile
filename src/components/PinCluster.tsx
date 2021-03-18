import { Text, View } from 'native-base';
import BaseProps from '../types/BaseProps';
import React from 'react';

export interface Props extends BaseProps {
  count: number
}

interface State {
}

export default class ChargingStationComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const { count } = this.props;
    return (
      <View
        style={{
          height: 60,
          width: 60,
          borderWidth: 2,
          borderColor: '#5694f7',
          backgroundColor: '#fff',
          borderRadius: 31,
          alignItems: 'center',
          justifyContent: 'center',
        }} >

        <Text style={{
          textAlign: 'center',
          justifyContent: 'center',
          fontSize: 19
        }}>{count}</Text>
      </View>
    )
  }
}
