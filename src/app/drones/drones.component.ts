import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  DroneServiceProxy,
  DroneDto,
  DroneDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateDroneComponent } from './create-drone/create-drone.component';
import { EditDroneComponent } from './edit-drone/edit-drone.component';

class PagedDroneRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './drones.component.html',
  animations: [appModuleAnimation()]
})
export class DronesComponent extends PagedListingComponentBase<DroneDto> {
  drones: DroneDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _droneService: DroneServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedDroneRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._droneService
      .getAll(request.keyword, '', true, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: DroneDtoPagedResultDto) => {
        this.drones = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(drone: DroneDto): void {
    abp.message.confirm(
      this.l('DroneDeleteWarningMessage', drone.serialNumber),
      undefined,
      (result: boolean) => {
        if (result) {
          this._droneService
            .delete(drone.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => { });
        }
      }
    );
  }

  createDrone(): void {
    this.showCreateOrEditDroneDialog();
  }

  editDrone(drone: DroneDto): void {
    this.showCreateOrEditDroneDialog(drone.id);
  }

  showCreateOrEditDroneDialog(id?: number): void {
    let createOrEditDroneDialog: BsModalRef;
    if (!id) {
      createOrEditDroneDialog = this._modalService.show(
        CreateDroneComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditDroneDialog = this._modalService.show(
        EditDroneComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditDroneDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}


