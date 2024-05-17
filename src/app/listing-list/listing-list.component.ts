import {Component, OnInit, ViewChild} from '@angular/core';
import {Listing} from "../model/Listing";
import {ListingService} from "../service/ListingService";
import {MatTableDataSource} from "@angular/material/table";
import {MinimalListing} from "../model/MinimalListing";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";

@Component({
  selector: 'app-listing-list',
  templateUrl: './listing-list.component.html',
  styleUrl: './listing-list.component.css'
})
export class ListingListComponent implements OnInit {
  displayedColumns: string[] = ['picture', 'title', 'sector', 'startDate', 'endDate', 'price', 'publishingDate'];
  dataSource = new MatTableDataSource<MinimalListing>();
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private listingService: ListingService, private fb: FormBuilder, private router: Router) {
    this.filterForm = this.fb.group({
      sector: [''],
      startDate: [''],
      endDate: [''],
      price: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.listingService.getAllListings().subscribe(listings => {
      this.dataSource.data = listings;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; // Asigură-te că legi sortarea aici
      console.log(listings);
    });
  }

  // applyFilter(): void {
  //   const filterValues = this.filterForm.value;
  //   this.dataSource.filterPredicate = (data: MinimalListing, filter: string) => {
  //     const searchTerms = JSON.parse(filter);
  //     const matchesSector = searchTerms.sector ? data.sector === searchTerms.sector : true;
  //     const matchesStartDate = searchTerms.startDate ? new Date(data.startDate) >= new Date(searchTerms.startDate) : true;
  //     const matchesEndDate = searchTerms.endDate ? new Date(data.endDate) <= new Date(searchTerms.endDate) : true;
  //     const matchesPrice = searchTerms.price ? data.price === searchTerms.price : true;
  //     const matchesTitle = data.title.toLowerCase().includes(searchTerms.search.toLowerCase());
  //
  //     return matchesSector && matchesStartDate && matchesEndDate && matchesPrice && matchesTitle;
  //   };
  //
  //   this.dataSource.filter = JSON.stringify(filterValues);
  // }
  applyFilter(): void {
    const filterValues = this.filterForm.value;
    // Mock the backend request
    this.listingService.getFilteredListings(filterValues).subscribe(listings => {
      this.dataSource.data = listings;
    });
  }

  applySearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  onRowClick(row: MinimalListing): void {
    this.router.navigate([`/listing/${row.listingUUID}`]); // Assuming title is a unique identifier
  }

}
