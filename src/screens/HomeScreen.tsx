import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useTransactions } from '../hooks/useTransactions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import { Transaction } from '../types';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const { getBalance, getRecentTransactions, transactions, loadTransactions } = useTransactions();
  const balance = getBalance();
  const recentTransactions = getRecentTransactions();

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text variant="bodyMedium" numberOfLines={1} style={styles.description}>
          {item.description}
        </Text>
        <Text variant="bodySmall" style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text
        variant="bodyMedium"
        style={[
          styles.amount,
          { color: item.type === 'income' ? 'green' : 'red' }
        ]}
      >
        ${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="titleLarge">Balance Total</Text>
          <Text variant="displaySmall" style={{ color: balance.total >= 0 ? 'green' : 'red' }}>
            ${balance.total.toFixed(2)}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Text variant="bodyMedium">Ingresos</Text>
              <Text variant="titleMedium" style={{ color: 'green' }}>
                ${balance.income.toFixed(2)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Text variant="bodyMedium">Gastos</Text>
              <Text variant="titleMedium" style={{ color: 'red' }}>
                ${balance.expenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <IconButton
          icon="eye"
          onPress={() => navigation.navigate('Transactions')}
          style={[styles.actionButton, { backgroundColor: '#6B46C1' }]}
          iconColor="white"
          size={24}
        />
        <IconButton
          icon="plus"
          onPress={() => navigation.navigate('AddTransaction')}
          style={[styles.actionButton, { backgroundColor: '#6B46C1' }]}
          iconColor="white"
          size={24}
        />
      </View>

      <Card style={styles.recentTransactionsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.recentTitle}>
            Transacciones Recientes
          </Text>
          {recentTransactions.length > 0 ? (
            <FlatList
              data={recentTransactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.transactionsList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No hay transacciones recientes
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  balanceItem: {
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  recentTransactionsCard: {
    flex: 1,
  },
  recentTitle: {
    marginBottom: 12,
  },
  transactionsList: {
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    marginBottom: 2,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  amount: {
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
}); 