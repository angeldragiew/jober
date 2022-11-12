import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit, OnDestroy {
  jobs: IJob[] = []
  private subscriptions: Subscription = new Subscription()

  constructor(private jobService: JobService) {
  }

  ngOnInit(): void {
    this.jobs = []
    this.subscriptions.add(this.jobService.getAllJobs().subscribe(data =>
      data.forEach(job => {
        this.jobs.push(job)
      }
      )))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
