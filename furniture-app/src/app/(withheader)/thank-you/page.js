import Link from "next/link";
import { MdCheckCircleOutline } from "react-icons/md";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-sm border border-[#ebdfd1] bg-white p-8 text-center shadow-sm sm:p-12">
        <MdCheckCircleOutline className="mx-auto h-16 w-16 text-green-600" aria-hidden="true" />
        <h1 className="mt-5 font-playfair text-4xl font-semibold text-dark-gray">
          Thank you for your order!
        </h1>
        <p className="mt-4 font-rubik text-sm leading-6 text-gray-600">
          Your order has been confirmed. We’ll notify you when it is on its way.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-2xl bg-orange-dim px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a9724d]"
        >
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
