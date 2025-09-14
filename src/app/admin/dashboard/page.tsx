import { format } from "date-fns";
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import { formatNumber, formatPrice } from "@/lib/utils";

import { Shell } from "@/components/shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OverviewCard } from "@/features/analytics/components/overview-card";
import { getDashboardStats } from "@/features/orders/queries/orders";

export default async function AdminHome() {
  const {
    totalProducts,
    totalOrders,
    totalRevenue,
    totalCustomers,
    lowInventoryProducts,
    recentOrders,
  } = await getDashboardStats();

  return (
    <Shell className="flex flex-col gap-6">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="font-bold text-2xl">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your e-commerce platform
          </p>
        </div>

        {/* Overview Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Revenue"
            value={formatPrice(totalRevenue)}
            description="All-time revenue"
            icon="dollarSign"
          />
          <OverviewCard
            title="Total Orders"
            value={formatNumber(totalOrders)}
            description="All orders received"
            icon="cart"
          />
          <OverviewCard
            title="Active Products"
            value={formatNumber(totalProducts)}
            description="Products in catalog"
            icon="package"
          />
          <OverviewCard
            title="Customers"
            value={formatNumber(totalCustomers)}
            description="Unique customers"
            icon="users"
          />
        </div>

        {/* Low Inventory Alert */}
        {lowInventoryProducts.length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">
              Low Inventory Alert
            </AlertTitle>
            <AlertDescription className="text-orange-700">
              {lowInventoryProducts.length} product(s) have low inventory (≤10
              items)
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-sm">{order.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {order.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatPrice(Number(order.amount))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "succeeded"
                                ? "default"
                                : order.status === "processing"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(order.createdAt), "MMM dd")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  No orders yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Low Inventory Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Low Inventory</CardTitle>
                <CardDescription>Products running low on stock</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">Manage Products</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {lowInventoryProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowInventoryProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="max-w-xs truncate font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {product.category}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.inventory === 0
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {product.inventory} left
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  All products have adequate stock
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-lg">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" />
                  Products
                </CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </CardTitle>
                <CardDescription>View and process orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/orders">View Orders</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </CardTitle>
                <CardDescription>View detailed analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Categories
                </CardTitle>
                <CardDescription>Organize product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/categories">Manage Categories</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
