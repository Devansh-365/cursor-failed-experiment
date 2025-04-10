'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WaitlistSchema, WaitlistFormData } from '@/lib/validations/waitlist';

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(WaitlistSchema),
    defaultValues: {
      name: '',
      email: '',
      referralCode: ''
    }
  });
  
  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setFormStatus('success');
        if (result.referralCode) {
          setReferralCode(result.referralCode);
        }
        form.reset();
      } else {
        setFormStatus('error');
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
        
        // Handle validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            if (typeof message === 'object' && message && '_errors' in message) {
              form.setError(field as any, { 
                message: (message as { _errors: string[] })._errors[0] 
              });
            }
          });
        }
      }
    } catch (error) {
      setFormStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };
  
  return (
    <div className="relative p-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      {/* Background gradient blob */}
      <div className="absolute -z-10 top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-r from-purple-600/30 to-indigo-700/30 blur-3xl"></div>
      
      {formStatus === 'success' ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium tracking-tight text-white mb-2">You're on the list!</h3>
          <p className="text-white/80 mb-6">Thanks for joining our waitlist. We'll notify you when we launch.</p>
          
          {referralCode && (
            <div className="mt-4">
              <p className="text-white/80 mb-2">Share your referral code with friends:</p>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div 
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white font-mono text-lg"
                >
                  {referralCode}
                </div>
                <button
                  onClick={copyReferralCode}
                  className="p-2 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg transition-all duration-200"
                  aria-label="Copy referral code"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-white/60 text-sm">
                {copied ? 'Copied to clipboard!' : 'Share this code and earn rewards for each referral'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-white/90">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              {...form.register('name')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-white/90">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register('email')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isSubmitting}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="referralCode" className="block text-sm font-medium text-white/90">
              Referral code (optional)
            </label>
            <input
              id="referralCode"
              type="text"
              placeholder="Enter referral code"
              {...form.register('referralCode')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isSubmitting}
            />
            {form.formState.errors.referralCode && (
              <p className="text-sm text-red-400">{form.formState.errors.referralCode.message}</p>
            )}
          </div>
          
          {formStatus === 'error' && errorMessage && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 
                      bg-gradient-to-r from-purple-600 to-indigo-700 
                      hover:opacity-90 
                      text-white font-medium rounded-full 
                      shadow-lg shadow-purple-600/20
                      transition-all duration-300 
                      flex items-center justify-center
                      ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Join Waitlist'
            )}
          </button>
        </form>
      )}
    </div>
  );
} 