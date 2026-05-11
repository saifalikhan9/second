"use client";

import { EmbedCard } from "@/components/EmbedCard";
import { GooeyInput } from "@/components/GlooeyInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContentStore, type Content } from "@/hooks/store";
import { BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconPlusFilled, IconShare, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { createContent, getContent, searchContent } from "../actions/contents";
import { share } from "../actions/share";

const CONTENT_REFRESH_MS = 30_000;

export default function Page() {
  const contents = useContentStore().content;

  const setContents = useContentStore().setContents;
  const isInitialLoading = useContentStore().isInitialLoading;
  const isSavingContent = useContentStore().isSavingContent;
  const setIsInitialLoading = useContentStore().setIsInitialLoading;

  const [open, setOpen] = useState(false);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchedContents, setSearchedContents] = useState<Content[]>([]);
  const [selectedSearchContentId, setSelectedSearchContentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchContents(initial: boolean) {
      try {
        if (initial) setIsInitialLoading(true);

        const data = await getContent();
        if (cancelled) return;
        if (data.success !== true) {
          throw new Error("failed to fetch the contents");
        }
        setIsUsingLocalFallback(false);
        setContents(data.data);
      } catch (error) {
        console.log(error);
        if (cancelled) return;
        // Keep persisted Zustand data visible when API fails.
        if (useContentStore.getState().content.length > 0) {
          setIsUsingLocalFallback(true);
          return;
        }
      } finally {
        if (initial && !cancelled) setIsInitialLoading(false);
      }
    }

    void fetchContents(true);

    const intervalId = setInterval(
      () => void fetchContents(false),
      CONTENT_REFRESH_MS,
    );

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [setContents, setIsInitialLoading]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    let cancelled = false;

    if (!trimmedQuery) {
      setSearchedContents([]);
      setIsSearching(false);
      setSelectedSearchContentId(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);

      try {
        const data = await searchContent(trimmedQuery, 20);
        console.log(data);
        
        if (cancelled) return;
        if (data.success !== true) {
          throw new Error("failed to search contents");
        }
        const nextResults = data.data ?? [];
        setSearchedContents(nextResults);
        setSelectedSearchContentId((prev) =>
          prev && nextResults.some((item: Content) => item.id === prev) ? prev : null,
        );
      } catch (error) {
        console.log(error);
        if (cancelled) return;
        setSearchedContents([]);
        setSelectedSearchContentId(null);
      } finally {
        if (cancelled) return;
        setIsSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;
  const selectedSearchContent = selectedSearchContentId
    ? contents.find((item) => item.id === selectedSearchContentId) ?? null
    : null;
  const displayedContents = selectedSearchContent ? [selectedSearchContent] : contents;

  return (
    <div className="relative w-full">
      {open && <NewContentCard setOpen={setOpen} />}

      <div className="mx-2 p-4">
        <nav className="bg-accent flex items-center justify-between rounded-xl px-4 py-3">
          <div className="relative mr-4 w-full max-w-xl">
            <GooeyInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search semantically..."
            />

            {isSearchActive && (
              <div className="bg-background absolute top-full z-20 mt-2 w-full rounded-md border shadow-md">
                {isSearching ? (
                  <p className="text-muted-foreground px-3 py-2 text-sm">Searching...</p>
                ) : searchedContents.length === 0 ? (
                  <p className="text-muted-foreground px-3 py-2 text-sm">
                    No related titles found.
                  </p>
                ) : (
                  <ul className="max-h-64 overflow-y-auto">
                    {searchedContents.map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "hover:bg-muted border-b px-3 py-2 text-sm last:border-b-0",
                          selectedSearchContentId === item.id && "bg-muted",
                        )}
                        onClick={() => setSelectedSearchContentId(item.id)}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={async () => {
                try {
                  const res = await share(true);
                  console.log(res);
                  if (res.success === true) {
                    alert(`${BASE_URL}/share/${res.data.hash}`);
                  }
                } catch (error) {
                  console.log(error);
                  alert("failed");
                }
              }}
              variant="outline"
            >
              <IconShare />
              <span>share brain</span>
            </Button>

            <Button onClick={() => setOpen(true)} disabled={isSavingContent}>
              <IconPlusFilled />
              <span>add content</span>
            </Button>
          </div>
        </nav>

        <div className="bg-accent my-4 rounded-xl p-4">
          {isUsingLocalFallback && (
            <div className="mb-4 rounded-md border border-amber-300 bg-amber-100 p-3 text-sm text-amber-900">
              API fetch failed. Showing your locally saved content.
            </div>
          )}

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {isInitialLoading ? (
              <div className="mb-4 flex h-40 break-inside-avoid flex-col items-center justify-center text-center">
                <h2 className="text-lg font-semibold">Loading content...</h2>
                <p className="text-muted-foreground text-sm">
                  Please wait while we fetch your saved links.
                </p>
              </div>
            ) : displayedContents.length === 0 ? (
              <div className="mb-4 flex h-40 break-inside-avoid flex-col items-center justify-center text-center">
                <h2 className="text-lg font-semibold">No content found</h2>
                <p className="text-muted-foreground text-sm">
                  Start by adding your first content.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setOpen(true)}
                  disabled={isSavingContent}
                >
                  <IconPlusFilled />
                  <span>Add Content</span>
                </Button>
              </div>
            ) : (
              displayedContents.map((e) => (
                <div key={e.id} className="mb-4 break-inside-avoid">
                  <EmbedCard data={e} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const NewContentCard = ({ setOpen }: { setOpen: (val: boolean) => void }) => {
  const addContent = useContentStore().addContent;

  const isSavingContent = useContentStore().isSavingContent;

  const setIsSavingContent = useContentStore().setIsSavingContent;

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    type: "twitter",
  });

  const handleSubmit = async (_data: FormData) => {
    if (isSavingContent) return;

    try {
      if (!formData.title || !formData.link) {
        alert("Please provide valid fields");
        return;
      }

      if (!isValidUrl(formData.link)) {
        alert("Please enter a valid URL");
        return;
      }

      if (formData.type === "linkedin") {
        if (!isValidLinkedInEmbedUrl(formData.link)) {
          alert("Please enter a valid LinkedIn embed URL");
          return;
        }
      }

      setIsSavingContent(true);

      // api call here
      const data = await createContent(formData);

      if (!data?.success || !data?.data) {
        throw new Error("Failed to create content");
      }

      addContent(data.data);
      setFormData({
        title: "",
        link: "",
        type: "twitter",
      });

      setOpen(false);
    } catch (error) {
      console.log(error);
      alert("failed to create content");
    } finally {
      setIsSavingContent(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create new Content</CardTitle>

          <Button
            size="icon"
            variant="ghost"
            disabled={isSavingContent}
            onClick={() => setOpen(false)}
          >
            <IconX size={18} />
          </Button>
        </CardHeader>

        <CardContent>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>

              <Input
                id="link"
                placeholder="Paste YouTube or Twitter link"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    link: e.target.value,
                  }))
                }
              />
            </div>

            {formData.type === "linkedin" && (
              <div className="rounded-md border border-amber-300 bg-amber-100 px-3 py-3 text-sm text-amber-900">
                <p className="font-medium">LinkedIn requires an embed URL.</p>

                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Open the LinkedIn post.</li>
                  <li>Click the three dots (•••).</li>
                  <li>
                    Select <strong>Embed this post</strong>.
                  </li>
                  <li>Copy the URL from the embed code.</li>
                </ol>

                <div className="mt-2 rounded bg-black/10 p-2 font-mono text-xs break-all">
                  https://www.linkedin.com/embed/feed/update/...
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Content Type</Label>

              <div className="flex flex-wrap gap-2">
                {["twitter", "youtube", "linkedin"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type,
                      }))
                    }
                    className={cn(
                      `${formData.type === type ? "bg-primary text-white" : ""} rounded px-2 py-1 capitalize shadow transition-all duration-150 ease-in-out`,
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSavingContent}>
              {isSavingContent ? "Saving..." : "Create Content"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidLinkedInEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);

    const validHost =
      parsed.hostname === "www.linkedin.com" ||
      parsed.hostname === "linkedin.com";

    const isEmbed = parsed.pathname.includes("/embed/");

    return validHost && isEmbed;
  } catch {
    return false;
  }
};
