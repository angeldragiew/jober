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
  jobLiked: boolean = false
  likeMsg = 'like'
  canModfy = false

  constructor(private route: ActivatedRoute,
    public jobService: JobService,
    public auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        return this.jobService.getJob(params['id'])
      }),
      switchMap(jobData => {
        this.activeJob = jobData
        this.jobId = jobData.docId ?? ''
        return this.jobService.canModify(this.jobId)
      })
    ).subscribe(result => this.canModfy=result)
  }

  deleteJob($event: Event, jobId: string) {
    $event.preventDefault()
    this.jobService.deleteJob(jobId)
    this.router.navigate(['BrowseJobs'])
  }

  applyForJob($event: Event, jobId: string) {
    $event.preventDefault()
    this.jobService.applyForJob(jobId)
  }

  likeJob($event: Event) {
    $event.preventDefault()
    this.jobLiked = !this.jobLiked
  }
}
