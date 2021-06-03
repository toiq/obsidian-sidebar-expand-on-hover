/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    leftSidebarWidth: 252,
    rightSidebarWidth: 252,
    leftPin: false,
    rightPin: false,
};
class SidebarExpandOnHoverPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        // Initializes the variables to store DOM HTML elements
        this.initialize = () => {
            this.leftRibbon = this.app.workspace.leftRibbon.containerEl;
            this.rightRibbon = this.app.workspace.rightRibbon.containerEl;
            this.leftSidebar = this.app.workspace
                .leftSplit.containerEl;
            this.rightSidebar = this.app.workspace
                .rightSplit.containerEl;
        };
        // Adds event listeners to the HTML elements
        this.setEvents = () => {
            this.registerDomEvent(document, 'mouseleave', () => {
                this.collapseSidebar(this.leftSidebar);
                this.collapseSidebar(this.rightSidebar);
            });
            this.registerDomEvent(this.app.workspace.rootSplit.containerEl, 'mouseenter', () => {
                this.collapseSidebar(this.leftSidebar);
                this.collapseSidebar(this.rightSidebar);
            });
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
            this.registerDomEvent(this.app.workspace.leftSplit.resizeHandleEl, 'mouseenter', () => {
                if (!this.settings.leftPin) {
                    this.expandSidebar(this.leftSidebar);
                }
                this.settings.leftSidebarWidth = Number(this.app.workspace.leftSplit.size);
                this.saveSettings();
            });
            this.registerDomEvent(this.app.workspace.rightSplit.resizeHandleEl, 'mouseenter', () => {
                if (!this.settings.rightPin) {
                    this.expandSidebar(this.rightSidebar);
                }
                this.settings.rightSidebarWidth = Number(this.app.workspace.rightSplit.size);
                this.saveSettings();
            });
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
        this.expandSidebar = (sidebar) => {
            if (sidebar == this.leftSidebar) {
                this.app.workspace.leftSplit.setSize(this.settings.leftSidebarWidth);
                this.app.workspace.leftSplit.expand();
            }
            if (sidebar == this.rightSidebar) {
                this.app.workspace.rightSplit.setSize(this.settings.rightSidebarWidth);
                this.app.workspace.rightSplit.expand();
            }
        };
        // Changes sidebar style width to collapse it
        this.collapseSidebar = (sidebar) => {
            if (sidebar == this.leftSidebar && !this.settings.leftPin) {
                this.app.workspace.leftSplit.collapse();
            }
            if (sidebar == this.rightSidebar && !this.settings.rightPin) {
                this.app.workspace.rightSplit.collapse();
            }
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
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
                        }
                        else {
                            this.collapseSidebar(this.leftSidebar);
                        }
                        if (this.settings.rightPin) {
                            this.expandSidebar(this.rightSidebar);
                        }
                        else {
                            this.collapseSidebar(this.rightSidebar);
                        }
                    }, 200);
                });
            });
        });
    }
    onunload() {
        this.saveSettings();
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
// Plugin settings
class SidebarExpandOnHoverSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        this.plugin.loadData();
        containerEl.createEl('h2', { text: 'Sidebar Expand On Hover' });
        containerEl.createEl('h4', { text: 'Sidebar Expand Width' });
        const leftSidebarWidth = new obsidian.Setting(containerEl);
        leftSidebarWidth.setName('Left Sidebar');
        leftSidebarWidth.setDesc('Set the width of left sidebar in pixel unit');
        leftSidebarWidth.addText((t) => {
            t.setValue(String(this.plugin.settings.leftSidebarWidth));
            t.setPlaceholder('Default: 252').onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.leftSidebarWidth = Number(value);
                this.app.workspace.leftSplit.setSize(this.plugin.settings.leftSidebarWidth);
                this.plugin.saveSettings();
            }));
        });
        const rightSidebarWidth = new obsidian.Setting(containerEl);
        rightSidebarWidth.setName('Right Sidebar');
        rightSidebarWidth.setDesc('Set the width of right sidebar in pixel unit');
        rightSidebarWidth.addText((t) => {
            t.setValue(String(this.plugin.settings.rightSidebarWidth));
            t.setPlaceholder('Default: 252').onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rightSidebarWidth = Number(value);
                this.app.workspace.rightSplit.setSize(this.plugin.settings.rightSidebarWidth);
                this.plugin.saveSettings();
            }));
        });
    }
}

module.exports = SidebarExpandOnHoverPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFB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
