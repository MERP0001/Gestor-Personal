import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({ description: 'Amount of the transaction', required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ description: 'Type of transaction (income or expense)', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Description of the transaction', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Category of the transaction', required: false })
  @IsString()
  @IsOptional()
  category?: string;
} 