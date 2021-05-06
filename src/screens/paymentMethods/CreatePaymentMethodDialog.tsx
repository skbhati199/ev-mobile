import {
  CardField,
  CardFieldInput,
  PaymentMethodCreateParams,
  useConfirmSetupIntent
} from '@stripe/stripe-react-native';
import { Button, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import { BillingOperationResponse } from '../../types/ActionResponse';
import BaseProps from '../../types/BaseProps';

import Utils from '../../utils/Utils';
import computeStyleSheet from './PaymentMethodsStyle';

interface Props extends BaseProps {
  close: () => void;
}

/**
 *
 */
export default function CreatePaymentMethodDialog(props: Props) {
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details>(null);
  const [provider, setProvider] = useState<CentralServerProvider>(null);
  const [ userID, setUserID ] = useState<string>(null);

  async function getProvider() {
    return ProviderFactory.getProvider();
  }

  useEffect(() => {
    async function setUp() {
      setProvider(await getProvider());
      setUserID(provider.getUserInfo().id);
    }
    setUp();
  }, [provider]);

  const addPaymentMethod = async (): Promise<void> => {
    const response: BillingOperationResponse = await provider.setUpPaymentMethod({ userID });
    const setUpIntent: any = response?.internalData;

    console.log('###########################################\n');
    console.log(setUpIntent);

    const clientSecret = setUpIntent?.client_secret;
    if (!clientSecret) {
      console.log('Unexpected situation - client secret is null - check the billing settings!!!');
    } else {
      console.log('Client secret is properly set!');

      console.log('Now calling confirmSetupIntent!');
      const { error, setupIntent: setupIntentResult } = await confirmSetupIntent(clientSecret, {
        type: 'Card'
      });

      if (error) {
        console.log('Setup intent confirmation error',error.code,  error.message);
      } else if (setupIntentResult) {
        console.log(`Success: Setup intent created. Intent status: ${setupIntentResult.status}`);
        // TODO - call the backend to set the new payment method as the default one
      }
      console.log(setupIntentResult);

      const attachResponse: BillingOperationResponse = await provider.attachPaymentMethod({
        setupIntentId: setupIntentResult?.id,
        paymentMethodId: setupIntentResult?.paymentMethodId,
        userID
      });

      if(attachResponse?.succeeded) {
        props.close();
      }
    }
  };

  const style = computeStyleSheet();
  const commonColor = Utils.getCurrentCommonColor();
  // Render
  return (
    <Modal onBackdropPress={props.close} isVisible={true}>
      <View style={style.modalContent}>
        <Text style={style.modalTitle}>Ajouter une méthode de paiement</Text>
        <CardField postalCodeEnabled={false} style={style.cardField} />
        <View style={style.buttonContainer}>
          <Button style={style.button} light block onPress={async () => addPaymentMethod()}>
            <Text style={style.buttonText}>Sauvegarder</Text>
          </Button>
          <Button style={style.button} light block onPress={() => props.close()}>
            <Text style={style.buttonText}>Annuler</Text>
          </Button>
        </View>

      </View>
    </Modal>
  );
}
