// this function gives list of product details
const url = "https://dummyjson.com/products";
export async function getProductList() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getSearchProductDetails(params: any) {
  "use server";
  try {
    const res = await fetch(url + `/search?q=${params}&limit=10`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
