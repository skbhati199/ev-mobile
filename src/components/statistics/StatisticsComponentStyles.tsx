import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      padding: '10@s',
      borderWidth: 0,
     // borderRadius: '15@s',
      marginTop: '10@s',
      flexGrow: 1,
      flexBasis: 'auto',
      marginRight: '10@s',
      justifyContent: 'space-between',
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62,
      elevation: 11
    },
    icon: {
      fontSize: '52@s',
      marginRight: '10@s',
      color: commonColor.light
    },
    iconTextContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    valueUnitContainer: {
      justifyContent: 'center'
    },
    text: {
      color: 'white'
    },
    valueText: {
      fontSize: '23@s',
      fontWeight: 'bold'
    },
    unitText: {
      fontSize: '20@s',
      lineHeight: '22@s'
    },
    descriptionText: {
      fontSize: '14@s',
      marginTop: '5@s',
      textAlign: 'right'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
