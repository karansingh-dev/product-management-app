ALTER TABLE "product" DROP CONSTRAINT "total_dicount_check1";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "total_dicount_check2";--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "total_dicount" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "total_dicount_check1" CHECK ("product"."total_dicount" >= 0 );--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "total_dicount_check2" CHECK ("product"."total_dicount" <= "product"."total_price"  );