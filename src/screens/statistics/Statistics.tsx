import I18n from 'i18n-js';
import { Container, Content, Icon, Spinner } from 'native-base';
import React from 'react';

import HeaderComponent from '../../components/header/HeaderComponent';
import I18nManager, { NumberFormatCompactStyleEnum, NumberFormatNotationEnum, NumberFormatStyleEnum } from '../../I18n/I18nManager';
import BaseScreen from '../../screens/base-screen/BaseScreen';
import TransactionsHistoryFilters, { TransactionsHistoryFiltersDef } from '../../screens/transactions/history/TransactionsHistoryFilters';
import BaseProps from '../../types/BaseProps';
import { TransactionDataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import computeStyleSheet from './StatisticsStyles';
import { View } from 'react-native';
import StatisticsComponent from '../../components/statistics/StatisticsComponent';
import computeActivityIndicatorCommonStyles from '../../components/activity-indicator/ActivityIndicatorCommonStyle';
import { ActivityIndicator } from 'react-native-paper';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  totalNumberOfSession?: number;
  totalConsumptionWattHours?: number;
  totalDurationSecs?: number;
  totalInactivitySecs?: number;
  filterLoading?: boolean;
  totalPrice?: number;
  priceCurrency?: string;
  isPricingActive?: boolean;
  showFilter?: boolean;
  filters?: TransactionsHistoryFiltersDef;
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

export default class Statistics extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      totalNumberOfSession: 0,
      totalConsumptionWattHours: 0,
      totalDurationSecs: 0,
      totalInactivitySecs: 0,
      totalPrice: 0,
      isPricingActive: false,
      showFilter: false,
      filters: null,
      filterLoading: false
    };
  }

  public async componentDidMount() {
    // Get initial filters
    await super.componentDidMount();
    await this.refresh();
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public refresh = async () => {
    const { filters } = this.state;
    // Get the ongoing Transaction stats
    const transactionsStats = await this.getTransactionsStats();
    // Retrieve all the transactions for the current userID
    const allTransactions = await this.getTransactionsStats({ Statistics: 'history' });
    const allTransactionsStats = allTransactions?.stats;
    const minTransactionDate = allTransactionsStats?.firstTimestamp ? new Date(allTransactionsStats.firstTimestamp) : new Date();
    const maxTransactionDate = allTransactionsStats?.lastTimestamp ? new Date(allTransactionsStats.lastTimestamp) : new Date();
    // Set
    this.setState({
      filters,
      totalNumberOfSession: transactionsStats?.stats?.count,
      totalConsumptionWattHours: transactionsStats?.stats?.totalConsumptionWattHours,
      totalDurationSecs: transactionsStats?.stats?.totalDurationSecs,
      totalInactivitySecs: transactionsStats?.stats?.totalInactivitySecs,
      maxTransactionDate,
      minTransactionDate,
      totalPrice: transactionsStats?.stats?.totalPrice,
      isPricingActive: this.securityProvider?.isComponentPricingActive(),
      priceCurrency: transactionsStats?.stats?.currency,
      loading: false,
      filterLoading: false
    });
  };

  public getTransactionsStats = async (params?: {}): Promise<TransactionDataResult> => {
    if (this.state.filters) {
      try {
        // Get active transaction
        const { startDateTime, endDateTime } = this.state.filters;
        params = params ?? {
          Statistics: 'history',
          UserID: this.state.filters?.userID,
          StartDateTime: startDateTime ? startDateTime.toISOString() : null,
          EndDateTime: endDateTime ? endDateTime.toISOString() : null
        }
        return await this.centralServerProvider?.getTransactions(params, Constants.ONLY_RECORD_COUNT);
      } catch (error) {
        // Check if HTTP?
        if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
          await Utils.handleHttpUnexpectedError(
            this.centralServerProvider,
            error,
            'transactions.transactionStatsUnexpectedError',
            this.props.navigation,
            this.refresh.bind(this)
          );
        }
      }
    }
    return null;
  };

  private onFilterChanged(newFilters: TransactionsHistoryFiltersDef) : void {
    this.setState({filters: newFilters, ...(this.state.filters ? {filterLoading: true} : {loading: true})}, () => this.refresh());
  }

  public render = () => {
    const style = computeStyleSheet();
    const activityIndicatorCommonStyles = computeActivityIndicatorCommonStyles();
    const { navigation } = this.props;
    const commonColors = Utils.getCurrentCommonColor();
    const {
      loading,
      totalNumberOfSession,
      totalConsumptionWattHours,
      totalDurationSecs,
      totalInactivitySecs,
      priceCurrency,
      totalPrice,
      isPricingActive,
      filterLoading,
      minTransactionDate,
      maxTransactionDate,
      filters
    } = this.state;
    const totalConsumption = I18nManager.formatNumberWithCompacts(totalConsumptionWattHours, {
      notation: NumberFormatNotationEnum.COMPACT,
      compactStyle: NumberFormatCompactStyleEnum.METRIC,
      compactDisplay: 'short',
      maximumFractionDigits: 1,
      minimumFractionDigits: 1
    });
    const totalSessions = I18nManager.formatNumberWithCompacts(totalNumberOfSession, {
      notation: NumberFormatNotationEnum.COMPACT,
      compactStyle: NumberFormatCompactStyleEnum.FINANCE,
      compactDisplay: 'long',
      compactThreshold: 1000000
    });
    const totalCost = !isPricingActive ? null : I18nManager.formatNumberWithCompacts(totalPrice, {
      notation: NumberFormatNotationEnum.COMPACT,
      compactStyle: NumberFormatCompactStyleEnum.FINANCE,
      compactDisplay: 'short',
      compactThreshold: 1000000,
      style: NumberFormatStyleEnum.CURRENCY,
      currency: priceCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    });
    return (
      <Container style={style.container}>
        {filterLoading && <ActivityIndicator color={'black'} size={scale(20)} style={activityIndicatorCommonStyles.activityIndicator} animating={filterLoading} />}
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => this.setHeaderComponent(headerComponent, true)}
          navigation={navigation}
          title={I18n.t('home.statistics')}
        />
        <TransactionsHistoryFilters
          minTransactionDate={minTransactionDate}
          maxTransactionDate={maxTransactionDate}
          onFilterChanged={(newFilters) => this.onFilterChanged(newFilters)}
          ref={(transactionsHistoryFilters: TransactionsHistoryFilters) => this.setScreenFilters(transactionsHistoryFilters, true)}
        />
        {(loading || !filters) ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <Content style={style.content}>
            <View style={style.boxContainer}>
              <StatisticsComponent
                backgroundColor={style.sessions.backgroundColor.toString()}
                textColor={commonColors.light}
                value={totalSessions?.value}
                secondLine={I18n.t('transactions.transactions')}
                renderIcon={(iconStyle) => <Icon style={iconStyle} type="MaterialIcons" name="history" />}
                description={I18n.t('home.numberOfSessionsNote')}
                prefix={totalSessions?.compact}
              />
              <StatisticsComponent
                backgroundColor={style.energy.backgroundColor.toString()}
                textColor={commonColors.light}
                value={totalConsumption?.value}
                secondLine={'W.h'}
                renderIcon={(iconStyle) => <Icon name={'bolt'} type={'FontAwesome'} style={iconStyle} />}
                description={I18n.t('home.totalConsumptionNote')}
                prefix={totalConsumption?.compact}
                prefixWithSecondLine={true}
              />
              <StatisticsComponent
                backgroundColor={style.duration.backgroundColor.toString()}
                textColor={commonColors.light}
                value={Utils.formatDuration(totalDurationSecs)}
                renderIcon={(iconStyle) => <Icon style={iconStyle} type="MaterialIcons" name="timer" />}
                description={I18n.t('home.totalDurationNote')}
              />
              <StatisticsComponent
                backgroundColor={style.inactivity.backgroundColor.toString()}
                textColor={commonColors.light}
                secondLine={I18nManager.formatPercentage(totalInactivitySecs / totalDurationSecs)}
                value={Utils.formatDuration(totalInactivitySecs)}
                renderIcon={(iconStyle) => <Icon style={iconStyle} type="MaterialIcons" name="timer-off" />}
                description={I18n.t('home.totalInactivityNote')}
              />
              {isPricingActive && (
                <StatisticsComponent
                  backgroundColor={style.cost.backgroundColor.toString()}
                  textColor={commonColors.light}
                  secondLine={totalCost?.currency}
                  value={totalCost?.value}
                  prefix={totalCost?.compact}
                  prefixWithSecondLine={true}
                  renderIcon={(iconStyle) => <Icon style={iconStyle} type="FontAwesome" name="money" />}
                  description={I18n.t('home.totalPriceNote')}
                />
              )}
            </View>
          </Content>
        )}
      </Container>
    );
  };
}
