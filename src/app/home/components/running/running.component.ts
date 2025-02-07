import { Component } from '@angular/core';
import * as data from '@shared/variables/page-variables.json'

@Component({
  selector: 'app-running',
  templateUrl: './running.component.html',
  styleUrls: ['./running.component.scss']
})
export class RunningComponent {
  pageData: any = (data as any).default.runningPage;
}
