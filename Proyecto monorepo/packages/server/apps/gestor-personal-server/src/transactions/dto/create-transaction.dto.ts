import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Amount of the transaction' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Type of transaction (income or expense)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Description of the transaction' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Category of the transaction', required: false })
  @IsString()
  @IsOptional()
  category?: string;
} 