"use client";
import React, { useState } from "react";

const Carousel = () => {
  const offset = 20;
  const data = Array(55).fill(1);
  const [start, setStart] = useState(0);

  const handlePrev = () => {
    console.log(start);

    if (start != 0) {
      setStart((prev) => prev - offset);
    } else {
      console.log(
        "reached to the min length of list",
        start,
        start + data.length - offset
      );
      setStart((prev) => prev + data.length - offset);
    }
  };

  const handleNext = () => {
    if (start + offset < data.length) {
      setStart((prev) => prev + offset);
    } else {
      console.log("end of the list", start, (start + offset) % data.length);
      setStart((start + offset) % data.length);
    }
  };
  return (
    <section className="flex justify-center gap-4">
      <button onClick={handlePrev}>Prev</button>
      <div className="grid-container grid grid-cols-5 grid-rows-2 ">
        {data.slice(start, start + offset).map((val, index) => (
          <div
            key={val * (index + 1)}
            className={`p-4 border border-red-500 border-collapse bg-blue-300`}
          >
            {val * index + start + 1}
          </div>
        ))}
      </div>
      <button onClick={handleNext}>Next</button>
    </section>
  );
};

export default Carousel;
