import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  ribbon: HTMLElement;
  sidebar: HTMLElement;

  async onload() {
    console.log('loading mouse hover expand plugin');

    // Initialize and set events when layout is fully ready
    this.app.workspace.onLayoutReady(() => {
      this.initialize();
      this.setEvents();
    });
  }

  // Initializes the variables to store DOM HTML elements
  initialize: Function = () => {
    this.ribbon = Array.from(
      document.getElementsByClassName(
        'workspace-ribbon'
      ) as HTMLCollectionOf<HTMLElement>
    )[0];

    this.sidebar = Array.from(
      document.getElementsByClassName(
        'mod-left-split'
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
  };

  // Adds event listeners to the HTML elements
  setEvents: Function = () => {
    this.registerDomEvent(document, 'mouseout', () => {
      this.collapseSidebar();
    });

    this.registerDomEvent(this.ribbon, 'mouseover', () => {
      this.expandSidebar();
    });

    this.registerDomEvent(this.sidebar, 'mouseover', () => {
      this.expandSidebar();
    });
  };

  // Changes sidebar style width and display to expand it
  expandSidebar = () => {
    this.sidebar.style.width = '252px';
    this.sidebar.style.removeProperty('display');
  };

  // Changes sidebar style width to collapse it
  collapseSidebar = () => {
    this.sidebar.style.width = '0px';
  };

  onunload() {
    console.log('unloading mouse hover expand plugin');
  }
}
