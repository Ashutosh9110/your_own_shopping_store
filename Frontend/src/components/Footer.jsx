import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkSections = [
    {
      title: "PRODUCTS",
      links: [
        { text: "Fruits", path: "/products?category=fruits" },
        { text: "Vegetables", path: "/products?category=vegetables" },
        { text: "Electronics", path: "/products?category=electronics" },
        { text: "Watches", path: "/products?category=watches" },
      ],
    },
    {
      title: "WEBSITE",
      links: [
        { text: "Home", path: "/" },
        { text: "Privacy Policy", path: "/" },
        { text: "Become Plus Member", path: "/" },
        { text: "Create Your Store", path: "/" },
      ],
    },
    {
      title: "CONTACT",
      links: [
        { text: "+91 987-123-123", path: "/" },
        { text: "contact@shoppingstore.com", path: "/" },
        { text: "Delhi, India", path: "/" },
      ],
    },
  ];

  const socialIcons = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.9987 1.66699H12.4987C11.3936 1.66699 10.3338 2.10598 9.55242 2.88738C8.77102 3.66878 8.33203 4.72859 8.33203 5.83366V8.33366H5.83203V11.667H8.33203V18.3337H11.6654V11.667H14.1654L14.9987 8.33366H11.6654V5.83366C11.6654 5.61265 11.7532 5.40068 11.9094 5.2444C12.0657 5.08812 12.2777 5.00033 12.4987 5.00033H14.9987V1.66699Z"
            stroke="#90A1B9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "https://facebook.com",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5846 5.41699H14.593M5.83464 1.66699H14.168C16.4692 1.66699 18.3346 3.53247 18.3346 5.83366V14.167C18.3346 16.4682 16.4692 18.3337 14.168 18.3337H5.83464C3.53345 18.3337 1.66797 16.4682 1.66797 14.167V5.83366C1.66797 3.53247 3.53345 1.66699 5.83464 1.66699ZM13.3346 9.47533C13.4375 10.1689 13.319 10.8772 12.9961 11.4995C12.6732 12.1218 12.1623 12.6265 11.536 12.9417C10.9097 13.2569 10.2 13.3667 9.50779 13.2553C8.81557 13.1439 8.1761 12.8171 7.68033 12.3213C7.18457 11.8255 6.85775 11.1861 6.74636 10.4938C6.63497 9.80162 6.74469 9.0919 7.05991 8.46564C7.37512 7.83937 7.87979 7.32844 8.50212 7.00553C9.12445 6.68261 9.83276 6.56415 10.5263 6.66699C11.2337 6.7719 11.8887 7.10154 12.3944 7.60725C12.9001 8.11295 13.2297 8.76789 13.3346 9.47533Z"
            stroke="#90A1B9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "https://instagram.com",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3346 3.33368C18.3346 3.33368 17.7513 5.08368 16.668 6.16701C18.0013 14.5003 8.83464 20.5837 1.66797 15.8337C3.5013 15.917 5.33464 15.3337 6.66797 14.167C2.5013 12.917 0.417969 8.00034 2.5013 4.16701C4.33464 6.33368 7.16797 7.58368 10.0013 7.50034C9.2513 4.00034 13.3346 2.00034 15.8346 4.33368C16.7513 4.33368 18.3346 3.33368 18.3346 3.33368Z"
            stroke="#90A1B9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "https://twitter.com",
    },
  ];

  return (
    <footer className="bg-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-200 text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Brand + description */}
          <div>
            <Link to="/" className="text-4xl font-bold text-gray-800">
              Your<span className="text-green-600">Store</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Discover the best deals on electronics, groceries, and lifestyle
              essentials — all in one place.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:scale-105 transition-transform"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-8 md:gap-16">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-800 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.path}
                        className="hover:underline hover:text-green-600 transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-center text-gray-500 mt-10 border-t pt-6">
          © {new Date().getFullYear()} Your Own Shopping Store — All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
