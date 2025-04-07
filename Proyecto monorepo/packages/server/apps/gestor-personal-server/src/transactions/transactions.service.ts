import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(userId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
      },
    });
  }

  async getTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async getTransactionById(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateTransaction(userId: string, id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.getTransactionById(userId, id);
    return this.prisma.transaction.update({
      where: { id: transaction.id },
      data: updateTransactionDto,
    });
  }

  async deleteTransaction(userId: string, id: string) {
    const transaction = await this.getTransactionById(userId, id);
    return this.prisma.transaction.delete({
      where: { id: transaction.id },
    });
  }

  async getTransactionStats(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
    });

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      byCategory: {},
    };

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        stats.totalIncome += transaction.amount;
      } else {
        stats.totalExpenses += transaction.amount;
        if (transaction.category) {
          stats.byCategory[transaction.category] = (stats.byCategory[transaction.category] || 0) + transaction.amount;
        }
      }
    });

    stats.balance = stats.totalIncome - stats.totalExpenses;

    return stats;
  }
} 