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
  MedicationServiceProxy,
  MedicationDto
} from '@shared/service-proxies/service-proxies';
import { forEach as _forEach, map as _map } from 'lodash-es';

@Component({
  templateUrl: './create-medication.component.html'
})
export class CreateMedicationComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  medication = new MedicationDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _medicationService: MedicationServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void { }

  save(): void {
    this.saving = true;

    const medication = new MedicationDto();
    medication.init(this.medication);
    medication.tenantId = this.appSession.tenantId;

    this._medicationService
      .create(medication)
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

