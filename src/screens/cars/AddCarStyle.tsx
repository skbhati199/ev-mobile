import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';
import { PLATFORM } from '../../theme/variables/commonColor';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      height: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    content: {
      width: '100%',
      height: 'auto',
      paddingTop: '15@s',
      alignItems: 'center'
    },
    scrollview: {
      height: 'auto'
    },
    itemContainer: {
      width: '100%',
      height: '70@s',
      flexDirection: 'row',
      alignItems: 'center'
    },
    carPlaceholderContainer: {
      backgroundColor: commonColor.listItemBackground
    },
    noCarIcon: {
      fontSize: '55@s',
      color: commonColor.textColor,
      marginHorizontal: '10@s'
    },
    selectField: {
      width: '100%',
      height: 'auto',
      minHeight: '40@s',
      marginHorizontal: 0,
      paddingHorizontal: 0,
      backgroundColor: commonColor.containerBgColor
    },
    inputContainer: {
      borderBottomColor: commonColor.textColor,
      borderBottomWidth: 0.7,
      marginLeft: 0,
      paddingBottom: 0
    },
    inputContainerDisabled: {
      borderBottomWidth: 1,
      borderBottomColor: commonColor.disabledDark
    },
    selectFieldDisabled: {
      opacity: 0.4
    },
    selectFieldText: {
      color: commonColor.textColor,
      textAlign: 'left',
      marginHorizontal: 0,
      fontSize: '14@s'
    },
    selectFieldTextPlaceholder: {
      color: commonColor.disabledDark
    },
    selectDropdown: {
      backgroundColor: commonColor.selectDropdownBackgroundColor
    },
    selectDropdownRow: {
      borderBottomWidth: 0
    },
    selectDropdownRowText: {
      color: commonColor.textColor,
      paddingVertical: 0,
      textAlign: 'left',
      paddingLeft: 0,
      fontSize: '14@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    model: {
      marginLeft: '3@s',
      color: commonColor.disabledDark
    },
    errorText: {
      color: commonColor.dangerLight
    },
    inputLabel: {
      color: commonColor.textColor,
      fontSize: '16@s'
    },
    disabledInputLabel: {
      color: commonColor.disabledDark
    },
    buttonContainer: {
      width: '95%',
      marginVertical: '20@s'
    },
    buttonDisabled: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primary,
      opacity: 0.4
    },
    buttonText: {
      color: commonColor.light
    },
    defaultContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      marginTop: '15@s',
      marginBottom: '10@s'
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      marginBottom: '5@s'
    },
    defaultCheckbox: {
      marginRight: '15@s',
      color: commonColor.containerBgColor,
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.textColor,
      marginLeft: 0
    },
    carTypeContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '95%',
      marginTop: '15@s'
    },
    radioButton: {
      marginRight: '15@s',
      borderColor: commonColor.textColor
    },
    switch: {
      marginRight: '15@s',
      color: 'red',
      transform: Platform.OS === PLATFORM.IOS ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : []
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
