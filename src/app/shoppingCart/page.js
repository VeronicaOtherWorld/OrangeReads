"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";

export default function ShoppingCart() {
  // router
  const router = useRouter();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

  // checkout logic
  const [isPaying, setIsPaying] = useState(false);

  // userid
  const { user, checking } = useUser();
  const userId = user?.userId;

  useEffect(() => {
    if (!checking && !user) {
      toast.error("please login");
      router.push("/login");
    }
  }, [checking, user, router]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!userId) {
      toast.error("Please login to continue");
      return;
    }
    // paying
    setIsPaying(true);

    // post endpoint
    //start checking out
    try {
      const res = await myAxios.post("/checkout", { userId, cartItems });
      toast.success("Payment successful!");
      clearCart();
      router.push("/readingmap?paid=true");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsPaying(false);
    }
  };
  if (checking || !userId) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Header />

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="text-3xl mb-4">Your shopping cart is empty</div>
          <Link href="/filterByCountry">
            <button className="bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 cursor-pointer">
              Browse Books
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="px-4 md:px-16 lg:px-32 py-10">
            {/*title*/}
            <h1 className="text-4xl font-bold text-center mb-10">
              shopping cart
            </h1>

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
              <div key={item.id}>
                <div className="grid grid-cols-5 items-center py-4 border-b text-sm text-center">
                  {/* type */}
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      const query = new URLSearchParams({
                        title: item.title,
                        author: item.author,
                        cover: item.cover,
                        nationality: item.nationality,
                        price: item.price.toString(),
                        description: item.description,
                      }).toString();
                      router.push(`book/${item.id}?${query}`);
                    }}
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-20 object-cover mx-auto rounded"
                    />
                  </div>

                  {/* item title author */}
                  <div
                    className="text-left pl-2"
                    onClick={() => router.push(`/book/${item.id}`)}
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.author}</p>
                  </div>

                  {/* price */}
                  <div>€{item.price.toFixed(2)}</div>

                  {/* quantity */}
                  <div>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="px-2 cursor-pointer"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 cursor-pointer"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs text-red-500 mt-3 cursor-pointer"
                      onClick={() => removeFromCart(item.id)}
                    >
                      remove
                    </button>
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
              <span className="mr-2">substotal:€</span>
              <span>
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            {/*checkout*/}
            <div className="flex justify-end mt-4 mb-16">
              <button
                className="bg-black text-white px-6 py-2 rounded cursor-pointer"
                onClick={handleCheckout}
                disabled={isPaying}
              >
                checkout
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
