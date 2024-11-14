import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [deviceName, setDeviceName] = useState('GSM Relay');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      const storedDeviceName = await AsyncStorage.getItem('deviceName');

      if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
      if (storedDeviceName) setDeviceName(storedDeviceName);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadSettings();
    });

    return unsubscribe;
  }, [navigation]);

  const handleCommand = async (commandKey) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please set the GSM module phone number in Settings.');
      return;
    }

    const commandTemplate = await AsyncStorage.getItem(commandKey);

    if (!commandTemplate) {
      Alert.alert('Error', 'Command template not found. Please set it in Settings.');
      return;
    }

    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(commandTemplate)}`;

    Linking.openURL(smsUrl).catch((err) => {
      console.error('Failed to send SMS:', err);
      Alert.alert('Error', 'Failed to send SMS.');
    });
  };

  const handleSwitchSite = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.deviceName}>{deviceName}</Text>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCommand('openCommand')}
      >
        <Text style={styles.buttonText}>Open</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCommand('holdOpenCommand')}
      >
        <Text style={styles.buttonText}>Hold Open</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCommand('closeCommand')}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={handleSwitchSite}>
        <Text style={styles.switchButtonText}>Switch Site</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: '70%',
    padding: 20,
    backgroundColor: '#2196F3',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  switchButton: {
    marginTop: 30,
  },
  switchButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
});

