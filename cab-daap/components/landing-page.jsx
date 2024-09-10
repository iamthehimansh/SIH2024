
import Link from "next/link"

export function LandingPage() {
  return (
    (<div
      className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-[#8e2de2] to-[#4a00e0]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <CarIcon className="h-6 w-6 text-white" />
          <span className="sr-only">Web3 Cab</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline underline-offset-4"
            prefetch={false}>
            Features
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline underline-offset-4"
            prefetch={false}>
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline underline-offset-4"
            prefetch={false}>
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white hover:underline underline-offset-4"
            prefetch={false}>
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section
          className="w-full py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-[#8e2de2] to-[#4a00e0]">
          <div className="container px-4 md:px-6">
            <div
              className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1
                    className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                    Revolutionize Your Ride with Web3 Cab
                  </h1>
                  <p className="max-w-[600px] text-white/80 md:text-xl">
                    Experience the future of transportation with our decentralized cab booking app, powered by
                    blockchain technology.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/Go"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#00b894] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#00b894]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}>
                    Book a Ride
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#00b894] bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#00b894] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}>
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/cab-top.png"
                  width="550"
                  height="550"
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last " />
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  {/* <div
                    className="animate-[fireworks_2s_ease-in-out_infinite] text-6xl text-[#00b894]">🎆</div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-[#8e2de2] to-[#4a00e0]">
          <div className="container px-4 md:px-6">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div
                  className="inline-block rounded-lg bg-[#00b894] px-3 py-1 text-sm text-white">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                  Discover the Power of Web3 Cab
                </h2>
                <p
                  className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our decentralized cab booking app offers a seamless and secure transportation experience, powered by
                  blockchain technology.
                </p>
              </div>
            </div>
            <div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1 text-white">
                  <h3 className="text-xl font-bold">Decentralized Payments</h3>
                  <p>Enjoy secure and transparent transactions with our blockchain-based payment system.</p>
                </div>
                <div className="grid gap-1 text-white">
                  <h3 className="text-xl font-bold">Seamless Booking</h3>
                  <p>Book your rides with ease using our intuitive and user-friendly app interface.</p>
                </div>
                <div className="grid gap-1 text-white">
                  <h3 className="text-xl font-bold">Loyalty Rewards</h3>
                  <p>Earn rewards for your rides and redeem them for future bookings or other perks.</p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/pm.png"
                  width="550"
                  height="310"
                  alt="Image"
                  className="mx-auto aspect-video overflow-hidden rounded-xl  object-center sm:w-full lg:order-last" />
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-[#8e2de2] to-[#4a00e0]">
          <div className="container px-4 md:px-6">
            <div
              className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <div
                  className="inline-block rounded-lg bg-[#00b894] px-3 py-1 text-sm text-white">
                  Secure and Reliable
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                  Trusted by Thousands of Riders
                </h2>
                <p
                  className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our decentralized cab booking app prioritizes your safety and privacy, ensuring a secure and reliable
                  transportation experience.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/Go"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#00b894] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#00b894]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}>
                    Book a Ride
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#00b894] bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#00b894] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}>
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/in.png"
                  width="550"
                  height="310"
                  alt="Image"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last" />
                <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  {/* <div
                    className="animate-[fireworks_2s_ease-in-out_infinite] text-6xl text-[#00b894]">🎆</div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/20">
        <p className="text-xs text-white/80">&copy; 2024 Web3 Cab. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs text-white hover:underline underline-offset-4"
            prefetch={false}>
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs text-white hover:underline underline-offset-4"
            prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>)
  );
}

function CarIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>)
  );
}
