"use client"
import React, { useState, useEffect } from "react";

export default function FAQs() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;
  const [active, setActive] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const toggleAccordion = (index) => {
    setActive(active === index ? null : index);
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}web/faq/view`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`FAQ request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((response) => {
        if (response.status) {
          // Store the data array from your API response
          setFaqData(response.data); 
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setLoading(false);
      });
  }, [apiBaseUrl]);

  if (loading) {
    return <div className="text-center py-10">Loading FAQs...</div>;
  }

  return (
    <div className="max-w-[1140px] mx-auto py-10 px-2">
      {faqData.length === 0 ? (
        <p className="text-center text-gray-500">No FAQs available.</p>
      ) : (
        faqData.map((item, index) => {
          const isOpen = active === index;

          return (
            // Using item._id from your MongoDB as the key is best practice
            <div key={item._id || index} className="mb-4 overflow-hidden">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-4 bg-gray-100 text-gray-900 font-bold font-playfair text-sm rounded"
                aria-expanded={isOpen}
              >
                {item.question}
                <span className="text-xl leading-none font-normal">
                  {isOpen ? "-" : "+"}
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 bg-white text-gray-600 border border-orange-dim">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
