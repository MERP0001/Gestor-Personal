import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../hooks/useTransactions';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 1.5; // Hacemos el gráfico más ancho para permitir scroll

export const StatisticsScreen = () => {
  const { transactions } = useTransactions();

  // Datos para el gráfico de gastos por mes
  const monthlyData = useMemo(() => {
    const monthlyExpenses = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === currentYear && transaction.type === 'expense') {
        monthlyExpenses[date.getMonth()] += transaction.amount;
      }
    });

    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        data: monthlyExpenses,
      }],
    };
  }, [transactions]);

  // Datos para el gráfico circular de ingresos vs gastos
  const incomeExpenseData = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      {
        name: 'Ingresos',
        amount: totalIncome,
        color: '#4CAF50',
        legendFontColor: '#7F7F7F',
      },
      {
        name: 'Gastos',
        amount: totalExpenses,
        color: '#F44336',
        legendFontColor: '#7F7F7F',
      },
    ];
  }, [transactions]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>Gastos por Mes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={monthlyData}
              width={chartWidth}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
              withDots={false}
              withInnerLines={false}
              withOuterLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              segments={5}
              yAxisLabel="$"
              yAxisInterval={1}
              fromZero
            />
          </ScrollView>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>Ingresos vs Gastos</Text>
          <PieChart
            data={incomeExpenseData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 