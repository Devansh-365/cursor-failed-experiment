import { WaitlistForm } from "@/components/waitlist-form";
import { WaitlistStats } from "@/components/waitlist-stats";
import { ReferralStats } from "@/components/referral-stats";
// import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';


export default async function WaitlistPage() {
//   const count = await prisma.subscriber.count();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container relative mx-auto px-4 py-16 flex flex-col items-center">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Cherry</span> Waitlist
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Be among the first to experience Cherry, the next-generation spatial experience.
          </p>
          
          <div className="mb-12 w-full max-w-md mx-auto">
            <WaitlistForm />
          </div>
          
          <div className="w-full max-w-md mx-auto mb-12">
            <WaitlistStats count={0} />
          </div>

          <div className="w-full max-w-md mx-auto">
            <ReferralStats />
          </div>
        </div>
      </div>
    </div>
  );
} 