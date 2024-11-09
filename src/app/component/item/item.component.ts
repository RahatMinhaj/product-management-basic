import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item} from "../../models/Item";
import Swal from 'sweetalert2';
import {DateAndTime} from "../../utils/date-and-time";
import {BaseListComponentImpl} from "../../core/base-list-component";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent extends BaseListComponentImpl<Item>{
  itemForm: FormGroup;
  isEditing = false;
  selectedItemId: number | null = null;
  loading: boolean = false;

  override displayedColumns: string[] = ['itemId', 'name', 'description','price' ,'createdAt','action'];


  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
  ) {
    super();
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  getData(params: any) {
    return this.itemService.getAll(params);
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: this.isEditing ? 'You want to update this item?' : 'You want to add this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          if (this.isEditing && this.selectedItemId) {
            this.itemService.update(this.selectedItemId, this.itemForm.value).subscribe({
              next: () => {
                this.resetForm();
                Swal.fire('Success!', 'Item updated successfully.', 'success');
                this.getDataFromService();
              },
              error: error => {
                console.error('Error updating item:', error);
                Swal.fire('Error!', 'Failed to update item.', 'error');
              },
              complete: () => this.loading = false
            });
          } else {
            const { id, ...newItem } = this.itemForm.value;
            this.itemService.save(newItem).subscribe({
              next: () => {
                this.resetForm();
                this.ngOnInit();
                Swal.fire('Success!', 'Item added successfully.', 'success');
                this.getDataFromService();
              },
              error: error => {
                console.error('Error adding item:', error);
                Swal.fire('Error!', 'Failed to add item.', 'error');
              },
              complete: () => this.loading = false
            });
          }
        }
      });
    }
  }
  editItem(item: Item): void {
    this.isEditing = true;
    this.selectedItemId = item.itemId ?? null;
    this.itemForm.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
    });
    this.ngOnInit();
  }

  deleteItem(id: number | 0): void {
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
        this.loading = true;
        this.itemService.deleteById(id).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: typeof response === 'string' ? response :
                response.message || 'Item deleted successfully'
            });
            this.getDataFromService();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: typeof error.error === 'string' ? error.error :
                error.error?.message || 'Failed to delete Item'
            });
          },
          complete: () => this.loading = false
        });
      }
    });
  }

  resetForm(): void {
    this.itemForm.reset();
    this.isEditing = false;
    this.selectedItemId = null;
    this.getDataFromService();
  }

  protected readonly DateAndTime = DateAndTime;


}
