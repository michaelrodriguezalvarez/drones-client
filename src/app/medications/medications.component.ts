import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  MedicationServiceProxy,
  MedicationDto,
  MedicationDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateMedicationComponent } from './create-medication/create-medication.component';
import { EditMedicationComponent } from './edit-medication/edit-medication.component';
import { ImageMedicationComponent } from './image-medication/image-medication.component';

class PagedMedicationRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './medications.component.html',
  animations: [appModuleAnimation()]
})
export class MedicationsComponent extends PagedListingComponentBase<MedicationDto> {
  medications: MedicationDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _medicationService: MedicationServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedMedicationRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._medicationService
      .getAll(request.keyword, '', true, request.skipCount, request.maxResultCount)
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
      this.l('MedicationDeleteWarningMessage', medication.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._medicationService
            .delete(medication.id)
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

  createMedication(): void {
    this.showCreateOrEditMedicationDialog();
  }

  editMedication(medication: MedicationDto): void {
    this.showCreateOrEditMedicationDialog(medication.id);
  }

  showCreateOrEditMedicationDialog(id?: number): void {
    let createOrEditMedicationDialog: BsModalRef;
    if (!id) {
      createOrEditMedicationDialog = this._modalService.show(
        CreateMedicationComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditMedicationDialog = this._modalService.show(
        EditMedicationComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditMedicationDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  editImageMedication(medication: MedicationDto): void {
    this.showEditImageMedicationDialog(medication.id);
  }

  showEditImageMedicationDialog(id?: number): void {
    let editImageMedicationDialogDialog: BsModalRef;
    editImageMedicationDialogDialog = this._modalService.show(
      ImageMedicationComponent,
      {
        class: 'modal-lg',
        initialState: {
          id: id,
        },
      }
    );
    editImageMedicationDialogDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}

