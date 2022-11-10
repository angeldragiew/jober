import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IJob from '../models/job.model';
import { map, first } from 'rxjs';
import IEditJob from '../models/edit.job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  public jobsCollection: AngularFirestoreCollection<IJob>
  constructor(private db: AngularFirestore) {
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
}
