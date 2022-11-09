import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {
  jobs: IJob[] = []
  constructor(private jobService: JobService) {
  }

  ngOnInit(): void {
    this.jobs = []
    this.jobService.getAllJobs().subscribe(data =>
      data.forEach(job => {
        this.jobs.push(job)
      }
      ))
  }
}
