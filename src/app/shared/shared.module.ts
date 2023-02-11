import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective],
  imports: [CommonModule, TranslateModule, FormsModule, CountdownModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, CountdownModule],
})
export class SharedModule {}
