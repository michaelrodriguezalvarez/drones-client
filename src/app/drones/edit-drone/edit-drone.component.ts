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
  DroneDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './edit-drone.component.html'
})
export class EditDroneComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
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
    this._droneService
      .get(this.id)
      .subscribe((result: DroneDto) => {
        this.drone = result;
      });
  }

  save(): void {
    this.saving = true;

    const drone = new DroneDto();
    drone.init(this.drone);
    drone.tenantId = this.appSession.tenantId;

    this._droneService.update(drone).subscribe(
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


