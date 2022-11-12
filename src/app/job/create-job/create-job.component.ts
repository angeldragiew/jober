import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit, OnDestroy {
  showAlert = false;
  alertMsg = 'Please wait! Video is uploading!';
  alertColor = 'blue';
  inSubmission = false;
  private subscriptions: Subscription = new Subscription()

  user: firebase.User | null = null


  constructor(private jobService: JobService,
    private auth: AngularFireAuth,
    private router: Router) {
    this.subscriptions.add(auth.user.subscribe(user => this.user = user))
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

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

  createJobForm = new FormGroup({
    title: this.title,
    descriptionthis: this.description,
    typethis: this.type,
    category: this.category
  })

  createJob() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Video is uploading!';
    this.alertColor = 'blue';
    this.inSubmission = true;

    const job = {
      uid: this.user?.uid as string,
      title: this.title.value,
      description: this.description.value,
      type: this.type.value,
      category: this.category.value,
      likes: [],
      candidates: [],
      isActive: true
    }

    this.subscriptions.add(this.jobService.createJob(job).subscribe({
      next: (data) => {
        this.showAlert = true;
        this.alertMsg = 'Job was created successfully!';
        this.alertColor = 'green';
        this.inSubmission = true;

        setTimeout(() => {
          this.router.navigateByUrl('/MyCreatedJobs')
        }, 1500);
      },
      error: (error) => {
        this.showAlert = true;
        this.alertMsg = 'Something went wrong. Try again!';
        this.alertColor = 'red';
        this.inSubmission = false;
      }
    }))

  }
}
