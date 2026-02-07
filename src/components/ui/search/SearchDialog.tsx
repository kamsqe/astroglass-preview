import React, { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { useSearch, type SearchResult } from '../../../lib/search/useSearch';
import { useRecentSearches } from '../../../lib/search/useRecentSearches';
import { extractSnippet } from '../../../lib/search/extractSnippet';

declare global {
  interface Window {
    __SEARCH_OPEN__?: boolean;
  }
}

interface SearchLabels {
  placeholder: string;
  noResults: string;
  recentSearches: string;
  quickLinks: string;
  gettingStarted: string;
  components: string;
  themes: string;
  clear: string;
  didYouMean: string;
  loading: string;
  footerSearch: string;
  footerNavigate: string;
  footerSelect: string;
  remove: string;
  esc: string;
}

// ... imports

// Helper to normalize section keys for lookup
const normalizeSection = (section: string) => {
  // e.g. "Marketing Sections" -> "components-sections" if possible, or just look up directly
  // Actually the search index likely returns "components-ui" or the title "UI Elements"
  // Let's try to map titles back or just use the passed map if the key matches
  return section.toLowerCase().replace(/\s+/g, '-');
};

interface Props {
  locale: string;
  labels: SearchLabels;
  sectionLabels?: Record<string, string>;
}

export default function SearchDialog({ locale, labels, sectionLabels = {} }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { status, results, suggestions, search, initSearch } = useSearch({ locale });
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  // Helper to get localized section label
  const getSectionLabel = (original: string) => {
    // Try exact match
    if (sectionLabels[original]) return sectionLabels[original];
    
    // Try lowercased dashed (e.g. index returns "components-ui")
    const key = original.toLowerCase();
    if (sectionLabels[key]) return sectionLabels[key];
    
    // Fallback: Check if we can reverse-map "Marketing Sections" -> "components-sections" -> "Ru Label"
    // (This is brittle, simplifying: Assume index returns recognizable keys OR English titles that match keys)
    
    // If original is "Marketing Sections" (English title), and we are in RU, 
    // we might have a key "components-sections".
    // For now, return original if no match.
    return original;
  };

  // Listen for Open Events
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName) || ''))) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('open-search', onOpen);
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('open-search', onOpen);
      window.removeEventListener('keydown', onKeydown);
    };

  }, [open]);

  // Check global state on mount (in case clicked before hydration)
  useEffect(() => {
    if (window.__SEARCH_OPEN__) {
      setOpen(true);
    }
  }, []);

  // Sync state to global window object
  useEffect(() => {
    if (open) {
      window.__SEARCH_OPEN__ = true;
    } else {
      window.__SEARCH_OPEN__ = false;
    }
  }, [open]);

  // Lock body scroll and init search
  useEffect(() => {
    if (open) {
      initSearch();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open, initSearch]);

  const handleSelect = useCallback((item: SearchResult) => {
    addRecentSearch(query);
    setOpen(false);
    
    // Add q param
    const url = new URL(item.url, window.location.origin);
    url.searchParams.set('q', query);
    
    window.location.href = url.toString();
  }, [query, addRecentSearch]);

  const handleRecentSelect = (q: string) => {
    setQuery(q);
    search(q);
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[15vh] sm:pt-[12%] bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={() => setOpen(false)} // Explicit click outside handler
    >
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#0f0f11] shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200 search-dialog-root"
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        <Command shouldFilter={false} label="Global Search">
          {/* Search Header - Polished Border & Focus State */}
          <div className="flex items-center border-b border-white/5 px-4 py-3 bg-white/[0.02] transition-colors has-[:focus]:bg-white/[0.04] has-[:focus]:border-[hsl(var(--a)/0.3)]">
            <svg className="mr-3 h-5 w-5 text-[hsl(var(--a))] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Command.Input
              value={query}
              onValueChange={(q: string) => {
                setQuery(q);
                search(q);
              }}
              placeholder={labels.placeholder}
              className="flex-1 bg-transparent text-[16px] font-medium text-white placeholder-white/30 outline-none focus:outline-none focus:ring-0 border-none ring-0 selection:bg-[hsl(var(--a)/0.3)]"
              autoFocus
            />
            <button 
              onClick={() => setOpen(false)}
              className="ml-2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs font-semibold uppercase text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              {labels.esc}
            </button>
          </div>

          {/* Results List */}
          <Command.List className="max-h-[60vh] overflow-y-auto overflow-x-hidden p-2 scroll-py-2 bg-[#0f0f11]">
            {status === 'loading' && (
               <div className="py-12 text-center text-sm text-white/40">{labels.loading}</div>
            )}

            {status === 'ready' && !query && (
              <>
                {recentSearches.length > 0 && (
                  <Command.Group heading={labels.recentSearches} className="px-2 py-1.5 text-xs font-semibold text-white/30">
                    <div className="mb-2 flex justify-end pr-2">
                       <button onClick={clearRecentSearches} className="text-white/30 hover:text-red-400 transition-colors">{labels.clear}</button>
                    </div>
                    {recentSearches.map((q) => (
                      <div key={q} className="group relative flex items-center">
                        <Command.Item
                          onSelect={() => handleRecentSelect(q)}
                          className="flex-1 flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 aria-selected:bg-white/5 aria-selected:text-white"
                        >
                          <span className="opacity-40">🕒</span>
                          {q}
                        </Command.Item>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(q);
                          }}
                          className="absolute right-2 p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white/5"
                          title={labels.remove}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </Command.Group>
                )}
                
                <div className="mt-4 px-4 pb-4">
                   <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">{labels.quickLinks}</h3>
                   <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <QuickLink href={`/${locale === 'en' ? 'docs' : locale + '/docs'}/getting-started`} icon="⚡" label={labels.gettingStarted} />
                      <QuickLink href={`/${locale === 'en' ? 'docs' : locale + '/docs'}`} icon="🧩" label={labels.components} />
                      <QuickLink href={`/${locale === 'en' ? 'docs' : locale + '/docs'}/themes`} icon="🎨" label={labels.themes} />
                   </div>
                </div>
              </>
            )}

            <Command.Empty className="py-12 text-center">
              <div className="mb-2 text-4xl opacity-20">🔍</div>
              <p className="text-sm text-white/50">{labels.noResults}</p>
              {suggestions.length > 0 && (
                 <div className="mt-4 flex flex-col items-center gap-2">
                   <span className="text-xs text-white/40">{labels.didYouMean}</span>
                   <div className="flex gap-2">
                     {suggestions.map(s => (
                       <button 
                         key={s}
                         onClick={() => handleRecentSelect(s)}
                         className="rounded bg-white/5 px-2 py-1 text-xs text-[hsl(var(--a))] hover:bg-white/10 transition-colors"
                       >
                         {s}
                       </button>
                     ))}
                   </div>
                 </div>
              )}
            </Command.Empty>

            {results.map(({ item }) => (
              <Command.Item
                key={item.url}
                value={item.title + ' ' + item.description} 
                onSelect={() => handleSelect(item)}
                className="group relative flex cursor-default select-none items-start gap-3 rounded-xl p-3 text-sm text-white/70 transition-all border border-transparent aria-selected:bg-[hsl(var(--a)/0.08)] aria-selected:text-white aria-selected:border-[hsl(var(--a)/0.2)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg transition-colors group-aria-selected:bg-[hsl(var(--a)/0.2)] group-aria-selected:text-[hsl(var(--a))]">
                  {item.sectionIcon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white group-aria-selected:text-[hsl(var(--a))] transition-colors">{item.title}</span>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30 border border-white/5 group-aria-selected:border-[hsl(var(--a)/0.3)] group-aria-selected:text-[hsl(var(--a)/0.7)] group-aria-selected:bg-[hsl(var(--a)/0.1)] transition-colors">
                      {getSectionLabel(item.section)}
                    </span>
                  </div>
                  <p 
                    className="line-clamp-2 text-xs text-white/50 group-aria-selected:text-white/70 transition-colors"
                    dangerouslySetInnerHTML={{ __html: extractSnippet(item.content || item.description, query) }} 
                  />
                </div>
                <svg className="h-4 w-4 self-center text-[hsl(var(--a))] opacity-0 transition-all -translate-x-2 group-aria-selected:opacity-100 group-aria-selected:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Command.Item>
            ))}
          </Command.List>
          
          {/* Footer */}
          <div className="flex h-9 items-center justify-between border-t border-white/5 bg-white/[0.02] px-3 text-[10px] text-white/30">
             <span>{results.length > 0 ? `${results.length} results` : labels.footerSearch}</span>
             <div className="flex gap-4">
               <span className="flex items-center gap-1.5"><kbd className="rounded border border-white/10 bg-white/5 px-1.5 font-sans">↑↓</kbd> {labels.footerNavigate}</span>
               <span className="flex items-center gap-1.5"><kbd className="rounded border border-white/10 bg-white/5 px-1.5 font-sans">↵</kbd> {labels.footerSelect}</span>
             </div>
          </div>
        </Command>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string, icon: string, label: string }) {
  return (
    <a href={href} className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center hover:border-[hsl(var(--a)/0.3)] hover:bg-[hsl(var(--a)/0.1)] hover:text-[hsl(var(--a))] transition-all">
       <span className="text-xl">{icon}</span>
       <span className="text-xs font-medium text-white/60">{label}</span>
    </a>
  );
}
