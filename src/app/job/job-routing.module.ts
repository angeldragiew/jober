import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { BrowseJobsComponent } from './browse-jobs/browse-jobs.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { CreatedJobsComponent } from './created-jobs/created-jobs.component';
import { EditJobComponent } from './edit-job/edit-job.component';
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
  },
  {
    path: 'EditJob/:id',
    component: EditJobComponent
  },
  {
    path: 'MyCreatedJobs',
    component: CreatedJobsComponent
  },
  {
    path:'MyAppliedJobs',
    component:AppliedJobsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
