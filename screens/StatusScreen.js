import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

export default function StatusScreen() {
  const handleStatusCommand = async (commandKey) => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');

    if (!phoneNumber) {
      Alert.alert('Error', 'Please set the GSM module phone number in Settings.');
      return;
    }

    const commands = {
      relayStatus: '1234T#',
      signalLevel: '1234CSQ#',
      storedNumbers: '1234A?#',
      eventLogs: '1234LOG#',
    };

    const commandTemplate = commands[commandKey];

    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(commandTemplate)}`;

    Linking.openURL(smsUrl).catch((err) => {
      console.error('Failed to send SMS:', err);
      Alert.alert('Error', 'Failed to send SMS.');
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleStatusCommand('relayStatus')}
      >
        <Text style={styles.buttonText}>Relay Status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleStatusCommand('signalLevel')}
      >
        <Text style={styles.buttonText}>Signal Level</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleStatusCommand('storedNumbers')}
      >
        <Text style={styles.buttonText}>Stored Numbers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleStatusCommand('eventLogs')}
      >
        <Text style={styles.buttonText}>Event Logs</Text>
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
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#4CAF50',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

