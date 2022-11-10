import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  jobId = ''
  activeJob: IJob | null = null

  constructor(private route: ActivatedRoute,
    private jobService: JobService,
    public auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        return this.jobService.getJob(params['id'])
      })
    ).subscribe(jobData => {
      this.activeJob = jobData;
      console.log(this.activeJob)
      this.jobId = jobData.docId ?? ''
    })
  }

  deleteJob($event: Event, jobId: string){
    $event.preventDefault()
    this.jobService.deleteJob(jobId)
    this.router.navigate(['BrowseJobs'])
  }

}
