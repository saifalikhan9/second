'use client';
import { deleteContent } from '@/app/actions/contents';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Content, useContentStore } from '@/hooks/store';
import { IconShare, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';

import { Button } from './ui/button';

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}

export const getYoutubeEmbedUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=
    if (parsedUrl.hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v');

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // youtu.be/
    if (parsedUrl.hostname.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.slice(1);

      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
};

function formatDateFromId(id: string): string | null {
  // Try to extract timestamp from uuid-v1 (if possible) or fallback
  // Otherwise just show nothing
  // If id is a uuidv4 or custom, we can't get date, so fallback to null.
  return null;
}

export const EmbedCard = ({
  data: { title, link, type, id, createdAt },
  isPublic = false,
}: {
  data: Content & { createdAt?: string };
  isPublic?: boolean;
}) => {
  const deleteContentStore = useContentStore().deleteContent;
  const setDeletingContent = useContentStore().setDeletingContent;
  const isDeletingContent = useContentStore().isDeletingContent(id);

  useEffect(() => {
    if (type === 'twitter' && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [type, link]);

  // Prefer explicit createdAt, else fallback (if date is not passed, try from id)
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : formatDateFromId(id);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: link,
        })
        .catch(() => {});
    } else {
      // fallback: copy link to clipboard
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard.');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDeletingContent) return;

    try {
      setDeletingContent(id, true);
      const res = await deleteContent(id);
      if (res.success === true) {
        deleteContentStore(id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingContent(id, false);
    }
  };

  return (
    <Card className="relative my-2 overflow-hidden rounded-md shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {formattedDate && (
            <div className="text-muted-foreground mt-1 text-xs">
              {formattedDate}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Share Content"
            onClick={handleShare}
          >
            <IconShare size={18} />
          </Button>

          {!isPublic && (
            <Button
              size="icon"
              variant="ghost"
              aria-label="Delete Content"
              disabled={isDeletingContent}
              onClick={() => handleDelete(id)}
            >
              {isDeletingContent ? (
                <span className="text-xs">...</span>
              ) : (
                <IconTrash size={18} />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {type === 'twitter' && (
          <blockquote className="twitter-tweet">
            <a href={link.replace('x.com', 'twitter.com')}></a>
          </blockquote>
        )}
        {type === 'youtube' && (
          <iframe
            className="w-full rounded-2xl"
            width="560"
            height="315"
            src={getYoutubeEmbedUrl(link)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
        {type === 'linkedin' && (
          <iframe
            className="w-full rounded-2xl"
            width="560"
            height="315"
            src={link}
            
          ></iframe>
        )}
      </CardContent>
    </Card>
  );
};
