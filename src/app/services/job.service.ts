import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IJob from '../models/job.model';
import { map, EMPTY, switchMap } from 'rxjs';
import IEditJob from '../models/edit.job.model';
import { AuthService } from './auth.service';
import ICandidate from '../models/candidate.model';
import { arrayUnion, arrayRemove, updateDoc, getDoc, doc } from "firebase/firestore";
import firebase from 'firebase/compat/app'
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  public jobsCollection: AngularFirestoreCollection<IJob>
  constructor(private db: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth) {
    this.jobsCollection = db.collection('jobs')
  }

  createJob(data: IJob) {
    return this.jobsCollection.add(data)
  }

  getAllJobs() {
    return this.jobsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IJob;
        const docId = a.payload.doc.id;
        return { docId, ...data };
      }))
    );
  }

  getJob(id: string) {
    return this.jobsCollection.doc(id).snapshotChanges()
      .pipe(
        map(changes => {
          const data = changes.payload.data() as IJob;
          const docId = changes.payload.id;

          return { docId, ...data }
        })
      )
  }

  updateJob(id: string, data: IEditJob) {
    return this.jobsCollection.doc(id).update({
      ...data
    })
  }

  deleteJob(id: string) {
    this.jobsCollection.doc(id).delete()
  }

  applyForJob(id: string) {
    let candidate: ICandidate = {
      email: '',
      uid: '',
      status: 'Pending'
    }

    return this.auth.getUserInfo().subscribe(data => {
      candidate.email = data.email
      candidate.uid = data.docId,

        this.jobsCollection.doc(id).update({
          candidates: firebase.firestore.FieldValue.arrayUnion(candidate)
        }
        )
    })
  }

  async approveCandidate(jobId: string, candidate: ICandidate) {
    let approvedCandidate: ICandidate = {
      status: 'Approved',
      email: candidate.email,
      uid: candidate.uid
    }

    //ToDo: Make other candidates rejected
    const docRef = this.jobsCollection.doc(jobId).ref
    const docSnap = await getDoc(docRef);

    let candidatesArray: ICandidate[] = []
    if (docSnap.exists()) {
      candidatesArray = docSnap.data().candidates as Array<ICandidate>

      candidatesArray.forEach(currCandidate => {
        if (currCandidate.uid == candidate.uid) {
          currCandidate.status = 'Approved'
        } else {
          currCandidate.status = 'Rejected'
        }
      });
    } else {
      console.log("No such document!");
      return
    }

    this.jobsCollection.doc(jobId).update({
      candidates: candidatesArray,
      isActive: false
    })
  }

  rejectCandidate(jobId: string, candidate: ICandidate) {
    let rejectedCandidate: ICandidate = {
      status: 'Rejected',
      email: candidate.email,
      uid: candidate.uid
    }

    this.jobsCollection.doc(jobId).update({
      candidates: firebase.firestore.FieldValue.arrayRemove(candidate)
    }).then(() => {
      this.jobsCollection.doc(jobId).update({
        candidates: firebase.firestore.FieldValue.arrayUnion(rejectedCandidate),
      })
    })
  }

  canModify(jobId: string) {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return EMPTY
        }

        let query = this.jobsCollection.ref.where(firebase.firestore.FieldPath.documentId(), '==', jobId)
          .where('uid', '==', user.uid)
        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IJob>).docs?.length > 0))
  }

  likeJob(jobId: string) {
    this.auth.user$.subscribe(user => {
      if (!user) {
        return EMPTY
      }

      return this.jobsCollection.doc(jobId).update({ likes: firebase.firestore.FieldValue.arrayUnion(user.uid) })
    })
  }

  dislikeJob(jobId: string) {
    this.auth.user$.subscribe(user => {
      if (!user) {
        return EMPTY
      }

      return this.jobsCollection.doc(jobId).update({ likes: firebase.firestore.FieldValue.arrayRemove(user.uid) })
    })
  }
  //TODO: Type of the likes in job model --> should it be any
}
