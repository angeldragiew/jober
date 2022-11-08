import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.';
  alertColor = 'blue';
  inSubmission = false;


  constructor(private authService: AuthService,
    private router: Router,
    private emailTaken: EmailTaken) { }

  name = new FormControl('', [Validators.required, Validators.minLength(3)])
  email = new FormControl('', [Validators.required, Validators.email],[this.emailTaken.validate])
  password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)])
  confirm_password = new FormControl('', [Validators.required])
  accountType = new FormControl('worker', Validators.required)
  ngOnInit(): void {
  }

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
    confirm_password: this.confirm_password,
    accountType: this.accountType
  },[RegisterValidators.match('password', 'confirm_password')])


  async register(){
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    try {
      await this.authService.createUser(this.registerForm.value as IUser)
    } catch (e) {
      console.log(e);
      this.alertMsg = 'An unexpected error occured! Please try again later!'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green';

    setTimeout(() => {
      this.router.navigate([
        '/'
      ])
    }, 2000)
  }
}
