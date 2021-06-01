import { App, Plugin, PluginSettingTab, Setting, Workspace } from 'obsidian';

interface MyPluginSettings {
  leftSideEnabled: boolean;
  rightSideEnabled: boolean;
  leftSidebarAnimation: boolean;
  rightSidebarAnimation: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  leftSideEnabled: true,
  rightSideEnabled: true,
  leftSidebarAnimation: false,
  rightSidebarAnimation: false,
  leftSidebarWidth: 252,
  rightSidebarWidth: 252,
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
        this.addStyle();
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
    this.registerDomEvent(
      (this.app.workspace.rootSplit as any).containerEl,
      'mouseenter',
      () => {
        this.collapseSidebar();
      }
    );

    this.registerDomEvent(this.leftRibbon, 'mouseenter', () => {
      this.expandSidebar(this.leftSidebar);
    });

    this.registerDomEvent(this.rightRibbon, 'mouseenter', () => {
      this.expandSidebar(this.rightSidebar);
    });

    // To avoid 'glitch'
    this.registerDomEvent(
      (this.app.workspace.leftSplit as any).resizeHandleEl,
      'mouseenter',
      () => {
        this.expandSidebar(this.leftSidebar);
      }
    );
  };

  // Changes sidebar style width and display to expand it
  expandSidebar = (sidebar: HTMLElement) => {
    try {
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
    } catch (e) {
      console.log('Failed to read property');
    }
  };

  // Changes sidebar style width to collapse it
  collapseSidebar = () => {
    if (this.settings.leftSideEnabled) {
      (this.app.workspace.leftSplit as any).collapse();
    }
    if (this.settings.rightSideEnabled) {
      (this.app.workspace.rightSplit as any).collapse();
    }
  };

  // CSS for adding transition animation
  addStyle = () => {
    if (this.settings.leftSidebarAnimation) {
      this.leftSidebar.classList.add('sidebar');
      this.leftSidebar.classList.toggle('.sidebar.active');
    }
    if (this.settings.rightSidebarAnimation) {
      this.rightSidebar.classList.add('sidebar');
      this.rightSidebar.classList.toggle('.sidebar.active');
    }
  };

  // Removes transition animation
  removeStyle = () => {
    if (!this.settings.leftSidebarAnimation) {
      this.leftSidebar.classList.remove('sidebar');
    }
    if (!this.settings.rightSidebarAnimation) {
      this.rightSidebar.classList.remove('sidebar');
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
    containerEl.createEl('h4', { text: 'Enable Individual Sidebar' });
    const leftSideEnabled = new Setting(containerEl);
    leftSideEnabled.setName('Left Sidebar');
    leftSideEnabled.setDesc(
      'Toggle to enable/disable left sidebar expand on hover'
    );
    leftSideEnabled.addToggle((t) => {
      t.setValue(this.plugin.settings.leftSideEnabled);
      t.onChange(async (v) => {
        if (v) {
          this.plugin.settings.leftSideEnabled = true;
          this.plugin.saveSettings();
          this.plugin.addStyle();
        } else {
          this.plugin.settings.leftSideEnabled = false;
          this.plugin.saveSettings();
          this.plugin.removeStyle();
        }
        this.plugin.setEvents();
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
        if (v) {
          this.plugin.settings.rightSideEnabled = true;
          this.plugin.saveSettings();
          this.plugin.addStyle();
        } else {
          this.plugin.settings.rightSideEnabled = false;
          this.plugin.saveSettings();
          this.plugin.removeStyle();
        }
        this.plugin.setEvents();
      });
    });

    containerEl.createEl('h4', { text: 'Sidebar Animation' });
    const leftSidebarAnimation = new Setting(containerEl);
    leftSidebarAnimation.setName('Left Sidebar');
    leftSidebarAnimation.setDesc(
      'Toggle to enable/disable left sidebar animation'
    );
    leftSidebarAnimation.addToggle((t) => {
      t.setValue(this.plugin.settings.leftSidebarAnimation);
      t.onChange(async (v) => {
        if (v) {
          this.plugin.settings.leftSidebarAnimation = true;
          this.plugin.saveSettings();
          this.plugin.addStyle();
        } else {
          this.plugin.settings.leftSidebarAnimation = false;
          this.plugin.saveSettings();
          this.plugin.removeStyle();
        }
      });
    });

    const rightSidebarAnimation = new Setting(containerEl);
    rightSidebarAnimation.setName('Right Sidebar');
    rightSidebarAnimation.setDesc(
      'Toggle to enable/disable right sidebar animation'
    );
    rightSidebarAnimation.addToggle((t) => {
      t.setValue(this.plugin.settings.rightSidebarAnimation);
      t.onChange(async (v) => {
        if (v) {
          this.plugin.settings.rightSidebarAnimation = true;
          this.plugin.saveSettings();
          this.plugin.addStyle();
        } else {
          this.plugin.settings.rightSidebarAnimation = false;
          this.plugin.saveSettings();
          this.plugin.removeStyle();
        }
      });
    });

    containerEl.createEl('h4', { text: 'Sidebar Expand Width' });
    const leftSidebarWidth = new Setting(containerEl);
    leftSidebarWidth.setName('Left Sidebar');
    leftSidebarWidth.setDesc('Set the width of left sidebar in pixel unit');
    leftSidebarWidth.addText((t) =>
      t
        .setPlaceholder('Default: 252')
        .setValue(String(this.plugin.settings.leftSidebarWidth))
        .onChange(async (value) => {
          this.plugin.settings.leftSidebarWidth = Number(value);
          this.plugin.saveSettings();
        })
    );

    const rightSidebarWidth = new Setting(containerEl);
    rightSidebarWidth.setName('Right Sidebar');
    rightSidebarWidth.setDesc('Set the width of right sidebar in pixel unit');
    rightSidebarWidth.addText((t) =>
      t
        .setPlaceholder('Default: 252')
        .setValue(String(this.plugin.settings.rightSidebarWidth))
        .onChange(async (value) => {
          this.plugin.settings.rightSidebarWidth = Number(value);
          this.plugin.saveSettings();
        })
    );
  }
}
