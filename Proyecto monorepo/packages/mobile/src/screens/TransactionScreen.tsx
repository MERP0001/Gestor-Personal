import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTransactions } from '../hooks/useTransactions';

export default function TransactionScreen() {
  const navigation = useNavigation();
  const { addTransaction } = useTransactions();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || !description) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    try {
      await addTransaction({
        amount: numericAmount,
        description,
        type: type as 'income' | 'expense',
        category: category || undefined,
        date: new Date().toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      setError('Error al guardar la transacción');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          error={!!error}
        />

        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          error={!!error}
        />

        <TextInput
          label="Categoría (opcional)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <SegmentedButtons
          value={type}
          onValueChange={setType}
          buttons={[
            { value: 'expense', label: 'Gasto' },
            { value: 'income', label: 'Ingreso' },
          ]}
          style={styles.segmentedButtons}
        />

        {error ? <HelperText type="error">{error}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#6200ee',
  },
}); 