import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseJobsComponent } from './browse-jobs/browse-jobs.component';
import { CreateJobComponent } from './create-job/create-job.component';

const routes: Routes = [
  {
    path: 'Create/Job',
    component: CreateJobComponent
  },
  {
    path: 'BrowseJobs',
    component: BrowseJobsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
