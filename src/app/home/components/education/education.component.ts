import { Component } from '@angular/core';
import * as data from '@shared/variables/page-variables.json';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  pageData: any = (data as any).default;
}
