import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import { useTransactions } from '../hooks/useTransactions';

export const AddTransactionScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = async () => {
    if (!amount || !description) return;

    try {
      await addTransaction({
        amount: parseFloat(amount),
        description,
        type,
        date: new Date().toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SegmentedButtons
          value={type}
          onValueChange={value => setType(value as 'income' | 'expense')}
          buttons={[
            { value: 'expense', label: 'Gasto' },
            { value: 'income', label: 'Ingreso' },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={!amount || !description}
        >
          Agregar Transacción
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 