import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { AuthService } from 'src/app/services/auth.service';
import IJob from 'src/app/models/job.model';
import { switchMap, map, EMPTY } from 'rxjs';
import ICandidate from 'src/app/models/candidate.model';
@Component({
  selector: 'app-created-jobs',
  templateUrl: './created-jobs.component.html',
  styleUrls: ['./created-jobs.component.css']
})
export class CreatedJobsComponent implements OnInit {
  jobs: IJob[] = []

  constructor(private jobService: JobService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.jobs = []

    this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return EMPTY
        }
        const userId = user.uid
        return this.jobService.getAllJobs().pipe(map(jobs => ({ jobs, userId })))
      })
    ).subscribe(({ jobs, userId }) => {
      this.jobs = jobs.filter(j => j.uid == userId)
    })
  }

}
