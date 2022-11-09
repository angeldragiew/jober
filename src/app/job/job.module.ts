import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { CreateJobComponent } from './create-job/create-job.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { JobComponent } from './job/job.component';
import { BrowseJobsComponent } from './browse-jobs/browse-jobs.component';
import { JobDetailsComponent } from './job-details/job-details.component';


@NgModule({
  declarations: [
    CreateJobComponent,
    JobComponent,
    BrowseJobsComponent,
    JobDetailsComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class JobModule { }
