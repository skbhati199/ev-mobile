import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    paymentMethodContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      height: '70@s',
      paddingHorizontal: '5@s'
    },
    paymentMethodDetailsContainer: {
      justifyContent: 'center'
    },
    paymentMethodLogoContainer: {
      marginRight: '15@s',
      paddingLeft: '10@s'
    },
    cardSVG: {
      height: '60@s',
      width: '60@s',
      color: commonColor.textColor
    },
    text: {
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
