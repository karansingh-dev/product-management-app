import { api } from "@/lib/axios";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/schemas";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import BasicLoader from "../atoms/basic-loader";

export interface Product {
  id: string;
  orderId: string;
  title: string;
  description: string | null;
  quantity: number;
  totalPrice: number;
  totalDiscount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(0);

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await api<Product[]>("GET", "/product", {
        params: { page, limit },
      });

      if (!res.success) {
        toast.error("Failed to fetch products");
        return;
      }

      setProducts(res.data);
      setTotalPages(res.pagination?.totalPages ?? 0);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [page]);

  function handlePrev() {
    if (page > 1 && !loading) {
      setPage((p) => p - 1);
    }
  }

  function handleNext() {
    if (page < totalPages && !loading) {
      setPage((p) => p + 1);
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar products={products} setProducts={setProducts} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Page heading + search */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Products</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {!loading && `${products.length} products on this page`}
            </p>
          </div>

          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" />
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-xl border bg-card ring-1 ring-foreground/[0.06] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product
                </TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Description
                </TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Qty
                </TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Price
                </TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Discount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <SkeletonRows />
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="group hover:cursor-pointer transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="py-3.5 font-medium pl-4">
                      {product.title}
                    </TableCell>

                    <TableCell className="py-3.5 max-w-[280px] truncate text-muted-foreground">
                      {product.description || (
                        <span className="italic text-muted-foreground/50">
                          No description
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5 text-right tabular-nums">
                      {product.quantity}
                    </TableCell>

                    <TableCell className="py-3.5 text-right font-medium tabular-nums">
                      {formatCurrency(product.totalPrice)}
                    </TableCell>

                    <TableCell className="py-3.5 text-right pr-8 tabular-nums ">
                      {product.totalDiscount > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                          -{formatCurrency(product.totalDiscount)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">--</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && totalPages > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <PageNumbers
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleNext}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TopBar({ products, setProducts }: { products: Product[], setProducts: (products: Product[]) => void }) {

  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight bitcount-prop-double">Product</div>
            <div className="text-sm font-semibold tracking-tight">
              Management App
            </div>
          </div>
        </div>
        <AddProductDialog open={open} setOpen={setOpen} products={products} setProducts={setProducts} />
      </div>
    </header>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="py-3.5">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </TableCell>
          <TableCell className="py-3.5">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </TableCell>
          <TableCell className="py-3.5 text-right">
            <div className="ml-auto h-4 w-8 animate-pulse rounded bg-muted" />
          </TableCell>
          <TableCell className="py-3.5 text-right">
            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
          </TableCell>
          <TableCell className="py-3.5 text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">No products yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by adding your first product.
      </p>
      <Button size="sm" className="mt-4 gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Add Product
      </Button>
    </div>
  );
}

function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center gap-0.5">
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-7 w-7 items-center justify-center text-xs text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === currentPage ? "secondary" : "ghost"}
            size="icon-sm"
            className="text-xs"
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </Button>
        ),
      )}
    </div>
  );
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}


export function AddProductDialog({ products, setProducts, open, setOpen }: { products: Product[], setProducts: (products: Product[]) => void, open: boolean, setOpen: (open: boolean) => void }) {


  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      totalPrice: 0,
      totalDiscount: 0,
      quantity: 1,
      pricePerItem: 0,
    }
  });

  const totalPrice = watch("pricePerItem") * watch("quantity");

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setValue("totalDiscount", 0);
      toast.error("Discount can't be less than zero");
    } else {
      if (value > totalPrice) {
        setValue("totalDiscount", totalPrice);
        toast.error("Discount can't be greater than total price");
      } else {
        setValue("totalDiscount", value);
      }
      setValue("totalDiscount", value);
    }
  }

  const createProduct = async (data: ProductFormData, setProducts: (products: Product[]) => void, products: Product[]) => {
    try {

     
      const payload = {
        title: data.title,
        description: data.description,
        totalPrice: totalPrice,
        totalDiscount: data.totalDiscount,
        quantity: data.quantity,
      }
      const res = await api<Product>("POST", "/product", { data: payload });
      if (res.success) {
        setProducts([...products, res.data]);
        reset();
        toast.success("Product created successfully");
        setOpen(false);
      } else {
        toast.error("Failed to create product");
        reset();

      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }




  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    await createProduct(data, setProducts, products);
  }



  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <form>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Add a new product and click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form id="product-form" onSubmit={handleSubmit(onSubmit)} >
            <div className="flex gap-4">



              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" {...register("quantity", { valueAsNumber: true })} type="number" step="1" min="1" />
                  {errors.quantity && <p className="text-red-500 text-xs ">{errors.quantity.message}</p>}
                </div>

              </div>


              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Price</Label>
                  <Input id="totalPrice"  {...register("pricePerItem", { valueAsNumber: true })} type="number" step="0.01" min="0" />
                  {errors.pricePerItem && <p className="text-red-500 text-xs">{errors.pricePerItem.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalDiscount">Total Discount</Label>
                  <Input id="totalDiscount" onChange={handleDiscountChange} type="number" step="0.01" min="0" max={Number(totalPrice)} />
                  {errors.totalDiscount && <p className="text-red-500 text-xs">{errors.totalDiscount.message}</p>}
                </div>

              </div>

            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="totalPrice">Total Price</Label>
              <Input id="totalPrice" value={totalPrice || "--"} readOnly />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>
          </form>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button form="product-form" className="cursor-pointer" type="submit" disabled={isLoading}>{isLoading ? <BasicLoader /> : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}


export default ProductPage;
