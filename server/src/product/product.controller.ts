import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { type Response } from 'express';
import { response } from 'src/utils/http-response';
import { Pagination, type PaginationParameters } from 'src/types';
import { isValidUUID } from 'src/utils';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    async createProduct(@Body() product: CreateProductDto, @Res() res: Response) {

        const isFinancialDataCorrect = this.productService.checkFinancialData(product);

        if (!isFinancialDataCorrect.success) {
            return response.error(res, "Invalid financial data", isFinancialDataCorrect.message, 400);
        }

        const newProduct = await this.productService.createProduct(product);

        return response.ok(res, newProduct, "Product created successfully", 200);


    }

    @Patch("/:id")
    async updateProduct(@Param() param: { id: string }, @Body() product: CreateProductDto, @Res() res: Response) {


        const isValiduuid = isValidUUID(param.id);

        if (!isValiduuid) {
            return response.error(res, "Invlaid id", "Invalid uuid format")
        }

        const productExists = await this.productService.checkProductExistsById(param.id);

        if (!productExists) {
            return response.error(res, "Product not found", "Invalid id", 404);
        }

        const isFinancialDataCorrect = this.productService.checkFinancialData(product);

        if (!isFinancialDataCorrect.success) {
            return response.error(res, "Invalid financial data", isFinancialDataCorrect.message, 400);
        }

        const updatedProduct = await this.productService.updateProductById(param.id, product);

        return response.ok(res, updatedProduct, "Product updated successfully", 201);

    }

    @Get()
    async getProducts(@Query() params: PaginationParameters, @Res() res: Response) {

        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 10;

        const offset = limit * (page - 1);

        const totalCount = await this.productService.getTotalProductsCount();

        const totalPages = Math.ceil(totalCount / limit);

        const products = await this.productService.getProducts({ limit, offset });

        const pagination: Pagination = {

            page,
            totalPages,
            totalCount,
            limit
        }

        return response.ok(res, products, "Product fetched successfully", 200, pagination);


    }


    @Get("/:id")
    async getProduct(@Param() param: { id: string }, @Res() res: Response) {

        const isValiduuid = isValidUUID(param.id);

        if (!isValiduuid) {
            return response.error(res, "Invlaid id", "Invalid uuid format")
        }

        const productExists = await this.productService.checkProductExistsById(param.id);

        if (!productExists) {
            return response.error(res, "Product not found", "Invalid id", 404);
        }

        return response.ok(res, productExists, "Product fetched successfully", 200);
    }


    @Delete("/:id")
    async softDelete(@Param() param: { id: string }, @Res() res: Response) {

        const isValiduuid = isValidUUID(param.id);

        if (!isValiduuid) {
            return response.error(res, "Invlaid id", "Invalid uuid format")
        }

        const productExists = await this.productService.checkProductExistsById(param.id);

        if (!productExists) {
            return response.error(res, "Product not found", "Invalid id", 404);
        }


        await this.productService.softDeleteProduct(param.id);

        return response.okMessage(res, "Product deleted successfully", 200);



    }





}
