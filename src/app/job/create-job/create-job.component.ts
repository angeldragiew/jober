import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from 'src/app/services/job.service';
import IJob from 'src/app/models/job.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {
  showAlert = false;
  alertMsg = 'Please wait! Video is uploading!';
  alertColor = 'blue';
  inSubmission = false;

  user: firebase.User | null = null


  constructor(private jobService: JobService,
    private auth: AngularFireAuth,
    private router: Router) {
    auth.user.subscribe(user => this.user = user)
  }

  ngOnInit(): void {
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

  async createJob() {
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
      candidates: []
    }

    try {
      await this.jobService.createJob(job);
    } catch (e) {
      this.showAlert = true;
      this.alertMsg = 'Something went wrong. Try again!';
      this.alertColor = 'red';
      this.inSubmission = false;
    }

    this.showAlert = true;
    this.alertMsg = 'Job was created successfully!';
    this.alertColor = 'green';
    this.inSubmission = true;

    setTimeout(() => {
      this.router.navigateByUrl('/')
    }, 1500);
  }
}
