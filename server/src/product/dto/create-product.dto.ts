import { IsDecimal, IsIn, IsInt, IsNotEmpty, IsOptional, min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsInt()
  quantity: number;

 @IsDecimal()
  totalPrice: number;
 @IsDecimal()
  totalDiscount: number;
}