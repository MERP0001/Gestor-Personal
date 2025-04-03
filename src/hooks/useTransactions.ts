import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, TransactionFilters } from '../types';

const STORAGE_KEY = '@transactions';
const ITEMS_PER_PAGE = 10;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadTransactions = useCallback(async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }, [transactions]);

  const getBalance = useCallback(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        acc.total = acc.income - acc.expenses;
        return acc;
      },
      { total: 0, income: 0, expenses: 0 }
    );
  }, [transactions]);

  const getRecentTransactions = useCallback((limit: number = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      if (filters.startDate && transactionDate < filters.startDate) {
        return false;
      }

      if (filters.endDate && transactionDate > filters.endDate) {
        return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filters]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const hasMoreItems = endIndex < filteredTransactions.length;
    setHasMore(hasMoreItems);
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const loadMoreTransactions = useCallback(() => {
    if (!hasMore) return;
    setCurrentPage(prev => prev + 1);
  }, [hasMore]);

  const updateFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    getBalance,
    getRecentTransactions,
    loadTransactions,
    getFilteredTransactions: () => paginatedTransactions,
    filters,
    updateFilters,
    clearFilters,
    currentPage,
    hasMore,
    loadMoreTransactions,
    ITEMS_PER_PAGE,
  };
}; 