import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IEditJob from 'src/app/models/edit.job.model';
import { JobService } from 'src/app/services/job.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit, OnDestroy {
  showAlert = false;
  alertMsg = 'Please wait! Updating clip!';
  alertColor = 'blue';
  inSubmission = false;
  private subscriptions: Subscription = new Subscription()

  constructor(private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(this.route.params.pipe(
      switchMap(params => {
        return this.jobService.getJob(params['id'])
      })
    ).subscribe(jobData => {
      this.jobId.setValue(jobData.docId)
      this.title.setValue(jobData.title)
      this.description.setValue(jobData.description)
      this.type.setValue(jobData.type)
      this.category.setValue(jobData.category)
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  jobId = new FormControl('')
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true
  })
  description = new FormControl('', {
    validators: [Validators.required, Validators.minLength(10)],
    nonNullable: true
  })
  type = new FormControl('full-time', {
    validators: [Validators.required],
    nonNullable: true
  })
  category = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true
  })

  editJobForm = new FormGroup({
    title: this.title,
    descriptionthis: this.description,
    typethis: this.type,
    category: this.category,
    id: this.jobId
  })

  updateJob() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Editting job!';

    const data: IEditJob = {
      title: this.title.value,
      description: this.description.value,
      type: this.type.value,
      category: this.category.value
    }

    this.subscriptions.add(this.jobService.updateJob(this.jobId.value as string, data).subscribe(
      {
        next: (data) => {
          this.inSubmission = false
          this.alertColor = 'green'
          this.alertMsg = 'Job updated successfully!'
          setTimeout(() => {
            this.router.navigate(['JobDetails', this.jobId.value])
          }, 1500);
        },
        error: error => {
          this.inSubmission = false
          this.alertColor = 'red'
          this.alertMsg = 'Something went wrong. Try again later.'
          console.log(error)
        }
      }))

  }
}
