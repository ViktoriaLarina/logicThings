import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appForIn]' })
export class ForInDirective {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) { }

  @Input() set forIn(obj: {}) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.viewContainer.createEmbeddedView(this.templateRef, key, obj[key]);
      }
    }
    // if (condition) {
    //   this.viewContainer.createEmbeddedView(this.templateRef);
    // } else {
    //   this.viewContainer.clear();
    // }
  }
}
