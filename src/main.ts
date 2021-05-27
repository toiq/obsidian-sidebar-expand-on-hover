import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian';

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;
  ribbon: any = null;
  sidebar: any = null;
  // editor: any = null;
  // preview: any = null;
  workspace: any = null;
  expandSidebar: Function;
  collapseSidebar: Function;

  async onload() {
    console.log('loading mouse hover expand plugin');

    await this.loadSettings();

    // this.addRibbonIcon('dice', 'Sample Plugin', () => {
    // 	new Notice('This is a notice!');
    // });

    this.addStatusBarItem().setText('Status Bar Text');

    // this.addCommand({
    // 	id: 'open-sample-modal',
    // 	name: 'Open Sample Modal',
    // 	// callback: () => {
    // 	// 	console.log('Simple Callback');
    // 	// },
    // 	checkCallback: (checking: boolean) => {
    // 		let leaf = this.app.workspace.activeLeaf;
    // 		if (leaf) {
    // 			if (!checking) {
    // 				new SampleModal(this.app).open();
    // 			}
    // 			return true;
    // 		}
    // 		return false;
    // 	}
    // });

    // this.addSettingTab(new SampleSettingTab(this.app, this));

    // this.registerCodeMirror((cm: CodeMirror.Editor) => {
    // 	console.log('codemirror', cm);
    // });

    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    // 	console.log('click', evt);
    // });

    this.registerDomEvent(document, 'mousemove', (evt: MouseEvent) => {
      this.ribbon = Array.from(
        document.getElementsByClassName(
          'workspace-ribbon'
        ) as HTMLCollectionOf<HTMLElement>
      );

      this.sidebar = Array.from(
        document.getElementsByClassName(
          'mod-left-split'
        ) as HTMLCollectionOf<HTMLElement>
      );

      this.workspace = document.getElementsByClassName('mod-root');

      // this.editor = document.getElementsByClassName('markdown-source-view');
      // this.preview = document.getElementsByClassName('markdown-preview-view');
      this.ribbon[0].addEventListener('mouseover', this.expandSidebar);

      this.expandSidebar = () => {
        this.sidebar[0].style.width = '266px';
        this.sidebar[0].style.removeProperty('display');
      };
      this.collapseSidebar = () => {
        this.sidebar[0].style.width = '0px';
      };
      try {
        document.body.addEventListener(
          'mouseleave',
          this.collapseSidebar.bind(this)
        );
      } finally {
        console.log('Failed to get mouseleave event for document object');
      }
      this.workspace[1].addEventListener('mouseover', this.collapseSidebar);
      //this.preview[0].addEventListener('mouseover', this.collapseSidebar);
      // console.log('click', evt);
      // this.loadData().then((data) => {
      //   console.log(data);
      // });
    });

    this.registerInterval(
      window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000)
    );
  }

  onunload() {
    console.log('unloading mouse hover expand plugin');
    // Reset the html element selection variables
    this.ribbon = null;
    this.sidebar = null;
    this.workspace = null;
    this.collapseSidebar = null;
    this.expandSidebar = null;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		let {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		let {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		let {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue('')
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
