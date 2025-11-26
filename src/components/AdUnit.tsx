'use client';

import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  client?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdUnit({
  client = 'ca-pub-7619120582243963', // Default to the user's client ID
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' }
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      // Check if the ad is already loaded in this container to prevent duplicate pushes
      if (adRef.current && adRef.current.innerHTML === '') {
         adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container my-4 overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
