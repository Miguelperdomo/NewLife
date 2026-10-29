import { createClient } from "@/lib/supabase/client";

export interface PageViewRow {
  path: string;
  viewCount: number;
}

interface RawPageViewRow {
  path: string;
  view_count: number;
}

/** Conteo de visitas por página, más vistas primero. */
export async function loadPageViews(): Promise<PageViewRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("page_views")
    .select("path, view_count")
    .order("view_count", { ascending: false });

  if (error || !data) return [];
  return (data as RawPageViewRow[]).map((row) => ({ path: row.path, viewCount: row.view_count }));
}
