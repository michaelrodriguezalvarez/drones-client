import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  CheckDronesRequestDto,
  DroneDto,
  DroneDtoPagedResultDto,
  DroneServiceProxy,
  MedicationDto,
  MedicationDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { LoadDroneComponent } from './load-drone/load-drone.component';
import { UnloadDroneDto } from '@shared/service-proxies/service-proxies';

class PagedMedicationRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './load.component.html',
  animations: [appModuleAnimation()]
})
export class LoadComponent extends PagedListingComponentBase<MedicationDto> implements OnInit {
  drones: DroneDto[] = [];
  medications: MedicationDto[] = [];
  keyword = '';
  droneId: number;
  advancedFiltersVisible = true;

  constructor(
    injector: Injector,
    private _droneService: DroneServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
    this._droneService
      .getAll(
        '', '', true, 0, 10000
      )
      .subscribe((result: DroneDtoPagedResultDto) => {
        this.drones = result.items;
      });
  }

  list(
    request: CheckDronesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.droneId = this.droneId;

    console.log(request);

    this._droneService
      .checkLoaded(request)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: MedicationDtoPagedResultDto) => {
        this.medications = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(medication: MedicationDto): void {
    abp.message.confirm(
      this.l('MedicationUnloadWarningMessage', medication.name),
      undefined,
      (result: boolean) => {
        if (result) {
          let unloadDroneDto: UnloadDroneDto = new UnloadDroneDto();
          unloadDroneDto.droneId = this.droneId;
          unloadDroneDto.medicationId = medication.id;
          this._droneService
            .unload(unloadDroneDto)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyUnloaded'));
                this.refresh();
              })
            )
            .subscribe(() => { });
        }
      }
    );
  }

  loadDrone(): void {
    let loadDroneDialog: BsModalRef;
    loadDroneDialog = this._modalService.show(
      LoadDroneComponent,
      {
        class: 'modal-lg',
        initialState: {
          id: this.droneId,
        },
      }
    );
    loadDroneDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}


