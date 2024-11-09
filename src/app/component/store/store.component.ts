import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StoreService} from "../../services/store.service";
import {Store} from "../../models/store";
import Swal from 'sweetalert2';
import {DateAndTime} from "../../utils/date-and-time";
import {BaseListComponentImpl} from "../../core/base-list-component";

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent extends BaseListComponentImpl<Store>{

  storeForm: FormGroup;
  isEditing = false;
  selectedItemId: number | null = null;
  isLoading = false;

  override displayedColumns: string[] = ['storeId', 'name', 'location','createdAt', 'action'];


  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
  ) {
    super();
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      location: ['',[Validators.required, Validators.maxLength(200)]]
    });
  }

  getData(params: any) {
    return this.storeService.getAll(params);
  }

  onSubmit(): void {
    if (this.storeForm.valid) {
      this.isLoading = true;
      const formData = this.storeForm.value;

      if (this.isEditing && this.selectedItemId) {
        this.storeService.update(this.selectedItemId, formData).subscribe({
          next: () => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Store updated successfully'
            });
            this.resetForm();
            this.getDataFromService();
          },
          error: error => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update store'
            });
          }
        });
      } else {
        console.log('Creating new store');
        this.storeService.save(formData).subscribe({
          next: () => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Store added successfully'
            });
            this.resetForm();
            this.getDataFromService();
          },
          error: error => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add store'
            });
          }
        });
      }
    }
  }

  editStore(store: Store): void {
    console.log('Editing store:', store);
    this.isEditing = true;
    this.selectedItemId = store.storeId ?? null;
    this.storeForm.patchValue({
      name: store.name,
      location: store.location
    });
  }

  deleteStore(id: number | 0): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.storeService.deleteById(id).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: typeof response === 'string' ? response :
                    response.message || 'Store deleted successfully'
            });
            this.getDataFromService();
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: typeof error.error === 'string' ? error.error :
                    error.error?.message || 'Failed to delete store'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.storeForm.reset();
    this.isEditing = false;
    this.selectedItemId = null;
    this.getDataFromService();
  }

  protected readonly DateAndTime = DateAndTime;
}
