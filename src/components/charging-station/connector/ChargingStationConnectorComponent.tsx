import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Chademo from '../../../../assets/connectorType/chademo.svg';
import ComboCCS from '../../../../assets/connectorType/combo-ccs.svg';
import Domestic from '../../../../assets/connectorType/domestic-ue.svg';
import NoConnector from '../../../../assets/connectorType/no-connector.svg';
import Type1CCS from '../../../../assets/connectorType/type1-ccs.svg';
import Type1 from '../../../../assets/connectorType/type1.svg';
import Type3C from '../../../../assets/connectorType/type3c.svg';
import Type2 from '../../../../assets/connectorType/type2.svg';
import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { Connector, ConnectorType } from '../../../types/ChargingStation';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import ConnectorStatusComponent from '../../connector-status/ConnectorStatusComponent';
import computeStyleSheet from './ChargingStationConnectorComponentStyles';

export interface Props extends BaseProps {
  chargingStation: ChargingStation;
  connector: Connector;
  onNavigate?: () => void;
  listed?: boolean;
}

interface State {
  showBatteryLevel?: boolean;
}

export default class ChargingStationConnectorComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private timerAnimation: NodeJS.Timeout;

  public constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      showBatteryLevel: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public componentDidMount() {
    // Refresh every minutes
    this.timerAnimation = setInterval(() => {
      // Animate
      this.animate();
    }, Constants.ANIMATION_PERIOD_MILLIS);
  }

  public componentWillUnmount() {
    // Stop the timer
    if (this.timerAnimation) {
      clearInterval(this.timerAnimation);
    }
  }

  public animate() {
    const { connector } = this.props;
    if (connector && connector.currentStateOfCharge === 0) {
      // SoC not supported
      return;
    }
    // Switch battery/Consumption
    this.setState({
      showBatteryLevel: !this.state.showBatteryLevel
    });
  }

  public renderFirstConnectorDetails = (chargingStation: ChargingStation, connector: Connector) => (
    <ConnectorStatusComponent navigation={this.props.navigation} connector={connector} inactive={chargingStation.inactive} />
  );

  public renderSecondConnectorDetails = (chargingStation: ChargingStation, connector: Connector, style: any) =>
    connector.currentTransactionID !== 0 && !chargingStation.inactive ? (
      <View style={style.connectorDetail}>
        <Animatable.View
          animation={!this.state.showBatteryLevel ? 'fadeIn' : 'fadeOut'}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>
            {connector.currentInstantWatts / 1000 < 10
              ? connector.currentInstantWatts > 0
                ? I18nManager.formatNumber(Math.round(connector.currentInstantWatts / 10) / 100)
                : 0
              : I18nManager.formatNumber(Math.trunc(connector.currentInstantWatts / 1000))}
          </Text>
          <Text style={style.label} numberOfLines={1}>
            {I18n.t('details.instant')}
          </Text>
          <Text style={style.subLabel} numberOfLines={1}>
            (kW)
          </Text>
        </Animatable.View>
        <Animatable.View
          animation={this.state.showBatteryLevel ? 'fadeIn' : 'fadeOut'}
          style={style.connectorDetailAnimated}
          duration={Constants.ANIMATION_ROTATION_MILLIS}>
          <Text style={style.connectorValues}>{connector.currentStateOfCharge}</Text>
          <Text style={style.label} numberOfLines={1}>
            {I18n.t('details.battery')}
          </Text>
          <Text style={style.subLabel} numberOfLines={1}>
            (%)
          </Text>
        </Animatable.View>
      </View>
    ) : (
      <View style={style.connectorDetail}>
        {Utils.buildConnectorTypeSVG(connector?.type)}
        <Text style={style.labelImage}>{Utils.translateConnectorType(connector.type)}</Text>
      </View>
    );

  public renderThirdConnectorDetails = (chargingStation: ChargingStation, connector: Connector, style: any) =>
    connector.currentTransactionID !== 0 && !chargingStation.inactive ? (
      <View style={style.connectorDetail}>
        <Text style={style.connectorValues}>{I18nManager.formatNumber(Math.round(connector.currentTotalConsumptionWh / 1000))}</Text>
        <Text style={style.label} numberOfLines={1}>
          {I18n.t('details.total')}
        </Text>
        <Text style={style.subLabel} numberOfLines={1}>
          (kW.h)
        </Text>
      </View>
    ) : (
      <View style={style.connectorDetail}>
        <Text style={style.connectorValues}>{I18nManager.formatNumber(Math.trunc(connector.power / 1000))}</Text>
        <Text style={style.label} numberOfLines={1}>
          {I18n.t('details.maximum')}
        </Text>
        <Text style={style.subLabel} numberOfLines={1}>
          (kW)
        </Text>
      </View>
    );

  public render() {
    const style = computeStyleSheet();
    const { connector, navigation, chargingStation, onNavigate, listed } = this.props;
    return (
      <TouchableOpacity
        style={[style.container, listed && style.borderedTopContainer]}
        disabled={chargingStation.inactive || !listed}
        onPress={() => {
          if (onNavigate) {
            onNavigate();
          }
          navigation.navigate('ChargingStationConnectorDetailsTabs', {
            params: {
              params: {
                showChargingSettings: false,
                chargingStationID: chargingStation.id,
                connectorID: connector.connectorId
              }
            },
            key: `${Utils.randomNumber()}`
          });
        }}>
        <Animatable.View animation={'flipInX'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
          <View style={style.connectorContainer}>
            <View style={style.connectorDetailContainer}>
              <View style={{ flex: 1 }}>{this.renderFirstConnectorDetails(chargingStation, connector)}</View>
              <View style={{ flex: 1 }}>{this.renderSecondConnectorDetails(chargingStation, connector, style)}</View>
              <View style={{ flex: 1 }}>{this.renderThirdConnectorDetails(chargingStation, connector, style)}</View>
            </View>
            {!chargingStation.inactive && listed && (
              <View style={style.iconContainer}>
                <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />
              </View>
            )}
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}
