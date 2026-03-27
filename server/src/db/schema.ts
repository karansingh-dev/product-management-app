import { sql } from "drizzle-orm";
import { check, decimal } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { pgTable, text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";



export const product = pgTable("product", {
 id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  orderId:text("order_id").notNull(),
  title:text("title").notNull(),
  description:text("description"),
  quantity:integer("quantity").notNull(),
  totalPrice:decimal("total_price",{precision:10,scale:2,mode:"number"}).notNull(),
  totalDiscount:decimal("total_dicount",{precision:10,scale:2,mode:"number"}).notNull(),
 createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
,
deletedAt :timestamp("deleted_at")
},
(table) => [
    check("quantity_check", sql`${table.quantity} > 0`),
    check("total_price_check", sql`${table.totalPrice} >= 0`),
    check("total_dicount_check1", sql`${table.totalDiscount} >= 0 `),
    check("total_dicount_check2", sql`${table.totalDiscount} <= ${table.totalPrice}  `),
  ]);


