import React from "react";

const NewsletterBox = () => {

  const haldleNewsletter = (e) => {
    e.preventDefault();
  };
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-600 pt-10'>Subscribe now & get 20% off!</p>

      <p className='text-gray-400 mt-3 text-l font-bold'>
        Subscribe now to  <span className="text-gray-600">Your</span><span className="text-green-600">Store</span><span className="text-green-600 text-3xl leading-8">.</span>. Clothes and enjoy 20% off your first purchase!
      </p>
      <form onSubmit={haldleNewsletter} className='w-full sm:w-1/2 flex items-center gap-3 my-10 border pl-3 m-auto '>
        <input
          required
          className='w-full sm:flex-1 outline-none'
          type='email'
          placeholder='Enter your email'
        />
        <button
          className=' bg-gray-600 hover:bg-gray-500 text-white text-xs px-10 py-4 cursor-pointer'
          type='submit'>
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
