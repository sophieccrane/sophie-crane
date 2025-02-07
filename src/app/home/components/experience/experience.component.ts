import { Component } from '@angular/core';
import * as data from '@shared/variables/page-variables.json'

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  pageData: any = (data as any).default.experiencePage;
}
