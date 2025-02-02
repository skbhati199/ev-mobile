import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    fab: {
      width: '55@s',
      height: '55@s',
      borderRadius: '55@s',
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
      right: 0,
      zIndex: 1,
      elevation: 4,
      backgroundColor: commonColor.primary,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62
    },
    fabIcon: {
      fontSize: '18@s',
      color: commonColor.light
    },
    placedFab: {
      margin: '14@s',
      position: 'absolute'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
