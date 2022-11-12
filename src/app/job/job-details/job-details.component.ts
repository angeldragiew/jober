import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import ICandidate from 'src/app/models/candidate.model';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  jobId = ''
  activeJob: IJob | null = null
  jobLiked: boolean = false
  likeMsg = ''
  likes = 0
  canModify = false
  canApply = false
  candidates: ICandidate[] = []
  status = ''
  private subscriptions: Subscription = new Subscription()

  constructor(private route: ActivatedRoute,
    public jobService: JobService,
    public auth: AuthService,
    private router: Router) { }

  //Is Everything updated on change
  ngOnInit(): void {
    this.subscriptions.add(this.route.params.pipe(
      switchMap(params => {
        const jobId = params['id'];
        return this.jobService.canModify(jobId).pipe(map(canModify => ({ canModify, jobId })));
      }),
      switchMap(({ canModify, jobId }) => {
        return this.jobService.getJob(jobId).pipe(map(jobData => ({ canModify, jobId, jobData })));
      }),
      switchMap(({ canModify, jobId, jobData }) => {
        return this.auth.user$.pipe(map(user => ({ canModify, jobId, jobData, uid: user?.uid })));
      })
    ).subscribe(({ canModify, jobId, jobData, uid }) => {
      this.activeJob = jobData;
      this.canModify = canModify;
      //Gurmi kato mahna ? na filter
      this.canApply = (jobData.candidates as Array<ICandidate>)?.filter(c => c.uid == uid).length == 0
      this.status = (jobData.candidates as Array<ICandidate>)?.find(c => c.uid == uid)?.status ?? ''
      this.jobId = jobId;
      this.jobLiked = (jobData.likes as Array<string>)?.filter(l => l == uid).length > 0
      this.likeMsg = this.jobLiked ? 'Liked' : 'Like'
      this.likes = (jobData.likes as Array<string>)?.length
      this.candidates = jobData.candidates as ICandidate[]
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }


  deleteJob($event: Event, jobId: string) {
    $event.preventDefault()
    this.subscriptions.add(this.jobService.deleteJob(jobId).subscribe())
    this.router.navigate(['MyCreatedJobs'])
  }

  applyForJob($event: Event, jobId: string) {
    $event.preventDefault()
    this.subscriptions.add(this.jobService.applyForJob(jobId).subscribe())
  }
  async approveCandidate($event: Event, jobId: string, candidate: ICandidate) {
    $event.preventDefault()

    await this.jobService.approveCandidate(jobId, candidate)
  }

  rejectCandidate($event: Event, jobId: string, candidate: ICandidate) {
    $event.preventDefault()

    this.jobService.rejectCandidate(jobId, candidate)
  }

  likeJob($event: Event, jobId: string) {
    $event.preventDefault()
    if (this.jobLiked) {
      this.subscriptions.add(this.jobService.dislikeJob(jobId).subscribe())
    } else {
      this.subscriptions.add(this.jobService.likeJob(jobId).subscribe())
    }
  }
}
