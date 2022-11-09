import { Component, OnInit, Input } from '@angular/core';
import IJob from 'src/app/models/job.model';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  @Input() title = ''
  @Input() category = ''
  @Input() type = ''
  @Input() link = ''

  constructor() { }

  ngOnInit(): void {
  }
  
}
