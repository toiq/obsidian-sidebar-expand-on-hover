import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
interface SidebarExpandOnHoverSettings {
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  leftPin: boolean;
  rightPin: boolean;
  leftSideEnabled: boolean;
  rightSideEnabled: boolean;
}

const DEFAULT_SETTINGS: SidebarExpandOnHoverSettings = {
  leftSidebarWidth: 252,
  rightSidebarWidth: 252,
  leftPin: false,
  rightPin: false,
  leftSideEnabled: true,
  rightSideEnabled: true,
};

export default class SidebarExpandOnHoverPlugin extends Plugin {
  settings: SidebarExpandOnHoverSettings;
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
        this.addSettingTab(new SidebarExpandOnHoverSettingTab(this.app, this));
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
      if (this.settings.leftSideEnabled) {
        this.settings.leftPin = !this.settings.leftPin;
        this.saveSettings();
      }
    });

    // Double click on right ribbon to toggle pin/unpin of right sidebar
    this.registerDomEvent(this.rightRibbon, 'dblclick', () => {
      if (this.settings.rightSideEnabled) {
        this.settings.rightPin = !this.settings.rightPin;
        this.saveSettings();
      }
    });
  };

  // Changes sidebar style width and display to expand it
  expandSidebar = (sidebar: HTMLElement) => {
    if (sidebar == this.leftSidebar && this.settings.leftSideEnabled) {
      (this.app.workspace.leftSplit as any).setSize(
        this.settings.leftSidebarWidth
      );
      (this.app.workspace.leftSplit as any).expand();
    }
    if (sidebar == this.rightSidebar && this.settings.rightSideEnabled) {
      (this.app.workspace.rightSplit as any).setSize(
        this.settings.rightSidebarWidth
      );
      (this.app.workspace.rightSplit as any).expand();
    }
  };

  // Changes sidebar style width to collapse it
  collapseSidebar = (sidebar: HTMLElement) => {
    if (
      sidebar == this.leftSidebar &&
      !this.settings.leftPin &&
      this.settings.leftSideEnabled
    ) {
      (this.app.workspace.leftSplit as any).collapse();
    }
    if (
      sidebar == this.rightSidebar &&
      !this.settings.rightPin &&
      this.settings.rightSideEnabled
    ) {
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
class SidebarExpandOnHoverSettingTab extends PluginSettingTab {
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
    containerEl.createEl('p', {
      text: `Note: You can also double click on each of the ribbons to 'pin' the corresponding 
      sidebar so that it remains expanded.
      You can undo this 'pinned state' behavior by double clicking on the ribbons again.
      This only works when you have that sidebar 'enabled' in this settings. Enjoy! :D`,
    });

    containerEl.createEl('h4', { text: 'Enable Individual Sidebar' });
    const leftSideEnabled = new Setting(containerEl);
    leftSideEnabled.setName('Left Sidebar');
    leftSideEnabled.setDesc(
      'Toggle to enable/disable left sidebar expand on hover'
    );
    leftSideEnabled.addToggle((t) => {
      t.setValue(this.plugin.settings.leftSideEnabled);
      t.onChange(async (v) => {
        this.plugin.settings.leftSideEnabled = v;
        if (v == false) this.plugin.settings.leftPin = false;
        this.plugin.saveSettings();
      });
    });

    const rightSideEnabled = new Setting(containerEl);
    rightSideEnabled.setName('Right Sidebar');
    rightSideEnabled.setDesc(
      'Toggle to enable/disable right sidebar expand on hover'
    );
    rightSideEnabled.addToggle((t) => {
      t.setValue(this.plugin.settings.rightSideEnabled);
      t.onChange(async (v) => {
        this.plugin.settings.rightSideEnabled = v;
        if (v == false) this.plugin.settings.rightPin = false;
        this.plugin.saveSettings();
      });
    });

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
