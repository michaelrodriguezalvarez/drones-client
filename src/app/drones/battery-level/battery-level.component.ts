import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DroneServiceProxy,
  DroneDto,
  CheckDronesRequestDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './battery-level.component.html',
})
export class BatteryLevelComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  drone = new DroneDto();
  batteryLevel = 0;

  constructor(
    injector: Injector,
    private _droneService: DroneServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._droneService
      .get(this.id)
      .subscribe((result: DroneDto) => {
        this.drone = result;
      });
    let request: CheckDronesRequestDto = new CheckDronesRequestDto();
    request.keyword = '';
    request.droneId = this.id;
    request.descending = true;
    request.skipCount = 0;
    request.maxResultCount = 1000;
    this._droneService
      .checkBatteryLevel(request)
      .subscribe((result: number) => {
        this.batteryLevel = result;
      });
  }
}



