import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deviceName, setDeviceName] = useState('');

  const [openCommand, setOpenCommand] = useState('');
  const [holdOpenCommand, setHoldOpenCommand] = useState('');
  const [closeCommand, setCloseCommand] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      const storedDeviceName = await AsyncStorage.getItem('deviceName');

      const storedOpenCommand = await AsyncStorage.getItem('openCommand');
      const storedHoldOpenCommand = await AsyncStorage.getItem('holdOpenCommand');
      const storedCloseCommand = await AsyncStorage.getItem('closeCommand');

      if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
      if (storedDeviceName) setDeviceName(storedDeviceName);

      setOpenCommand(storedOpenCommand || '1234GON##');
      setHoldOpenCommand(storedHoldOpenCommand || '1234GOT999#');
      setCloseCommand(storedCloseCommand || '1234GOFF##');
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    await AsyncStorage.setItem('deviceName', deviceName);

    await AsyncStorage.setItem('openCommand', openCommand);
    await AsyncStorage.setItem('holdOpenCommand', holdOpenCommand);
    await AsyncStorage.setItem('closeCommand', closeCommand);

    Alert.alert('Success', 'Settings saved successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Device Name:</Text>
      <TextInput
        style={styles.input}
        value={deviceName}
        onChangeText={setDeviceName}
      />

      <Text style={styles.label}>GSM Module Phone Number:</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Open Command:</Text>
      <TextInput
        style={styles.input}
        value={openCommand}
        onChangeText={setOpenCommand}
      />

      <Text style={styles.label}>Hold Open Command:</Text>
      <TextInput
        style={styles.input}
        value={holdOpenCommand}
        onChangeText={setHoldOpenCommand}
      />

      <Text style={styles.label}>Close Command:</Text>
      <TextInput
        style={styles.input}
        value={closeCommand}
        onChangeText={setCloseCommand}
      />

      <TouchableOpacity style={styles.button} onPress={saveSettings}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  button: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

