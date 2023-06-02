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
  MedicationServiceProxy,
  MedicationDto
} from '@shared/service-proxies/service-proxies';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  templateUrl: './image-medication.component.html',
})
export class ImageMedicationComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  medication = new MedicationDto();
  imageChangedEvent: any = '';
  croppedImage: any = '';

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _medicationService: MedicationServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._medicationService
      .get(this.id)
      .subscribe((result: MedicationDto) => {
        this.medication = result;
      });
  }

  save(): void {
    this.saving = true;

    const medication = new MedicationDto();
    medication.init(this.medication);
    medication.tenantId = this.appSession.tenantId;
    medication.image = this.croppedImage;

    this._medicationService.update(medication).subscribe(
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}


