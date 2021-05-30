import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

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
      console.log('Values are: ' + this.settings);
      this.loadSettings().then(() => {
        this.addStyle();
      });
    });
  }

  // Initializes the variables to store DOM HTML elements
  initialize: Function = () => {
    [this.leftRibbon, this.rightRibbon] = Array.from(
      document.getElementsByClassName(
        'workspace-ribbon'
      ) as HTMLCollectionOf<HTMLElement>
    );

    [this.leftSidebar, this.rightSidebar] = Array.from(
      document.getElementsByClassName(
        'mod-horizontal'
      ) as HTMLCollectionOf<HTMLElement>
    );
  };

  // Adds event listeners to the HTML elements
  setEvents: Function = () => {
    this.registerDomEvent(document, 'mouseout', () => {
      this.collapseSidebar();
    });

    this.registerDomEvent(this.leftRibbon, 'mouseover', () => {
      this.expandSidebar(this.leftSidebar);
    });
    this.registerDomEvent(this.rightRibbon, 'mouseover', () => {
      this.expandSidebar(this.rightSidebar);
    });

    this.registerDomEvent(this.leftSidebar, 'mouseover', () => {
      this.expandSidebar(this.leftSidebar);
    });

    this.registerDomEvent(this.rightSidebar, 'mouseover', () => {
      this.expandSidebar(this.rightSidebar);
    });
  };

  // Changes sidebar style width and display to expand it
  expandSidebar = (sidebar: HTMLElement) => {
    try {
      if (sidebar == this.leftSidebar && this.settings.leftSideEnabled) {
        sidebar.style.width = String(this.settings.leftSidebarWidth) + 'px';
        sidebar.style.removeProperty('display');
      }
      if (sidebar == this.rightSidebar && this.settings.rightSideEnabled) {
        sidebar.style.width = String(this.settings.rightSidebarWidth) + 'px';
        sidebar.style.removeProperty('display');
      }
    } catch (e) {
      console.log('Failed to read property');
    }
  };

  // Changes sidebar style width to collapse it
  collapseSidebar = () => {
    if (this.settings.leftSideEnabled) {
      this.leftSidebar.style.width = '0px';
    }
    if (this.settings.rightSideEnabled) {
      this.rightSidebar.style.width = '0px';
    }
  };

  // CSS for adding transition animation
  addStyle = () => {
    if (this.settings.leftSidebarAnimation && this.settings.leftSideEnabled) {
      this.leftSidebar.classList.add('sidebar');
      this.leftSidebar.classList.toggle('.sidebar.active');
    }
    if (this.settings.rightSidebarAnimation && this.settings.rightSideEnabled) {
      this.rightSidebar.classList.add('sidebar');
      this.rightSidebar.classList.toggle('.sidebar.active');
    }
  };

  // Removes transition animation
  removeStyle = () => {
    if (!this.settings.leftSidebarAnimation && this.settings.leftSideEnabled) {
      this.leftSidebar.classList.remove('sidebar');
    }
    if (
      !this.settings.rightSidebarAnimation &&
      this.settings.rightSideEnabled
    ) {
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
