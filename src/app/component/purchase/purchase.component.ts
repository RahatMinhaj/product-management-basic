import {AfterViewInit, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {Store} from "../../models/store";
import {PurchaseService} from "../../services/purchase.service";
import {StoreService} from '../../services/store.service';
import {ItemService} from '../../services/item.service';
import {Item} from '../../models/Item';
import {DateAndTime} from "../../utils/date-and-time";
import {BaseListComponentImpl} from "../../core/base-list-component";
import {Purchase} from "../../models/purchase";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent extends BaseListComponentImpl<Purchase> implements AfterViewInit{
  purchaseForm: FormGroup;
  isEditing = false;
  selectedItemId: number | null = null;
  isLoading = false;

  override displayedColumns: string[] = ['purchaseId', 'itemName', 'storeName','quantity', 'purchasePrice', 'createdAt', 'action'];
  storeList: Store[] = [];
  itemList: Item[] = [];

  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private storeService: StoreService,
    private itemService: ItemService
  ) {
    super();
    this.purchaseForm = this.fb.group({
      itemId: ['', ],
      storeId: [''],
      quantity: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required]]
    });
  }

  getData(params: any) {
    return this.purchaseService.getAll(params);
  }

  onSubmit(): void {
    console.log('Submit clicked. isEditing:', this.isEditing);
    console.log('selectedItemId:', this.selectedItemId);

    if (this.purchaseForm.valid) {
      this.isLoading = true;
      const formData = this.purchaseForm.value;

      if (this.isEditing && this.selectedItemId) {
        this.purchaseService.update(this.selectedItemId, formData).subscribe({
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
        this.purchaseService.save(formData).subscribe({
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

  editStore(purchase: any): void {
    console.log(purchase)
    this.isEditing = true;
    this.selectedItemId = purchase.purchaseId ?? null;
    console.log(this.selectedItemId)
    this.purchaseForm.patchValue({
      itemId: purchase.itemDto?.itemId,
      storeId: purchase.storeDto?.storeId,
      quantity: purchase.quantity,
      purchasePrice: purchase.purchasePrice,
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
        this.purchaseService.deleteById(id).subscribe({
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
    this.purchaseForm.reset();
    this.isEditing = false;
    this.selectedItemId = null;
    this.getDataFromService();
  }

  loadStores(){
    this.storeService.getAll().subscribe(
      (stores) => {
        this.storeList = stores;
      },
      (error) => {
        console.error('Error fetching stores:', error);
      }
    );
  }

  loadItems(){
    this.itemService.getAll().subscribe({
      next: (items) => {
        this.itemList = items;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  protected readonly DateAndTime = DateAndTime;

  ngAfterViewInit(): void {
    this.loadStores();
    this.loadItems();
  }

}
