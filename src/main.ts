import { Plugin, WorkspaceRibbon } from 'obsidian';

export default class MyPlugin extends Plugin {
  ribbon: any = null;
  sidebar: any = null;

  async onload() {
    console.log('loading mouse hover expand plugin');
    this.registerEvent(
      this.app.workspace.on('layout-ready', () => {
        this.initialize();
        console.log('Got from layout-ready event');
        this.setEvents();
      })
    );
    try {
      this.initialize();
      this.setEvents();
    } finally {
      window.setTimeout(() => {
        this.initialize();
        this.setEvents();
      }, 2000);
    }
  }

  initialize: Function = () => {
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
  };

  setEvents: Function = () => {
    this.registerDomEvent(document, 'mouseout', () => {
      this.sidebar[0].style.width = '0px';
    });

    this.registerDomEvent(this.ribbon[0] as HTMLElement, 'mouseover', () => {
      this.sidebar[0].style.width = '266px';
      this.sidebar[0].style.removeProperty('display');
    });

    this.registerDomEvent(this.sidebar[0] as HTMLElement, 'mouseover', () => {
      this.sidebar[0].style.width = '266px';
    });
  };

  onunload() {
    console.log('unloading mouse hover expand plugin');
  }
}
