import { Component, OnInit, ViewChild } from '@angular/core';
import { ListingService } from "../service/ListingService";
import { MatTableDataSource } from "@angular/material/table";
import { MinimalListing } from "../model/MinimalListing";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-list',
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})
export class ListingListComponent implements OnInit {
  displayedColumns: string[] = ['picture', 'title', 'sector', 'startDate', 'endDate', 'price', 'publishingDate'];
  dataSource = new MatTableDataSource<MinimalListing>();
  filterForm: FormGroup;
  paginatedListings: MinimalListing[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private listingService: ListingService, private fb: FormBuilder, private router: Router) {
    this.filterForm = this.fb.group({
      sector: [''],
      startDate: [''],
      endDate: [''],
      price: [''],
      search: [''],
      indefinitePeriod: [false]
    });
  }

  ngOnInit(): void {
    this.loadListings();
    this.filterForm.get('indefinitePeriod')!.valueChanges.subscribe(value => {
      if (value) {
        this.filterForm.get('endDate')!.disable();
      } else {
        this.filterForm.get('endDate')!.enable();
      }
    });
  }


  loadListings(): void {
    this.listingService.getAllListings().subscribe(minimalListings => {
      this.dataSource.data = minimalListings;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginateListings();
    });
  }

  applyFilter(): void {
    const filterValues = this.filterForm.value;
    this.listingService.getFilteredListings(filterValues).subscribe(listings => {
      this.dataSource.data = listings;
      this.paginateListings();
    });
  }

  applySearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
    this.paginateListings();
  }

  applySort(sortValue: string): void {
    switch (sortValue) {
      case 'recent':
        this.dataSource.data.sort((a, b) => new Date(b.publishingDate).getTime() - new Date(a.publishingDate).getTime());
        break;
      case 'cheap':
        this.dataSource.data.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        this.dataSource.data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    this.paginateListings();
  }

  changePage(event: PageEvent): void {
    this.paginateListings(event.pageIndex, event.pageSize);
  }

  paginateListings(pageIndex: number = 0, pageSize: number = 5): void {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.paginatedListings = this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  onRowClick(row: MinimalListing): void {
    this.router.navigate([`/listing/${row.listingUUID}`]);
  }
}
