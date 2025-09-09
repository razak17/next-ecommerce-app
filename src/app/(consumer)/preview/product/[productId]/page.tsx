import { redirect } from "next/navigation";

export default async function ProductPreviewPage({
  params,
}: PageProps<"/preview/product/[productId]">) {
  const { productId } = await params;

  redirect(`/product/${productId}`);
}
