import { Component, OnInit } from '@angular/core';
import * as data from '@shared/variables/page-variables.json'

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  pageData: any = (data as any).default.experiencePage;

  ngOnInit() {
    this.pageData.skills.skillsList = this.pageData.skills.skillsList.map((skill: any) => ({
      ...skill,
      skillsArray: (skill.skills as string).split(',').map(s => s.trim())
    }));
  }
}
