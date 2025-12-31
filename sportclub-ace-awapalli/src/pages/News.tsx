import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { sb } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type NewsItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  is_important: boolean;
};

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_NEWS_API_URL as string | undefined;
  const gnewsKey = import.meta.env.VITE_GNEWS_API_KEY as string | undefined;

  const normalize = (item: any): NewsItem => ({
    id: String(item.id ?? item._id ?? item.uuid ?? item.url ?? Math.random()),
    title: item.title ?? item.heading ?? item.name ?? '',
    description: item.description ?? item.body ?? item.content ?? item.summary ?? '',
    date: item.date ?? item.created_at ?? item.published_at ?? item.publishedAt ?? new Date().toISOString(),
    category: item.category ?? item.type ?? item.source?.name ?? 'Sports News',
    is_important: item.is_important ?? item.isImportant ?? item.important ?? false,
  });

  const fetchFromApi = async (url: string) => {
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    if (data && Array.isArray(data.articles)) {
      return data.articles.map((a: any) =>
        normalize({
          id: a.url,
          title: a.title,
          description: a.description ?? a.content ?? '',
          date: a.publishedAt ?? a.published_at ?? new Date().toISOString(),
          category: a.source?.name ?? 'Sports News',
          is_important: false,
        })
      );
    }

    if (Array.isArray(data)) return data.map(normalize);

    throw new Error('API returned unexpected shape');
  };

  const buildGNewsUrl = () => {
    if (!gnewsKey) return undefined;
    return `https://gnews.io/api/v4/top-headlines?topic=sports&lang=en&token=${encodeURIComponent(gnewsKey)}`;
  };

  const fetchFromSupabase = async () => {
    const { data, error } = await sb.from('news').select('*');
    if (error) throw error;
    return (data ?? []).map(normalize);
  };

  const fetchNews = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let items: NewsItem[] = [];
      const gUrl = buildGNewsUrl();
      const useUrl = apiUrl ?? gUrl;

      if (useUrl) {
        try {
          items = await fetchFromApi(useUrl);
        } catch (apiErr) {
          console.warn('News API failed, falling back to Supabase:', apiErr);
          items = await fetchFromSupabase();
        }
      } else {
        items = await fetchFromSupabase();
      }

      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNews(items);
    } catch (err: any) {
      console.error('fetch news error', err);
      setNews([]);
      setErrorMsg(err?.message || 'Unknown error fetching news');
      toast({ title: 'Load error', description: err?.message || 'Could not load news', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const sample: NewsItem = {
    id: 'sample-1',
    title: 'Sample: Match Scheduled at Mini Stadium',
    description: 'Tomorrow: Local football match at Mini Stadium. Volunteers required. (This is a sample fallback.)',
    date: new Date().toISOString(),
    category: 'Match Update',
    is_important: true,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-heading">News</h1>
          <p className="text-sm text-muted-foreground mt-1">Latest sports updates — important items highlighted.</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : errorMsg ? (
          <div className="bg-card p-4 rounded-md border border-border">
            <p className="text-destructive mb-3">Error loading news: {errorMsg}</p>
            <div className="flex gap-2">
              <button onClick={fetchNews} className="px-3 py-2 rounded bg-primary text-primary-foreground">Retry</button>
              <button onClick={() => setErrorMsg(null)} className="px-3 py-2 rounded border">Dismiss</button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Check DevTools → Network for request details (gnews.io / supabase).</p>
          </div>
        ) : news.length === 0 ? (
          <>
            <p className="text-muted-foreground">No news items yet. Showing a sample below.</p>
            <ul className="space-y-6 mt-4">
              <li key={sample.id} className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{sample.title}</h3>
                      {sample.is_important && <Badge variant="destructive">Important</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{sample.category} • {format(new Date(sample.date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <p className="mt-3 text-foreground whitespace-pre-line">{sample.description}</p>
              </li>
            </ul>
          </>
        ) : (
          <ul className="space-y-6">
            {news.map((n) => (
              <li key={n.id} className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{n.title}</h3>
                      {n.is_important && <Badge variant="destructive">Important</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {n.category} • {format(new Date(n.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-foreground whitespace-pre-line">{n.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default News;