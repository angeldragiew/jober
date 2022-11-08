import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import IUser from '../models/user.model';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public redirect = false

  constructor(private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router) {

    this.usersCollection = db.collection('users');

    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user))
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided!');
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )

    if (!userCred.user) {
      throw new Error("User can't be found!")
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      accountType: userData.accountType
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }


  async logout($event: Event) {
    if ($event) {
      $event.preventDefault()
    }

    await this.auth.signOut()
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
   
}

