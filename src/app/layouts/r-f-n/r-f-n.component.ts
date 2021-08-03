import { DOCUMENT } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-r-f-n',
  templateUrl: './r-f-n.component.html',
  styleUrls: ['./r-f-n.component.scss']
})
export class RFNComponent implements OnInit, OnDestroy {

  languages = [
    { code: 'en', label: 'English'},
    { code: 'zh', label: '简体中文'}
  ];

  constructor(
    @Inject(LOCALE_ID) public localeId: any,
    public sharedService: SharedService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    // const nav = this.document.querySelector('app-nav');
    // const footer = this.document.querySelector('app-footer');

    if (this.sharedService.navHideNavAndFooter()) {
      // this.renderer.setStyle(nav, 'display', 'none');
      // this.renderer.setStyle(footer, 'display', 'none');
    }
  }

  ngOnDestroy() {
    // const nav = this.document.querySelector('app-nav');
    // const footer = this.document.querySelector('app-footer');
    // this.renderer.removeStyle(nav, 'display');
    // this.renderer.removeStyle(footer, 'display');
  }

}
