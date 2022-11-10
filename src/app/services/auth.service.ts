import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable, of,EMPTY } from 'rxjs';
import { map, delay, filter, switchMap, first } from 'rxjs/operators';
import IUser from '../models/user.model';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import IJob from '../models/job.model';
import firebase from 'firebase/compat/app'
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isOrganization$: Observable<boolean>
  public redirect = false

  constructor(private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router) {

    this.usersCollection = db.collection('users');

    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user))

    this.isOrganization$ = this.auth.user.pipe(
      switchMap(user => {
        if (!user) {
          return of([])
        }

        const query = this.usersCollection.ref.where(firebase.firestore.FieldPath.documentId(), '==', user.uid)
          .where('accountType', '==', 'organization')

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IUser>).docs?.length > 0)
    )
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

  getUserInfo() {
    return this.auth.user.pipe(
      switchMap(user => {
        if (!user) {
          return EMPTY
        }

        return this.usersCollection.doc(user.uid).snapshotChanges().pipe(
          map(changes => {
            const data = changes.payload.data() as IUser;
            const docId = changes.payload.id;

            return { docId, ...data }
          })
        )
      })
    )
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

