import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DroneServiceProxy,
  DroneDto
} from '@shared/service-proxies/service-proxies';
import { forEach as _forEach, map as _map } from 'lodash-es';

@Component({
  templateUrl: './create-drone.component.html'
})
export class CreateDroneComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  drone = new DroneDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _droneService: DroneServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.drone.model = "Lightweight";
    this.drone.state = "IDLE";
  }

  save(): void {
    this.saving = true;

    const drone = new DroneDto();
    drone.init(this.drone);
    drone.tenantId = this.appSession.tenantId;

    this._droneService
      .register(drone)
      .subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
  }
}

