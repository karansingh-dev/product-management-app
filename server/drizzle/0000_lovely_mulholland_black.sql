CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"quantity" integer NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "quantity_check" CHECK ("product"."quantity" > 0),
	CONSTRAINT "total_price_check" CHECK ("product"."total_price" >= 0),
	CONSTRAINT "total_dicount_check1" CHECK ("product"."total_price" >= 0 ),
	CONSTRAINT "total_dicount_check2" CHECK ("product"."total_price" <= "product"."total_price"  )
);
