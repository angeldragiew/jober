import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseJobsComponent } from './browse-jobs/browse-jobs.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobComponent } from './job/job.component';

const routes: Routes = [
  {
    path: 'Create/Job',
    component: CreateJobComponent
  },
  {
    path: 'BrowseJobs',
    component: BrowseJobsComponent
  },
  {
    path: 'JobDetails/:id',
    component: JobDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
