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
  likeMsg = this.jobLiked ? 'Liked' : 'Like'
  canModify = false
  canApply = false
  candidates: ICandidate[] = []
  status = ''
  subscription: Subscription | null = null

  constructor(private route: ActivatedRoute,
    public jobService: JobService,
    public auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.pipe(
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
      this.candidates = jobData.candidates as ICandidate[]
    })

    // this.route.params.pipe(
    //   switchMap(params => {
    //     this.jobId = params['id']
    //     return this.jobService.canModify(this.jobId)
    //   }),
    //   switchMap(result => {
    //     this.canModify = result;
    //     return this.jobService.getJob(this.jobId)
    //   })
    // ).subscribe(jobData => {
    //   this.activeJob = jobData
    //   this.jobId = jobData.docId ?? ''
    //   this.candidates = this.activeJob.candidates as ICandidate[]
    // })
  }

  deleteJob($event: Event, jobId: string) {
    $event.preventDefault()
    this.jobService.deleteJob(jobId)
    this.router.navigate(['BrowseJobs'])
  }

  applyForJob($event: Event, jobId: string) {
    $event.preventDefault()
    this.subscription = this.jobService.applyForJob(jobId)
    console.log('Method was called');

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
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
      this.jobService.dislikeJob(jobId)
    } else {
      this.jobService.likeJob(jobId)
    }
  }
}
