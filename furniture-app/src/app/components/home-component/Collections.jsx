import Link from 'next/link'
import Image from "next/image";
import React from 'react'
import StaggerContainer from "../animations/StaggerContainer";
import StaggerItem from "../animations/StaggerItem";

export default function Collections() {
  return (
    <>
        <div className="lg:max-w-[1140px] container mx-auto py-10 px-6 text-center">
            <StaggerContainer
                as="div"
                amount={0.2}
                stagger={0.14}
                className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0"
            >

            <StaggerItem as="figure" className="group relative mx-auto w-full max-w-sm cursor-pointer overflow-hidden filter">
                <Link href={"/"}>
                <Image width={640} height={480} sizes="(max-width: 640px) 100vw, 33vw" className="block h-auto w-full transition-transform duration-300 ease-out group-hover:scale-105" src="/banner2.webp" alt="Chair Collection" />
                </Link> 
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                <figcaption className="absolute top-5 left-0 right-0 z-20 px-4 text-center transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:left-2 sm:right-auto sm:text-left">
                    <p className="text-sm/7 text-black font-rubik">Design Creative</p>
                    <h2 className="text-2xl/7 text-black font-bold font-playfair">Chair Collection</h2>
                </figcaption>
            </StaggerItem>

            <StaggerItem as="figure" className="group relative mx-auto w-full max-w-sm cursor-pointer overflow-hidden filter">
                <Link href={"/"}>
                <Image width={640} height={480} sizes="(max-width: 640px) 100vw, 33vw" className="block h-auto w-full transition-transform duration-300 ease-out group-hover:scale-105" src="/banner1.webp" alt="Chair Collection" />
                </Link> 
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                <figcaption className="absolute top-5 left-0 right-0 z-20 px-4 text-center transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:left-2 sm:right-auto sm:text-left">
                    <p className="text-sm/7 text-black font-rubik">Bestselling Products</p>
                    <h2 className="text-2xl/7 text-black font-bold font-playfair">Chair Collection</h2>
                </figcaption>
            </StaggerItem>

            <StaggerItem as="figure" className="group relative mx-auto w-full max-w-sm cursor-pointer overflow-hidden filter">
                <Link href={"/"}>
                <Image width={640} height={480} sizes="(max-width: 640px) 100vw, 33vw" className="block h-auto w-full transition-transform duration-300 ease-out group-hover:scale-105" src="/banner2.webp" alt="Chair Collection" />
                </Link> 
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                <figcaption className="absolute top-5 left-0 right-0 z-20 px-4 text-center transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:left-2 sm:right-auto sm:text-left">
                    <p className="text-sm/7 text-black font-rubik">Onsale Products</p>
                    <h2 className="text-2xl/7 text-black font-bold font-playfair">Chair Collection</h2>
                </figcaption>
            </StaggerItem>
            </StaggerContainer>
        </div>
    </>
  )
}
