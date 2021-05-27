import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
  ribbon: any = null;
  sidebar: any = null;
  workspace: any = null;
  expandSidebar: Function;
  collapseSidebar: Function;

  async onload() {
    console.log('loading mouse hover expand plugin');

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

      this.ribbon[0].addEventListener('mouseover', this.expandSidebar);

      this.expandSidebar = () => {
        this.sidebar[0].style.width = '266px';
        this.sidebar[0].style.removeProperty('display');
      };
      this.collapseSidebar = () => {
        this.sidebar[0].style.width = '0px';
      };

      document.body.addEventListener(
        'mouseleave',
        this.collapseSidebar.bind(this)
      );

      this.workspace[1].addEventListener('mouseover', this.collapseSidebar);
    });
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
}
