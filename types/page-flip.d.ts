declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>)
    loadFromHTML(items: NodeListOf<Element>): void
    flipNext(): void
    flipPrev(): void
    flip(page: number): void
    on(event: string, callback: (e: any) => void): void
    destroy(): void
    getCurrentPageIndex(): number
  }
}
