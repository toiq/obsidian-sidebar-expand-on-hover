import { App, Plugin, PluginSettingTab, Setting, Workspace } from 'obsidian';
interface MyPluginSettings {
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  leftPin: boolean;
  rightPin: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  leftSidebarWidth: 252,
  rightSidebarWidth: 252,
  leftPin: false,
  rightPin: false,
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  leftRibbon: HTMLElement;
  rightRibbon: HTMLElement;
  leftSidebar: HTMLElement;
  rightSidebar: HTMLElement;

  async onload() {
    // Initialize and set events when layout is fully ready
    this.app.workspace.onLayoutReady(() => {
      this.initialize();
      this.setEvents();
      this.addSettingTab(new MyPluginSettingTab(this.app, this));
      this.loadSettings().then(() => {
        if (this.settings.leftPin) {
          this.expandSidebar(this.leftSidebar);
          console.log('left side expanded on load');
        }
        if (this.settings.rightPin) {
          this.expandSidebar(this.rightSidebar);
          console.log('right side expanded on load');
        }
      });
    });
  }

  // Initializes the variables to store DOM HTML elements
  initialize: Function = () => {
    this.leftRibbon = (this.app.workspace.leftRibbon as Workspace).containerEl;
    this.rightRibbon = (this.app.workspace
      .rightRibbon as Workspace).containerEl;
    this.leftSidebar = ((this.app.workspace
      .leftSplit as unknown) as Workspace).containerEl;
    this.rightSidebar = ((this.app.workspace
      .rightSplit as unknown) as Workspace).containerEl;
  };

  // Adds event listeners to the HTML elements
  setEvents: Function = () => {
    this.registerDomEvent(document, 'mouseleave', () => {
      this.collapseSidebar();
    });

    this.registerDomEvent(
      (this.app.workspace.rootSplit as any).containerEl,
      'mouseenter',
      () => {
        this.collapseSidebar();
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
      }
    );
    this.registerDomEvent(
      (this.app.workspace.rightSplit as any).resizeHandleEl,
      'mouseenter',
      () => {
        if (!this.settings.rightPin) {
          this.expandSidebar(this.rightSidebar);
        }
      }
    );

    this.registerDomEvent(this.leftRibbon, 'dblclick', () => {
      this.settings.leftPin = !this.settings.leftPin;
      this.saveSettings();
    });

    this.registerDomEvent(this.rightRibbon, 'dblclick', () => {
      this.settings.rightPin = !this.settings.rightPin;
      this.saveSettings();
    });
  };

  // Changes sidebar style width and display to expand it
  expandSidebar = (sidebar: HTMLElement) => {
    try {
      if (sidebar == this.leftSidebar) {
        (this.app.workspace.leftSplit as any).setSize(
          this.settings.leftSidebarWidth == 0
            ? DEFAULT_SETTINGS.leftSidebarWidth
            : this.settings.leftSidebarWidth
        );
        (this.app.workspace.leftSplit as any).expand();
      }
      if (sidebar == this.rightSidebar) {
        (this.app.workspace.rightSplit as any).setSize(
          this.settings.rightSidebarWidth == 0
            ? DEFAULT_SETTINGS.rightSidebarWidth
            : this.settings.rightSidebarWidth
        );
        (this.app.workspace.rightSplit as any).expand();
      }
    } catch (e) {
      console.log('Failed to read property');
    }
  };

  // Changes sidebar style width to collapse it
  collapseSidebar = () => {
    this.loadSettings().then(() => {
      if (!this.settings.leftPin) {
        (this.app.workspace.leftSplit as any).collapse();
        console.log(' left collapsed!');
      }
      if (!this.settings.rightPin) {
        (this.app.workspace.rightSplit as any).collapse();
        console.log(' right collapsed!');
      }
    });
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
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
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
