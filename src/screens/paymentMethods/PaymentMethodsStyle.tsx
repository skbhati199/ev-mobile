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
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    content: {
      flex: 1
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    addPMContainer: {
      width: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      paddingHorizontal: '5@s',
      paddingTop: '5@s'
    },
    addPMButton: {
      color: commonColor.textColor,
      fontSize: '20@s'
    },
    modalTitle: {
      textAlign: 'center',
      color: commonColor.textColor,
      paddingTop: '10@s',
      fontSize: '15@s'
    },
    cardField: {
      height: '50@s',
      width: '90%',
      marginTop: '50@s'
    },
    modalContent: {
      height: 'auto',
      width: '100%',
      backgroundColor: commonColor.containerBgColor,
      borderRadius: '15@s',
      justifyContent: 'center'
    },
    button: {
      marginTop: '30@s',
      alignSelf: 'center',
      backgroundColor: 'red',
      width: '30%',
      marginBottom: '10@s',
      borderRadius: '20@s'
    },
    buttonText: {
      color: 'white',
      padding: '5@s'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
