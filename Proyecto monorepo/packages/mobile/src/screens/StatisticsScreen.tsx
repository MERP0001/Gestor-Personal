import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../hooks/useTransactions';
import { format, subMonths } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { transactions } = useTransactions();

  const { monthlyData, categoryData } = useMemo(() => {
    const now = new Date();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, i);
      return {
        month: format(date, 'MMM'),
        income: 0,
        expense: 0,
      };
    }).reverse();

    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = lastSixMonths.findIndex(
        m => format(date, 'MMM') === m.month
      );

      if (monthIndex !== -1) {
        if (transaction.type === 'income') {
          lastSixMonths[monthIndex].income += transaction.amount;
        } else {
          lastSixMonths[monthIndex].expense += transaction.amount;
        }
      }

      if (transaction.category) {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      }
    });

    return {
      monthlyData: lastSixMonths,
      categoryData: Object.entries(categoryTotals).map(([name, amount]) => ({
        name,
        amount,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      })),
    };
  }, [transactions]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6200ee',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Balance Mensual</Title>
          <LineChart
            data={{
              labels: monthlyData.map(d => d.month),
              datasets: [
                {
                  data: monthlyData.map(d => d.income),
                  color: (opacity = 1) => `rgba(0, 200, 0, ${opacity})`,
                },
                {
                  data: monthlyData.map(d => d.expense),
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {categoryData.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Gastos por Categoría</Title>
            <PieChart
              data={categoryData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Resumen</Title>
          <Paragraph>
            Total de transacciones: {transactions.length}
          </Paragraph>
          <Paragraph>
            Ingresos totales: ${transactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </Paragraph>
          <Paragraph>
            Gastos totales: ${transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 