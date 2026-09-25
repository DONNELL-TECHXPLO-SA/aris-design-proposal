import { useTranslations } from "next-intl";
import { SlidersHorizontal as IconAdjustmentsHorizontal } from "lucide-react";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: number; // Number of variants
  category: "laptop" | "watch" | "smartphone" | "electronics" | "accessories";
  price: string; // Price of the product (as a string with currency symbol)
  image: string; // URL or path to the product image
  status: "delivered" | "pending" | "canceled"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: 2,
    category: "laptop",
    price: "$2399.00",
    status: "delivered",
    image: "/images/product/product-01.jpg", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: 1,
    category: "watch",
    price: "$879.00",
    status: "pending",
    image: "/images/product/product-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: 2,
    category: "smartphone",
    price: "$1869.00",
    status: "delivered",
    image: "/images/product/product-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: 2,
    category: "electronics",
    price: "$1699.00",
    status: "canceled",
    image: "/images/product/product-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: 1,
    category: "accessories",
    price: "$240.00",
    status: "delivered",
    image: "/images/product/product-05.jpg", // Replace with actual image URL
  },
];

export default function RecentOrders() {
  const t = useTranslations("ecommerce.recentOrders");
  const tCommon = useTranslations("common");

  return (
    <div className="overflow-hidden rounded-card border border-line bg-card px-4 pt-4 pb-3 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-fx-20 font-medium text-ink">
            {t("title")}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-tile px-4 py-2.5 text-fx-15 font-medium text-ink hover:bg-hover hover:text-ink">
            <IconAdjustmentsHorizontal size={20} />
            {tCommon("filter")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-tile px-4 py-2.5 text-fx-15 font-medium text-ink hover:bg-hover hover:text-ink">
            {tCommon("seeAll")}
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-y border-line">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-fx-14 font-medium text-secondary"
              >
                {t("products")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-fx-14 font-medium text-secondary"
              >
                {t("category")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-fx-14 font-medium text-secondary"
              >
                {t("price")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-fx-14 font-medium text-secondary"
              >
                {t("status")}
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-line">
            {tableData.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12.5 w-12.5 overflow-hidden rounded-chip">
                      <Image
                        width={50}
                        height={50}
                        src={product.image}
                        className="h-12.5 w-12.5"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <p className="text-fx-15 font-medium text-ink">
                        {product.name}
                      </p>
                      <span className="text-fx-14 text-secondary">
                        {t("variants", { count: product.variants })}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-fx-15 text-secondary">
                  {product.price}
                </TableCell>
                <TableCell className="py-3 text-fx-15 text-secondary">
                  {t(`categories.${product.category}`)}
                </TableCell>
                <TableCell className="py-3 text-fx-15 text-secondary">
                  <Badge
                    size="sm"
                    color={
                      product.status === "delivered"
                        ? "success"
                        : product.status === "pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {t(`statuses.${product.status}`)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
