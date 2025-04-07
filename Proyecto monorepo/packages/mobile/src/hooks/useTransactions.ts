import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category?: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const calculateBalance = useCallback((transactions: Transaction[]) => {
    return transactions.reduce((total, transaction) => {
      return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data);
      setBalance(calculateBalance(response.data));
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Fallback to local storage if API fails
      const localData = await AsyncStorage.getItem('transactions');
      if (localData) {
        const parsedData = JSON.parse(localData);
        setTransactions(parsedData);
        setBalance(calculateBalance(parsedData));
      }
    } finally {
      setLoading(false);
    }
  }, [calculateBalance]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await api.post('/transactions', transaction);
      const newTransaction = response.data;
      setTransactions(prev => [...prev, newTransaction]);
      setBalance(prev => prev + (newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount));
      
      // Update local storage
      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Fallback to local storage if API fails
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      setBalance(prev => prev + (newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount));
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      return newTransaction;
    }
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      setBalance(calculateBalance(updatedTransactions));
      
      // Update local storage
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Fallback to local storage if API fails
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      setBalance(calculateBalance(updatedTransactions));
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
  }, [transactions, calculateBalance]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    balance,
    addTransaction,
    deleteTransaction,
    loadTransactions,
  };
}; 