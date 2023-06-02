import { Component, OnInit } from '@angular/core';
import { DroneServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit {
  [x: string]: any;
  activeJobs = false;

  constructor(private _droneService: DroneServiceProxy) { }

  ngOnInit() {
  }

  changeStatus() {
    this._droneService
      .checkDronesBatteryLevelsActivate(this.activeJobs)
      .subscribe((result: any) => {
        abp.notify.success(this.l('SuccessfullyDeleted'));
      });
  }
}
