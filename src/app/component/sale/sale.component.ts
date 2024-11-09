import {AfterViewInit, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "../../models/store";
import {Item} from "../../models/Item";
import Swal from "sweetalert2";
import {SaleService} from "../../services/sale.service";
import {DateAndTime} from "../../utils/date-and-time";
import {BaseListComponentImpl} from "../../core/base-list-component";
import {Sale} from "../../models/sale";
import {StoreService} from "../../services/store.service";
import {ItemService} from "../../services/item.service";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent extends BaseListComponentImpl<Sale> implements AfterViewInit{

  saleForm: FormGroup;
  isEditing = false;
  selectedItemId: number | null = null;
  isLoading = false;

  override displayedColumns: string[] = ['saleId', 'itemName', 'storeName','quantity', 'salePrice', 'createdAt', 'action'];
  storeList: Store[] = [];
  itemList: Item[] = [];

  constructor(
    private saleService: SaleService,
    private fb: FormBuilder,
    private storeService: StoreService,
    private itemService: ItemService,
  ) {
    super();
    this.saleForm = this.fb.group({
      saleId: [''],
      itemId: [''],
      storeId: [''],
      quantity: ['', [Validators.required]],
      salePrice: ['', [Validators.required]]
    });
  }


  getData(params: any) {
    return this.saleService.getAll(params);
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      this.isLoading = true;
      const formData = this.saleForm.value;

      if (this.isEditing && this.selectedItemId) {
        this.saleService.update(this.selectedItemId, formData).subscribe({
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
        this.saleService.save(formData).subscribe({
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

  editPurchase(sale: any): void {
    this.isEditing = true;
    this.selectedItemId = sale.saleId ?? null;
    console.log(this.selectedItemId)
    this.saleForm.patchValue({
      itemId: sale.itemDto?.itemId,
      storeId: sale.storeDto?.storeId,
      quantity: sale.quantity,
      salePrice: sale.salePrice,
    });
  }

  deleteSale(id: number | 0): void {
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
        this.saleService.deleteById(id).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: typeof response === 'string' ? response :
                response.message || 'Salw deleted successfully'
            });
            this.getDataFromService();
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: typeof error.error === 'string' ? error.error :
                error.error?.message || 'Failed to delete sale'
            });
          }
        });
      }
    });
  }



  resetForm(): void {
    this.saleForm.reset();
    this.isEditing = false;
    this.selectedItemId = null;
  }

  loadStores() {
    this.storeService.getAll().subscribe(
      (stores) => {
        this.storeList = stores;
      },
      (error) => {
        console.error('Error fetching stores:', error);
      }
    );
  }

  loadItems() {
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
    this.loadItems();
    this.loadStores()
  }
}
