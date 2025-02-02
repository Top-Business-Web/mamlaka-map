import { defineStore } from 'pinia';

interface PageNavigationStore {
  currentPageId: number;
}

export const usePageNavigationStore = defineStore('PageNavigationStore', {
  state: (): PageNavigationStore => ({
    currentPageId: 1
  })
});
