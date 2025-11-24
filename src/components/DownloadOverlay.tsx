import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export type ExportStatus = 'idle' | 'loading' | 'success' | 'error';

interface DownloadOverlayProps {
  status: ExportStatus;
  messages: {
    loading: string;
    success: string;
    error: string;
  };
}

export default function DownloadOverlay({ status, messages }: DownloadOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === 'idle') return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-70 flex items-center justify-center backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-scale-in min-w-[200px] border border-gray-100 dark:border-gray-800">
        {status === 'loading' && (
          <>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Loader2 size={40} className="text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg">{messages.loading}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-full">
              <CheckCircle2 size={40} className="text-green-600 dark:text-green-400 animate-scale-in" />
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg">{messages.success}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
              <XCircle size={40} className="text-red-600 dark:text-red-400 animate-scale-in" />
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg">{messages.error}</p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
