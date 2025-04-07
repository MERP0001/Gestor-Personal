import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTransactions } from '../hooks/useTransactions';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { transactions, balance, loading } = useTransactions();

  const renderTransaction = ({ item }) => (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <Title>{item.description}</Title>
        <Paragraph>
          {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
        </Paragraph>
        <Paragraph>{new Date(item.date).toLocaleDateString()}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance Total</Text>
        <Text style={[styles.balanceAmount, { color: balance >= 0 ? 'green' : 'red' }]}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Transaction')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  list: {
    flex: 1,
  },
  transactionCard: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
}); 