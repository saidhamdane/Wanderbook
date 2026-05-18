import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { LayoutProps } from '@/lib/magazine/types';

const registry: Record<string, ComponentType<LayoutProps>> = {
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
  'tm-back-cover': dynamic(() => import('./travel-minimal/TMBackCover'))
};

export function getLayout(layoutKey: string): ComponentType<LayoutProps> | null {
  return registry[layoutKey] ?? null;
}
