import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { LayoutProps } from '@/lib/magazine/types';

const registry: Record<string, ComponentType<LayoutProps>> = {
  // ── Aurora Editorial (are-*) ─────────────────────────────────────────────
  'are-cover':    dynamic(() => import('./aurora-editorial/AuroraCover')),
  'are-contents': dynamic(() => import('./aurora-editorial/AuroraContents')),
  'are-intro':    dynamic(() => import('./aurora-editorial/AuroraIntro')),
  'are-feature':  dynamic(() => import('./aurora-editorial/AuroraFeature')),
  'are-gallery':  dynamic(() => import('./aurora-editorial/AuroraGallery')),
  'are-story':    dynamic(() => import('./aurora-editorial/AuroraStory')),
  'are-quote':    dynamic(() => import('./aurora-editorial/AuroraQuote')),
  'are-back':     dynamic(() => import('./aurora-editorial/AuroraBack')),
  // ── Wanderbook Editorial (we-*) ─────────────────────────────────────────
  'we-cover':   dynamic(() => import('./wanderbook-editorial/WECover')),
  'we-toc':     dynamic(() => import('./wanderbook-editorial/WEToc')),
  'we-intro':   dynamic(() => import('./wanderbook-editorial/WEIntro')),
  'we-feature': dynamic(() => import('./wanderbook-editorial/WEFeature')),
  'we-gallery': dynamic(() => import('./wanderbook-editorial/WEGallery')),
  'we-story':   dynamic(() => import('./wanderbook-editorial/WEStory')),
  'we-quote':   dynamic(() => import('./wanderbook-editorial/WEQuote')),
  'we-back':    dynamic(() => import('./wanderbook-editorial/WEBack')),
  // ── Atlas Nocturne Editorial (ane-*) ─────────────────────────────────────
  'ane-cover':    dynamic(() => import('./atlas-nocturne/ANECover')),
  'ane-contents': dynamic(() => import('./atlas-nocturne/ANEContents')),
  'ane-letter':   dynamic(() => import('./atlas-nocturne/ANELetter')),
  'ane-hero':     dynamic(() => import('./atlas-nocturne/ANEHero')),
  'ane-route':    dynamic(() => import('./atlas-nocturne/ANERoute')),
  'ane-gallery':  dynamic(() => import('./atlas-nocturne/ANEGallery')),
  'ane-quote':    dynamic(() => import('./atlas-nocturne/ANEQuote')),
  'ane-back':     dynamic(() => import('./atlas-nocturne/ANEBack')),
  'wt-cover': dynamic(() => import('./wander-together/WTCover')),
  'wt-contents': dynamic(() => import('./wander-together/WTContents')),
  'wt-welcome': dynamic(() => import('./wander-together/WTWelcome')),
  'wt-destination': dynamic(() => import('./wander-together/WTDestination')),
  'wt-taste': dynamic(() => import('./wander-together/WTTaste')),
  'wt-memories': dynamic(() => import('./wander-together/WTMemories')),
  'wt-quote': dynamic(() => import('./wander-together/WTQuote')),
  'wt-back-cover': dynamic(() => import('./wander-together/WTBackCover')),
  'bb-cover': dynamic(() => import('./blue-bold/BBCover')),
  'bb-contents': dynamic(() => import('./blue-bold/BBContents')),
  'bb-intro': dynamic(() => import('./blue-bold/BBIntro')),
  'bb-about': dynamic(() => import('./blue-bold/BBAbout')),
  'bb-story': dynamic(() => import('./blue-bold/BBStory')),
  'bb-discovery': dynamic(() => import('./blue-bold/BBDiscovery')),
  'bb-highlights': dynamic(() => import('./blue-bold/BBHighlights')),
  'bb-back-cover': dynamic(() => import('./blue-bold/BBBackCover')),
  'ex-cover': dynamic(() => import('./explore-editorial/EXCover')),
  'ex-opener': dynamic(() => import('./explore-editorial/EXOpener')),
  'ex-masthead': dynamic(() => import('./explore-editorial/EXMasthead')),
  'ex-contents': dynamic(() => import('./explore-editorial/EXContents')),
  'ex-destination': dynamic(() => import('./explore-editorial/EXDestination')),
  'ex-region': dynamic(() => import('./explore-editorial/EXRegion')),
  'ex-culture': dynamic(() => import('./explore-editorial/EXCulture')),
  'ex-back-cover': dynamic(() => import('./explore-editorial/EXBackCover')),
  'tm-cover': dynamic(() => import('./travel-minimal/TMCover')),
  'tm-contents': dynamic(() => import('./travel-minimal/TMContents')),
  'tm-intro': dynamic(() => import('./travel-minimal/TMIntro')),
  'tm-about': dynamic(() => import('./travel-minimal/TMAbout')),
  'tm-photo-grid': dynamic(() => import('./travel-minimal/TMPhotoGrid')),
  'tm-manual': dynamic(() => import('./travel-minimal/TMManual')),
  'tm-services': dynamic(() => import('./travel-minimal/TMServices')),
  'tm-back-cover': dynamic(() => import('./travel-minimal/TMBackCover')),
  'rb-cover': dynamic(() => import('./red-bold/RBCover')),
  'rb-contents': dynamic(() => import('./red-bold/RBContents')),
  'rb-masthead': dynamic(() => import('./red-bold/RBMasthead')),
  'rb-story': dynamic(() => import('./red-bold/RBStory')),
  'rb-feature': dynamic(() => import('./red-bold/RBFeature')),
  'rb-grid': dynamic(() => import('./red-bold/RBGrid')),
  'rb-quote': dynamic(() => import('./red-bold/RBQuote')),
  'rb-back-cover': dynamic(() => import('./red-bold/RBBackCover')),
  'gb-cover': dynamic(() => import('./green-beige/GBCover')),
  'gb-contents': dynamic(() => import('./green-beige/GBContents')),
  'gb-letter': dynamic(() => import('./green-beige/GBLetter')),
  'gb-article': dynamic(() => import('./green-beige/GBArticle')),
  'gb-article2': dynamic(() => import('./green-beige/GBArticle2')),
  'gb-collage': dynamic(() => import('./green-beige/GBCollage')),
  'gb-memories': dynamic(() => import('./green-beige/GBMemories')),
  'gb-back-cover': dynamic(() => import('./green-beige/GBBackCover')),
  // Red Bold — HTML-derived slot layout (from /tmp/red-edit.html)
  'rb-html-cover':    dynamic(() => import('./red-bold-html/RBHCover')),
  'rb-html-contents': dynamic(() => import('./red-bold-html/RBHContents')),
  'rb-html-story':    dynamic(() => import('./red-bold-html/RBHStory')),
  'rb-html-feature':  dynamic(() => import('./red-bold-html/RBHFeature')),
  'rb-html-essay':    dynamic(() => import('./red-bold-html/RBHEssay')),
  'rb-html-gallery':  dynamic(() => import('./red-bold-html/RBHGallery')),
  'rb-html-quote':    dynamic(() => import('./red-bold-html/RBHQuote')),
  'rb-html-back':     dynamic(() => import('./red-bold-html/RBHBack')),
};

const FallbackLayout = dynamic(() => import('./FallbackLayout'));

export function getLayout(layoutKey: string): ComponentType<LayoutProps> {
  const found = registry[layoutKey];
  if (!found) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(`[layout-registry] Unknown layout id: "${layoutKey}" — rendering fallback`);
    }
    return FallbackLayout;
  }
  return found;
}
