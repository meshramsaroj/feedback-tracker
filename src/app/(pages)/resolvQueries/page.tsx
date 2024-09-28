import React from "react";
import axios from "axios";
import Input from "@/components/Input";

 async function getData(value: string) {
    "use server"
  const url = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2";

  const body = {
    messages: [
      {
        role: "user",
        content: value,
      },
    ],
    system_prompt: "",
    temperature: 0.9,
    top_k: 5,
    top_p: 0.9,
    max_tokens: 256,
    web_access: false,
  };


  const data = await  axios
    .post(
      url,
      body,
      {
        headers: {
          "x-rapidapi-key":
            "01d906ee37mshabedf13eeb22b77p1f75d0jsn36f71e8d7610",
          "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.message
    });
    
    console.log("res data==", data)
    return data;
}

const page =  async () => {
//   const data =  await getData();
  return (
    <div className="text-center">
      <h2 className="text-2xl">Resolve Queries</h2>
      <Input getData={getData} />
      {/* <p>{JSON.stringify(data.result)}</p> */}
    </div>
  );
};

export default page;
