'use client';

import { EmbedCard } from '@/components/EmbedCard';
import { Content } from '@/hooks/store';
import { useEffect, useState } from 'react';


type ShareData = {
  success: boolean;
  username: string;
  contents: Content[];
  message?: string;
};

const SHARE_REFRESH_MS = 30_000;

export default function SharedBrainPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(data);

  useEffect(() => {
    let cancelled = false;

    const fetchSharedContent = async (initial: boolean) => {
      try {
        const { hash } = await params;

        const res = await fetch(`/api/brain/share/${hash}`);

        const result = await res.json();

        if (cancelled) return;
        setData({ success: result.success, ...result.data });
      } catch (error) {
        console.error(error);
      } finally {
        if (initial && !cancelled) setLoading(false);
      }
    };

    void fetchSharedContent(true);
    const intervalId = setInterval(
      () => void fetchSharedContent(false),
      SHARE_REFRESH_MS,
    );

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-red-500">
        {data?.message || 'Invalid Share Link'}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold">
          {data.username}&apos;s Brain
        </h1>

        <p className="mb-8 text-gray-400">Shared contents collection</p>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {data.contents.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <EmbedCard isPublic data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
