import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription()

  name: string = ''
  email: string = ''
  accountType: string = ''

  constructor(private auth: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.auth.getUserInfo().subscribe(userData => {
      this.name = userData.name
      this.accountType = userData.accountType
      this.email = userData.email      
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

}
