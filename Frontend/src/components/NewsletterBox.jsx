import React from "react";

const NewsletterBox = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center py-12">
      <p className="text-2xl font-medium text-gray-600">
        Subscribe now & get 20% off!
      </p>

      <p className="text-gray-400 mt-3 text-base font-semibold">
        Subscribe now to{" "}
        <span className="text-gray-200">Your</span>
        <span className="text-green-500">Store</span>
        <span className="text-green-500 text-2xl">.</span> and enjoy 20%
        off your first purchase!
      </p>

      <form
        onSubmit={handleNewsletter}
        className="w-full sm:w-[450px] mx-auto mt-10 flex items-center border border-green-500 rounded-full overflow-hidden"
      >
        <input
          required
          type="email"
          placeholder="Enter your email"
          className="flex-grow text-gray-500 placeholder-gray-400 px-6 py-3 outline-none"
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600 transition-all duration-200 cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
