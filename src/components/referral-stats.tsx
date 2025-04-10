'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema for the referral code
const ReferralCodeSchema = z.object({
  code: z.string().min(3, { message: 'Referral code is too short' }).max(20, { message: 'Referral code is too long' })
});

type ReferralCodeFormData = z.infer<typeof ReferralCodeSchema>;

type Referral = {
  date: string;
  email: string;
};

type ReferralStats = {
  totalReferrals: number;
  referrals: Referral[];
};

export function ReferralStats() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  
  const form = useForm<ReferralCodeFormData>({
    resolver: zodResolver(ReferralCodeSchema),
    defaultValues: {
      code: ''
    }
  });
  
  const onSubmit = async (data: ReferralCodeFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/waitlist/referrals?code=${encodeURIComponent(data.code)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setStats(result.stats);
      } else {
        setError(result.message || 'Failed to fetch referral stats');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl">
        <h3 className="text-xl font-medium text-white mb-4">Check Your Referrals</h3>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Enter your referral code"
                {...form.register('code')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                disabled={isLoading}
              />
              {form.formState.errors.code && (
                <p className="mt-1 text-sm text-red-400">{form.formState.errors.code.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-purple-600/20 transition-all duration-300 whitespace-nowrap"
            >
              {isLoading ? 'Loading...' : 'Check'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        
        {stats && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 flex items-center justify-center bg-purple-600/20 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Referrals</p>
                  <p className="text-2xl font-medium text-white">{stats.totalReferrals}</p>
                </div>
              </div>
            </div>
            
            {stats.referrals.length > 0 ? (
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Your Referrals</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.referrals.map((referral, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-white">{referral.email}</div>
                      <div className="text-sm text-white/60">
                        {new Date(referral.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-white/60 py-4">
                You don't have any referrals yet. Share your code to start earning rewards!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 