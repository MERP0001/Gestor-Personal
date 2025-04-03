import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Platform } from 'react-native';
import { Text, Card, FAB, IconButton, Portal, Modal, Button, SegmentedButtons } from 'react-native-paper';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, TransactionType, TransactionFilters } from '../types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FiltersModalProps {
  visible: boolean;
  onDismiss: () => void;
  filters: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
  onClear: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = React.memo(({ 
  visible, 
  onDismiss, 
  filters, 
  onApply, 
  onClear 
}) => {
  const [tempFilters, setTempFilters] = useState<TransactionFilters>(filters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleApply = useCallback(() => {
    onApply(tempFilters);
  }, [tempFilters, onApply]);

  const handleTypeChange = useCallback((value: string) => {
    setTempFilters(prev => ({ ...prev, type: value as TransactionType }));
  }, []);

  const handleDateChange = useCallback((event: any, date?: Date, isStartDate: boolean = true) => {
    const setDatePicker = (show: boolean) => {
      if (isStartDate) {
        setShowStartDatePicker(show);
      } else {
        setShowEndDatePicker(show);
      }
    };

    if (Platform.OS === 'android') {
      setDatePicker(false);
    }

    if (event.type === 'set' && date) {
      if (isStartDate) {
        setTempFilters(prev => ({ ...prev, startDate: date }));
      } else {
        setTempFilters(prev => ({ ...prev, endDate: date }));
      }
    }
  }, []);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContent}
      >
        <Text variant="titleLarge" style={styles.modalTitle}>Filtros</Text>
        
        <SegmentedButtons
          value={tempFilters.type || ''}
          onValueChange={handleTypeChange}
          buttons={[
            { value: '', label: 'Todos' },
            { value: 'income', label: 'Ingresos' },
            { value: 'expense', label: 'Gastos' },
          ]}
          style={styles.filterSection}
        />

        <View style={styles.dateSection}>
          <Text variant="bodyMedium">Fecha Inicial</Text>
          <Button
            mode="outlined"
            onPress={() => setShowStartDatePicker(true)}
            style={styles.dateButton}
          >
            {tempFilters.startDate 
              ? new Date(tempFilters.startDate).toLocaleDateString()
              : 'Seleccionar fecha'}
          </Button>
        </View>

        <View style={styles.dateSection}>
          <Text variant="bodyMedium">Fecha Final</Text>
          <Button
            mode="outlined"
            onPress={() => setShowEndDatePicker(true)}
            style={styles.dateButton}
          >
            {tempFilters.endDate 
              ? new Date(tempFilters.endDate).toLocaleDateString()
              : 'Seleccionar fecha'}
          </Button>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={onClear}
            style={styles.modalButton}
          >
            Limpiar
          </Button>
          <Button
            mode="contained"
            onPress={handleApply}
            style={styles.modalButton}
          >
            Aplicar
          </Button>
        </View>

        {(showStartDatePicker || showEndDatePicker) && (
          <DateTimePicker
            testID="datePicker"
            value={showStartDatePicker 
              ? (tempFilters.startDate || new Date())
              : (tempFilters.endDate || new Date())}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, showStartDatePicker)}
          />
        )}
      </Modal>
    </Portal>
  );
});

const TransactionItem: React.FC<{ item: Transaction; onDelete: (id: string) => void }> = React.memo(({ item, onDelete }) => (
  <Card style={styles.transactionCard}>
    <Card.Content>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text variant="titleMedium">{item.description}</Text>
          <Text variant="bodySmall">{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.transactionActions}>
          <Text
            variant="titleMedium"
            style={{
              color: item.type === 'income' ? 'green' : 'red',
              marginRight: 8,
            }}
          >
            ${item.amount.toFixed(2)}
          </Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(item.id)}
          />
        </View>
      </View>
    </Card.Content>
  </Card>
));

export const TransactionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { 
    transactions, 
    loading, 
    deleteTransaction, 
    loadTransactions,
    getFilteredTransactions,
    filters,
    updateFilters,
    clearFilters,
    currentPage,
    hasMore,
    loadMoreTransactions,
  } = useTransactions();

  const [showFilters, setShowFilters] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  const handleApplyFilters = useCallback((newFilters: TransactionFilters) => {
    updateFilters(newFilters);
    setShowFilters(false);
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setShowFilters(false);
  }, [clearFilters]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMoreTransactions();
    }
  }, [loading, hasMore, loadMoreTransactions]);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }, [hasMore]);

  const filteredTransactions = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);

  if (loading && currentPage === 1) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando transacciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">
          {filters.type ? `${filters.type === 'income' ? 'Ingresos' : 'Gastos'}` : 'Todas las transacciones'}
        </Text>
        <IconButton
          icon="filter"
          size={24}
          onPress={() => setShowFilters(true)}
        />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={deleteTransaction} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No hay transacciones</Text>
          </View>
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      />
      <FiltersModal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionCard: {
    margin: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateButton: {
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
}); 