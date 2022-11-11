import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showAlert = false;
  alertMsg = 'Please wait! We are logging you in.';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private auth: AngularFireAuth,
    private router: Router) { }

  ngOnInit(): void {
  }

  email = new FormControl('', [Validators.required])
  password = new FormControl('', [Validators.required])

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  })

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.email.value as string, this.password.value as string
      )
    } catch (e) {
      this.inSubmission = false
      this.alertMsg = 'Invalid email or password!'
      this.alertColor = 'red'
      return
    }

    this.alertMsg = 'Success! You logged in successfully!'
    this.alertColor = 'green';
    setTimeout(() => {
      this.router.navigate([
        '/'
      ])
    }, 1000)
  }

}
