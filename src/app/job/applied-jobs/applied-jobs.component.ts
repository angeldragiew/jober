import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { AuthService } from 'src/app/services/auth.service';
import IJob from 'src/app/models/job.model';
import { switchMap, map, EMPTY, Subscription } from 'rxjs';
import ICandidate from 'src/app/models/candidate.model';

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.css']
})
export class AppliedJobsComponent implements OnInit, OnDestroy {
  jobs: IJob[] = []
  private subscriptions: Subscription = new Subscription()

  constructor(private jobService: JobService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.jobs = []

    this.subscriptions.add(this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return EMPTY
        }
        const userId = user.uid
        return this.jobService.getAllJobs().pipe(map(jobs => ({ jobs, userId })))
      })
    ).subscribe(({ jobs, userId }) => {
      this.jobs = jobs.filter(j => (j.candidates as Array<ICandidate>)?.filter(c => c.uid == userId).length > 0).map(j => {
        return {
          ...j,
          status: (j.candidates as Array<ICandidate>).find(c => c.uid == userId)?.status
        }
      })
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
