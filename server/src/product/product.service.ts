import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectDb } from 'src/db/db.provider';
import {type DB } from 'src/db/client';
import { product } from 'src/db/schema';
import { count, eq,isNull,ne } from 'drizzle-orm';
import { PaginationParameters } from 'src/types';


@Injectable()
export class ProductService {
 constructor(@InjectDb() private readonly db: DB) { } 


async getTotalProductsCount(){
    const productCount =  await this.db.select({ count: count() }).from(product);
    return productCount[0].count;

}

async softDeleteProduct(id:string){
    
    const deletedProduct = await this.db.delete(product).where(eq(product.id,id)).returning();
    return deletedProduct[0];
}

 async createProduct(productData:CreateProductDto){

    const data = {
        orderId:"00000",
        title:productData.title,
        totalPrice:productData.totalPrice,
        totalDiscount:productData.totalDiscount,
        quantity:productData.quantity,
        description:productData.description,
    }
   const newProduct = await this.db.insert(product).values(data).returning();
    return newProduct[0];
 }

 async checkProductExistsById(id:string){
    const data = await this.db.select().from(product).where(eq(product.id,id));

    return data[0];



 }

 async getProducts(pagination:{limit:number,offset:number}){
    const products =  await this.db.select().from(product).where(isNull(product.deletedAt)).limit(pagination.limit).offset(pagination.offset);
    return products;
 }

 async updateProductById(id:string,productData:CreateProductDto){
    const data = {
        title:productData.title,
        totalPrice:productData.totalPrice,
        totalDiscount:productData.totalDiscount,
        quantity:productData.quantity,
        description:productData.description,
    }
   const updatedProduct = await this.db.update(product).set(data).where(eq(product.id,id)).returning();
    return updatedProduct[0];

 }


    checkFinancialData (data:CreateProductDto){

        if (data.quantity <= 0) {
      return {
        message: "Quantity of product can't be zero",
        success: false,
      };
    }
    if (data.totalDiscount < 0) {
      return {
        message: "Total discount can't be less than zero",
        success: false,
      };
    }
    if (data.totalDiscount > data.totalPrice) {
      return {
        message: "Total discount can't be greater than total price",
        success: false,
      };
    }
    return {
      message: 'Data is correct',
      success: true,
    };


    }
}
