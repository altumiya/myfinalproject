
import Slider from "../components/home-component/Slider";
import Link from "next/link";
import AboutIcons from "../components/home-component/AboutIcons";
import CustomerFeedback from "../components/home-component/CustomerFeedback";
import Collections from "../components/home-component/Collections";
import BestSellingProduct from "../components/home-component/BestSellingProduct";
import { getProducts } from "./api-services/home.api";
import ProductFeaturedTabs from "../components/home-component/ProductFeaturedTabs";
import { getTestimonial } from "./api-services/home.api";
import Reveal from "../components/animations/Reveal";
import ParallaxImage from "../components/animations/ParallaxImage";
export default async function Home() {
const response = await getTestimonial();
  
  const testimonialArray = response.data || [];
  let data = await getProducts(); 
  const products = Array.isArray(data?.data) ? data.data : [];
  return (
    <>
      {/* Home Slider */}
      <Reveal as="section" amount={0.1}>
        <Slider />
      </Reveal>

      {/* Collection Section */}
      <Reveal as="section" className="bg-white border-b-1 border-gray-200" amount={0.2}>
        <Collections />
      </Reveal>

      {/* Product Featured tab section */}
      <Reveal as="section" amount={0.12}>
        <ProductFeaturedTabs data={products} path={data?.path || ""} />
      </Reveal>

      {/* Shopping banner */}
      <section className="relative isolate overflow-hidden">
        <ParallaxImage src="/Trends-banner.jpg" alt="" />
        <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1000px] items-center justify-center px-6 py-12 text-center sm:h-[512px] sm:min-h-0 sm:justify-start sm:py-0 sm:text-left">
            <div className="flex w-full justify-center sm:justify-start">
                <div className="w-full sm:w-auto">
                  <Reveal as="h2" className="mb-4 font-playfair text-3xl font-bold sm:text-5xl" amount={0.3} duration={0.6}>
                    New Trending Collection
                  </Reveal>
                  <Reveal as="p" className="mb-12 font-rubik text-base text-dark-gray" amount={0.3} delay={0.12} duration={0.6}>
                    We Believe That Good Design is Always in Season
                  </Reveal>
                  <Reveal as="div" amount={0.3} delay={0.24} duration={0.6} className="flex justify-center sm:justify-start">
                  <Link
                    href="/product"
                    className="inline-block border-2 border-orange-dim bg-transparent px-10 text-sm/12 font-base uppercase text-orange-dim transition-colors duration-300 hover:bg-orange-dim hover:text-white"
                  >
                    Shop Now
                  </Link>
                  </Reveal>
                </div>
            </div>
        </div>     
      </section>

      {/* BestSelling slider */}
      <Reveal as="section" className="best-selling-slider" amount={0.12}>
        <BestSellingProduct data={data} />
      </Reveal>

      {/* Shipping section */}
      <AboutIcons />

      {/* Customer Feedback */}
      <Reveal as="section" amount={0.15}>
        <div className='lg:max-w-[900px] container mx-auto py-12 px-6 text-center'>
          <CustomerFeedback data={testimonialArray}/>
        </div>
      </Reveal>

      {/* Newsletter */}
      <Reveal as="section" className="bg-gray-50" amount={0.15}>
        <div className="py-8 px-4 mx-auto max-w-[1120px] sm:py-16 lg:px-6">
          <h2 className="text-2xl font-playfair font-bold mb-2 text-center">
              Our Newsletter
          </h2>
          <p className="text-gray-500 font-rubik text-center">
            Get E-mail updates about our latest shop and special offers.
          </p>
          <div className="inline-flex w-full items-center justify-center py-8">
            <form className="inline-flex w-full max-w-[33.3125rem] font-rubik text-sm">
              <input
              type="email"
              placeholder="Email address..."
              className="min-w-0 flex-1 border-2 border-gray-200 px-4 py-3 outline-none"
              fdprocessedid="rf2zy7"
              />

              <button
                type="button"
                fdprocessedid="hwx5d7"
                className="bg-orange-dim border-2 border-orange-dim text-white px-8 py-3 hover:bg-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </Reveal>

    </>
  );
}
