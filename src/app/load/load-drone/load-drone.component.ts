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
  MedicationDto,
  CheckDronesRequestDto,
  MedicationDtoPagedResultDto,
  MedicationServiceProxy,
  LoadDronesRequestDto,
  CheckLoadedWeightDroneDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';

@Component({
  templateUrl: './load-drone.component.html'
})
export class LoadDroneComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  drone = new DroneDto();
  medicationsSelected: number[] = [];
  medications: MedicationDto[] = [];
  droneLoadedWeight: number = 0;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _droneService: DroneServiceProxy,
    private _medicationService: MedicationServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {

    let checkLoadedWeightDroneDto: CheckLoadedWeightDroneDto = new CheckLoadedWeightDroneDto();
    checkLoadedWeightDroneDto.droneId = this.id;
    this._droneService
      .checkLoadedWeight(checkLoadedWeightDroneDto)
      .subscribe((result: number) => {
        this.droneLoadedWeight = result;
      });

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
      .checkLoaded(request)
      .subscribe((result: MedicationDtoPagedResultDto) => {
        result.items.map((item) => {
          this.medicationsSelected.push(item.id);
        });
      });

    this._medicationService
      .getAll('', '', true, 0, 10000)
      .subscribe((result: MedicationDtoPagedResultDto) => {
        this.medications = result.items;
      });
  }

  save(): void {
    this.saving = true;

    let request: LoadDronesRequestDto = new LoadDronesRequestDto();
    request.droneId = this.id;
    request.medicationItems = this.medicationsSelected;

    this._droneService
      .load(request)
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


