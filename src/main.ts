import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
interface PluginSettings {
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  leftPin: boolean;
  rightPin: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
  leftSidebarWidth: 252,
  rightSidebarWidth: 252,
  leftPin: false,
  rightPin: false,
};

export default class SidebarExpandOnHoverPlugin extends Plugin {
  settings: PluginSettings;
  leftRibbon: HTMLElement;
  rightRibbon: HTMLElement;
  leftSidebar: HTMLElement;
  rightSidebar: HTMLElement;

  async onload() {
    // Initialize and set events when layout is fully ready
    this.app.workspace.onLayoutReady(() => {
      this.loadSettings().then(() => {
        this.initialize();
        this.setEvents();
        this.addSettingTab(new MyPluginSettingTab(this.app, this));
        // This timeout is needed to override Obsidian sidebar state at launch
        setTimeout(() => {
          if (this.settings.leftPin) {
            this.expandSidebar(this.leftSidebar);
          } else {
            this.collapseSidebar(this.leftSidebar);
          }
          if (this.settings.rightPin) {
            this.expandSidebar(this.rightSidebar);
          } else {
            this.collapseSidebar(this.rightSidebar);
          }
        }, 200);
      });
    });
  }

  // Initializes the variables to store DOM HTML elements
  initialize: Function = () => {
    this.leftRibbon = (this.app.workspace.leftRibbon as any).containerEl;
    this.rightRibbon = (this.app.workspace.rightRibbon as any).containerEl;
    this.leftSidebar = ((this.app.workspace
      .leftSplit as unknown) as any).containerEl;
    this.rightSidebar = ((this.app.workspace
      .rightSplit as unknown) as any).containerEl;
  };

  // Adds event listeners to the HTML elements
  setEvents: Function = () => {
    this.registerDomEvent(document, 'mouseleave', () => {
      this.collapseSidebar(this.leftSidebar);
      this.collapseSidebar(this.rightSidebar);
    });

    this.registerDomEvent(
      (this.app.workspace.rootSplit as any).containerEl,
      'mouseenter',
      () => {
        this.collapseSidebar(this.leftSidebar);
        this.collapseSidebar(this.rightSidebar);
      }
    );

    this.registerDomEvent(this.leftRibbon, 'mouseenter', () => {
      if (!this.settings.leftPin) {
        this.expandSidebar(this.leftSidebar);
      }
    });

    this.registerDomEvent(this.rightRibbon, 'mouseenter', () => {
      if (!this.settings.rightPin) {
        this.expandSidebar(this.rightSidebar);
      }
    });

    // To avoid 'glitch'
    this.registerDomEvent(
      (this.app.workspace.leftSplit as any).resizeHandleEl,
      'mouseenter',
      () => {
        if (!this.settings.leftPin) {
          this.expandSidebar(this.leftSidebar);
        }
        this.settings.leftSidebarWidth = Number(
          (this.app.workspace.leftSplit as any).size
        );
        this.saveSettings();
      }
    );
    this.registerDomEvent(
      (this.app.workspace.rightSplit as any).resizeHandleEl,
      'mouseenter',
      () => {
        if (!this.settings.rightPin) {
          this.expandSidebar(this.rightSidebar);
        }
        this.settings.rightSidebarWidth = Number(
          (this.app.workspace.rightSplit as any).size
        );
        this.saveSettings();
      }
    );

    // Double click on left ribbon to toggle pin/unpin of left sidebar
    this.registerDomEvent(this.leftRibbon, 'dblclick', () => {
      this.settings.leftPin = !this.settings.leftPin;
      this.saveSettings();
    });

    // Double click on right ribbon to toggle pin/unpin of right sidebar
    this.registerDomEvent(this.rightRibbon, 'dblclick', () => {
      this.settings.rightPin = !this.settings.rightPin;
      this.saveSettings();
    });
  };

  // Changes sidebar style width and display to expand it
  expandSidebar = (sidebar: HTMLElement) => {
    if (sidebar == this.leftSidebar) {
      (this.app.workspace.leftSplit as any).setSize(
        this.settings.leftSidebarWidth
      );
      (this.app.workspace.leftSplit as any).expand();
    }
    if (sidebar == this.rightSidebar) {
      (this.app.workspace.rightSplit as any).setSize(
        this.settings.rightSidebarWidth
      );
      (this.app.workspace.rightSplit as any).expand();
    }
  };

  // Changes sidebar style width to collapse it
  collapseSidebar = (sidebar: HTMLElement) => {
    if (sidebar == this.leftSidebar && !this.settings.leftPin) {
      (this.app.workspace.leftSplit as any).collapse();
    }
    if (sidebar == this.rightSidebar && !this.settings.rightPin) {
      (this.app.workspace.rightSplit as any).collapse();
    }
  };

  onunload() {
    this.saveSettings();
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

// Plugin settings
class MyPluginSettingTab extends PluginSettingTab {
  plugin: SidebarExpandOnHoverPlugin;

  constructor(app: App, plugin: SidebarExpandOnHoverPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    this.plugin.loadData();
    containerEl.createEl('h2', { text: 'Sidebar Expand On Hover' });

    containerEl.createEl('h4', { text: 'Sidebar Expand Width' });
    const leftSidebarWidth = new Setting(containerEl);
    leftSidebarWidth.setName('Left Sidebar');
    leftSidebarWidth.setDesc('Set the width of left sidebar in pixel unit');
    leftSidebarWidth.addText((t) => {
      t.setValue(String(this.plugin.settings.leftSidebarWidth));
      t.setPlaceholder('Default: 252').onChange(async (value) => {
        this.plugin.settings.leftSidebarWidth = Number(value);
        (this.app.workspace.leftSplit as any).setSize(
          this.plugin.settings.leftSidebarWidth
        );
        this.plugin.saveSettings();
      });
    });

    const rightSidebarWidth = new Setting(containerEl);
    rightSidebarWidth.setName('Right Sidebar');
    rightSidebarWidth.setDesc('Set the width of right sidebar in pixel unit');
    rightSidebarWidth.addText((t) => {
      t.setValue(String(this.plugin.settings.rightSidebarWidth));
      t.setPlaceholder('Default: 252').onChange(async (value) => {
        this.plugin.settings.rightSidebarWidth = Number(value);
        (this.app.workspace.rightSplit as any).setSize(
          this.plugin.settings.rightSidebarWidth
        );
        this.plugin.saveSettings();
      });
    });
  }
}
