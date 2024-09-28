import Input from "@/components/Input";
import List from "@/components/List";
import { getProductList, getSearchProductDetails } from "@/helpers/productData";
import Image from "next/image";
import React from "react";

const page = async () => {
  const data = await getProductList();

  const ListItem = ({ product }: any) => (
    <div
      key={product.id}
      className="product-card border shadow-md border-x-gray-400 p-2"
    >
      <div className="product-image-section justify-center flex">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={100}
          height={100}
        />
      </div>
      <div className="product-detail-section">{product.title}</div>
    </div>
  );
  return (
    <div>
      Product page
      <section className="product-search-section flex justify-center my-3">
        <Input
          getData={getSearchProductDetails}
          extra={
            <List
              data={data.products}
              renderItem={(product: any) => <ListItem product={product} />}
            />
          }
        />
      </section>
      <p>Total: {data.total}</p>
      <section className="grid grid-cols-4 gap-6 mx-32">
        <List
          data={data.products}
          renderItem={(product: any) => <ListItem product={product} />}
        />
      </section>
    </div>
  );
};

export default page;
