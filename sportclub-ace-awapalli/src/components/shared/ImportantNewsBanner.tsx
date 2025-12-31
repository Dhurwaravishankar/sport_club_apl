import React, { useEffect, useState } from 'react';
import { sb } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

const ImportantNewsBanner = () => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await sb.from('news').select('*').eq('is_important', true).order('date', { ascending: false }).limit(3);
      if (!error) setItems(data ?? []);
    })();
  }, []);
  if (items.length === 0) return null;
  return (
    <section className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-md mb-6">
      <h3 className="font-semibold mb-2">Important Updates</h3>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <strong>{i.title}</strong>
                <Badge variant="destructive">Important</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{i.category} • {new Date(i.date).toLocaleDateString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ImportantNewsBanner;