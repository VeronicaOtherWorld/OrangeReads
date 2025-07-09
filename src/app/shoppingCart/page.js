"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
export default function ShoppingCart() {
  const cartItems = [
    {
      id: 1,
      title: "Until August",
      author: "Gabriel García Márquez",
      price: 28.3,
      quantity: 1,
      image: "/until-august.jpg",
    },
    {
      id: 2,
      title: "1984",
      author: "Gabriel García Márquez",
      price: 11.9,
      quantity: 1,
      image: "/until-august.jpg",
    },
    {
      id: 3,
      title: "little prince",
      author: "Gabriel García Márquez",
      price: 23.0,
      quantity: 1,
      image: "/until-august.jpg",
    },
  ];
  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-4 md:px-16 lg:px-32 py-10">
        {/*title*/}
        <h1 className="text-4xl font-bold text-center mb-10">shopping cart</h1>

        {/*tables*/}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 text-xs font-semibold border-b py-2 text-center">
            <div>type</div>
            <div>item</div>
            <div>price</div>
            <div>quantity</div>
            <div>total</div>
          </div>
        </div>
        {cartItems.map((item) => (
          <div className="">
            <div
              key={item.id}
              className="grid grid-cols-5 items-center py-4 border-b text-sm text-center"
            >
              {/* type */}
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-20 object-cover mx-auto rounded"
                />
              </div>

              {/* item title author */}
              <div className="text-left pl-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500 text-xs">{item.author}</p>
              </div>

              {/* price */}
              <div>€{item.price.toFixed(2)}</div>

              {/* quantity */}
              <div>
                <div className="flex justify-center items-center gap-2">
                  <button className="px-2">-</button>
                  <span>{item.quantity}</span>
                  <button className="px-2">+</button>
                </div>
                <button className="text-xs text-red-500 mt-3">remove</button>
              </div>

              {/* total */}
              <div>€{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 md-px-32 lg-px-32">
        {/*subtotal*/}
        <div className="flex justify-end mt-6 text-sm font-medium">
          <span className="mr-2">substotal:</span>
          <span>
            €{" "}
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </span>
        </div>
        {/*checkout*/}
        <div className="flex justify-end mt-4 mb-16">
          <button className="bg-black text-white px-6 py-2 rounded">
            checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
