import React from 'react';
import { Text, View } from 'react-native';
import BaseProps from '../../types/BaseProps';
import { BillingPaymentMethod, CCBrands } from '../../types/Billing';
import Amex from '../../../assets/payment-methods/amex.svg';
import DinersClub from '../../../assets/payment-methods/diners-club.svg';
import MasterCard from '../../../assets/payment-methods/mc.svg';
import Visa from '../../../assets/payment-methods/visa.svg';
import Discover from '../../../assets/payment-methods/discover.svg';
import Jcb from '../../../assets/payment-methods/jcb.svg';
import UnionPay from '../../../assets/payment-methods/union-pay.svg';
import computeStyleSheet from './PaymentMethodComponentStyle';
import moment from 'moment';

export interface Props extends BaseProps {
  paymentMethod: BillingPaymentMethod;
}

interface State {}

export default class PaymentMethodComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { paymentMethod } = this.props;
    const style = computeStyleSheet();
    const expirationDate = moment(paymentMethod.expiringOn).format('MM/YYYY');
    return (
      <View style={style.paymentMethodContainer}>
        <View style={style.paymentMethodLogoContainer}>
          {this.renderPaymentMethodLogo('visa', style)}
        </View>
        <View style={style.paymentMethodDetailsContainer}>
          <Text style={style.text}> **** **** **** {paymentMethod.last4}</Text>
          <Text style={style.text}>{expirationDate}</Text>
          <Text style={style.text}>{paymentMethod.type}</Text>
          <Text style={[style.text, paymentMethod.isDefault && { color: 'red'}]}>{paymentMethod.isDefault ? 'true' : 'false' }</Text>
        </View>
      </View>
    );
  }

  private renderPaymentMethodLogo(brand: string, style: any) {
    switch (brand) {
      case CCBrands.AMEX:
        return <Amex width={style.cardSVG.width} height={style.cardSVG.height} />;
      case CCBrands.DINER_CLUB:
        return <DinersClub width={style.cardSVG.width} height={style.cardSVG.height} />;
      case CCBrands.DISCOVER:
        return <Discover width={style.cardSVG.width} height={style.cardSVG.height} />;
      case CCBrands.JCB:
        return <Jcb width={style.cardSVG.width} height={style.cardSVG.height} />;
      case CCBrands.MASTERCARD:
        return <MasterCard width={style.cardSVG.width} height={style.cardSVG.height} />;
      case CCBrands.UNION_PAY:
        return <UnionPay width={style.cardSVG.width} height={style.cardSVG.height} />;
      case CCBrands.VISA:
        return <Visa width={style.cardSVG.width} height={style.cardSVG.height} />;
      // TODO add case for carte bancaire
      default:
        return null;
    }
  }

}
