"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductsList from "./ProductsList";
import Reveal from "../animations/Reveal";

const PAGE_SIZE = 6;

// Simplified helper functions
const getVal = (value) =>
  typeof value === "string"
    ? value
    : value?.slug || value?._id || value?.name || ""; //extracts the value used for filtering.

const getLabel = (value) =>
  typeof value === "string"
    ? value
    : value?.name || value?.slug || value?._id || ""; //- extracts the name displayed to customers.

const getItems = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

const getArr = (value) =>
  getItems(value) // check something present in array
    .map(getVal) // extract
    .filter(Boolean); // remove empty value

const uniqueOptions = (values) => {
  const options = new Map();
  for (const value of values) {
    const optionValue = getVal(value);
    if (optionValue && !options.has(optionValue)) {
      options.set(optionValue, { value: optionValue, label: getLabel(value) });
    } //adds a key and value.
  }
  return [...options.values()].sort((a, b) =>
    a.label.localeCompare(b.label) // stor alphabetically
  );
};

export default function ProductCatalog({
  products = [],
  path = "",
  initialFilters = {},
}) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    subcategory: initialFilters.subcategory || "",
    subsubcategory: initialFilters.subsubcategory || "",
    color: initialFilters.color || "",
    material: initialFilters.material || "",
    maxPrice: initialFilters.maxPrice || "",
    sort: initialFilters.sort || "",
  });
  const [page, setPage] = useState(1);
  
  // Sync state if the user navigates via external links or back button
  useEffect(() => {
    setFilters({
      category: initialFilters.category || "",
      subcategory: initialFilters.subcategory || "",
      subsubcategory: initialFilters.subsubcategory || "",
      color: initialFilters.color || "",
      material: initialFilters.material || "",
      maxPrice: initialFilters.maxPrice || "",
      sort: initialFilters.sort || "",
    });
    setPage(1); // Reset to page 1 on new navigation
  }, [
    // We list the individual primitive values here so React only runs this 
    // when the actual filter values from the URL change.
    initialFilters.category,
    initialFilters.subcategory,
    initialFilters.subsubcategory,
    initialFilters.color,
    initialFilters.material,
    initialFilters.maxPrice,
    initialFilters.sort,
  ]);

  // Filter & Sort Logic
  const options = useMemo(() => {
    const categoryProducts = products.filter(
      (product) =>
        !filters.category || getVal(product.parent) === filters.category
    );
    const subcategoryProducts = categoryProducts.filter(
      (product) =>
        !filters.subcategory ||
        getVal(product.subCategory) === filters.subcategory
    );

    return {
      category: uniqueOptions(products.map((product) => product.parent)),
      subcategory: uniqueOptions(
        categoryProducts.map((product) => product.subCategory)
      ),
      subsubcategory: uniqueOptions(
        subcategoryProducts.map((product) => product.subsubCategory)
      ),
      color: uniqueOptions(
        products.flatMap((product) => getItems(product.color))
      ),
      material: uniqueOptions(
        products.flatMap((product) => getItems(product.material))
      ),
    };
  }, [products, filters.category, filters.subcategory]);

  // Derived select options
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const price = Number(product.salePrice ?? product.price);
      return (
        (!filters.category || getVal(product.parent) === filters.category) &&
        (!filters.subcategory ||
          getVal(product.subCategory) === filters.subcategory) &&
        (!filters.subsubcategory ||
          getVal(product.subsubCategory) === filters.subsubcategory) &&
        (!filters.color || getArr(product.color).includes(filters.color)) &&
        (!filters.material ||
          getArr(product.material).includes(filters.material)) &&
        (!filters.maxPrice ||
          (Number.isFinite(price) && price <= Number(filters.maxPrice))) // convert string to number
      );
    });

    const sortedResult = [...result]; // create shallow copy Sorting the copy ensures the original array isn't modified.
    if (filters.sort === "price-asc") {
      sortedResult.sort(
        (a, b) =>
          Number(a.salePrice ?? a.price) - Number(b.salePrice ?? b.price)
      );
    } else if (filters.sort === "price-desc") {
      sortedResult.sort(
        (a, b) =>
          Number(b.salePrice ?? b.price) - Number(a.salePrice ?? a.price)
      );
    } else if (filters.sort === "name") {
      sortedResult.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sortedResult;
  }, [products, filters]);  {/* ?? Use salePrice if it isn't null or undefined. Otherwise, use price. */}

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
 
  // Automatically clear sub-levels when a parent level changes
  const updateFilter = (key, value) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      ...(key === "category"
        ? { subcategory: "", subsubcategory: "" }
        : {}),
      ...(key === "subcategory" ? { subsubcategory: "" } : {}),
    }; //if subcat changed or selected the parent get automatically selected

    setFilters(nextFilters);
    setPage(1);  //Whenever a filter changes, return to page 1.
                //Otherwise, the customer could be on page 5 even though the filtered results contain only one page.

    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([filterKey, value]) => {
      if (value) {
        params.set(filterKey, value);
      }
    });
    const query = params.toString();
    const newUrl = query ? `/product?${query}` : "/product";
    window.history.replaceState(null, "", newUrl); //It updates the current browser URL instantly without reloading the page or adding a new entry to the back button history.
  };  //This updates the browser URL without a complete page reload. This makes filtered product links shareable.

  const clearFilters = () => {
    setFilters({
      category: "",
      subcategory: "",
      subsubcategory: "",
      color: "",
      material: "",
      maxPrice: "",
      sort: "",
    });
    setPage(1);
    window.history.replaceState(null, "", "/product"); //It updates the current browser URL instantly without reloading the page or adding a new entry to the back button history.
  };

  const selectClass =
    "mt-2 box-border h-11 w-full rounded border border-gray-300 bg-white px-3 text-sm font-normal text-gray-800 focus:border-orange-dim focus:outline-none focus:ring-2 focus:ring-orange-dim/20";

  const filterFields = [
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
    { key: "subsubcategory", label: "Sub-subcategory" },
    { key: "color", label: "Color" },
    { key: "material", label: "Material" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-[260px_minmax(0,1fr)]">
      <Reveal
        as="aside"
        amount={0.05}
        className="h-fit rounded border border-gray-200 bg-white p-5"
      >
        <div className="mb-5 flex min-h-9 items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <h2 className="min-w-0 font-playfair text-lg font-semibold leading-6">
            Filter Products
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex shrink-0 items-center justify-center rounded px-2 py-1 text-sm leading-5 text-orange-dim transition-colors hover:bg-orange-dim/10 hover:underline"
          >
            Clear
          </button>
        </div>

        {filterFields.map(({ key, label }) => (
          <label
            key={key}
            className="mb-4 block text-left text-sm font-medium leading-5 text-gray-700 last:mb-4"
          >
            <span className="block">{label}</span>
            <select
              className={selectClass}
              value={filters[key]}
              onChange={(event) => updateFilter(key, event.target.value)}
            >
              <option value="">All {label.toLowerCase()}s</option>
              {options[key].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="mb-0 block text-left text-sm font-medium leading-5 text-gray-700">
          <span className="block">Maximum price</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="No limit"
            className={selectClass}
            value={filters.maxPrice}
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
          />
        </label>
      </Reveal>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600" aria-live="polite">
            {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
          </p>
          <label className="text-sm">
            Sort by
            <select
              className="ml-2 rounded border border-gray-300 bg-white px-3 py-2"
              value={filters.sort}
              onChange={(event) => updateFilter("sort", event.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        {visibleProducts.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProductsList data={visibleProducts} path={path} />
          </div>
        ) : (
          <p className="rounded border border-gray-200 p-8 text-center text-gray-600">
            No products match these filters.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-6 flex items-center justify-center gap-2"
            aria-label="Product pages"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="rounded border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded border px-3 py-2 text-sm ${
                    pageNumber === currentPage
                      ? "border-orange-dim bg-orange-dim text-white"
                      : "border-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="rounded border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
