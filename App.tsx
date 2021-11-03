import {
  // CardField,
  StripeProvider,
  useStripe,
} from '@stripe/stripe-react-native';
import React, { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  Button,
  View,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

interface AppProps {}

const PUBLIC_KEY =
  'pk_test_51JKifhDyfOCkv6r5IlbV4P7VCXtB7OupZmvDwcLD0SUltOO89d3nFSPUohtFDp32lBCNHX8jrbOnrZxOzEh2cTxw00gMlMgxvb';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.homeScreen}>
      <Text>Home Screen</Text>
      <Button
        title="Go Pay"
        onPress={() => {
          navigation.navigate('Pay');
        }}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

const App: FC<AppProps> = () => {
  return (
    <StripeProvider
      publishableKey={PUBLIC_KEY}
      merchantIdentifier="merchant.identifer">
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Pay" component={StripeTest} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </StripeProvider>
  );
};

const StripeTest: FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch('http://192.168.0.103.:3000/payment-sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      googlePay: true,
      merchantCountryCode: 'US',
      testEnv: true,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View>
      <Button title="pay" onPress={openPaymentSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardField: {
    height: 50,
    width: '100%',
  },
  homeScreen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default App;
