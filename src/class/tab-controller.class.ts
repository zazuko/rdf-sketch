import { Tab } from "@/model/tab.model";
import { nanoid } from "nanoid";
import { ref, Ref, toRaw } from "vue";


class TabController {
    tabs: Ref<Tab[]> = ref<Tab[]>([]);
    selectedTabId: Ref<string> = ref<string>(null);
    justSaved = ref(false)
    selectedTab: Ref<Tab> = ref<Tab>(null);
    private _tabsLocalStoreKey = 'sketchy.tabs';
    private _currentTabLocalStoreKey = 'sketchy.currentTab';

    constructor() {
        const tabsJson = localStorage.getItem(this._tabsLocalStoreKey);
        const tabs = JSON.parse(tabsJson ?? '[]');
        if (tabs.length === 0) {
            this.addTab()
            return
        }
        // json schema validation ?
        this.tabs.value = tabs;
        const selectedTabId = localStorage.getItem(this._currentTabLocalStoreKey);
        if (!selectedTabId) {
            const firstTabId = this.tabs.value[0].id
            this.selectTab(firstTabId)
            return;
        }
        const tabsWithSelectedTabId = this.tabs.value.filter(t => t.id === selectedTabId)
        if (tabsWithSelectedTabId.length !== 1) {
            this.tabs.value = [];
            this.addTab()
            return
        }
        this.selectedTab.value = tabsWithSelectedTabId[0]
        this.selectedTabId.value = selectedTabId;
    }

    /**
     * Add a new Tab. 
     * @returns the new Tab
     */
    addTab(): Tab {
        const tabId = nanoid()
        const newTab: Tab = { id: tabId, label: 'Untitled', format: 'text/turtle', content: '' }
        this.tabs.value.push(newTab)
        this.selectedTabId.value = tabId
        this.selectedTab.value = newTab
        this.saveTabs()
        return newTab
    }

    /**
     * This will remove a tab. And add a new empty tab if it was the last tab.
     * 
     * @param tabId id of the Tab to delete
     */
    deleteTab(tabId: string): void {
        if (!window.confirm('Are you sure?')) {
            return
        }
        this.tabs.value = this.tabs.value.filter((tab) => tab.id !== tabId)
        if (this.tabs.value.length === 0) {
            this.addTab()
            return
        }
        if (this.selectedTabId.value === tabId) {
            this.selectTab(this.tabs.value[0].id)
        }
        this.saveTabs()
    }

    /**
     * Save tabs to localStore.
     */
    saveTabs(): void {
        const tabs = toRaw(this.tabs.value);
        const tabsJson = JSON.stringify(tabs);
        localStorage.setItem(this._tabsLocalStoreKey, tabsJson)
    }

    /**
     * This will set the selected.
     * 
     * @param tabId id of the selected tab
     */
    selectTab(tabId: string): void {
        const foundTabs = this.tabs.value.filter(t => t.id === tabId)
        if (foundTabs.length !== 1) {
            localStorage.clear()
            window.location.reload()
        }
        this.selectedTabId.value = tabId
        this.selectedTab.value = foundTabs[0]
        localStorage.setItem(this._currentTabLocalStoreKey, tabId)
    }

    /**
     * 
     * @param tab 
     * @param label 
     */
    updateTabName(tab: Tab, label: string): void {
        tab.label = label
        this.saveTabs()
    }
}

export const TabsController = new TabController();
