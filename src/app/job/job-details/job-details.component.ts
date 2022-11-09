import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  jobId = ''
  activeJob: IJob | null = null

  constructor(private route: ActivatedRoute,
    private jobService: JobService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = params['id']
    });

    this.jobService.getJob(this.jobId).subscribe(job => this.activeJob = job)
  }



}
