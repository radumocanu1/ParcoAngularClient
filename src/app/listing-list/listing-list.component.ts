import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ListingService} from "../service/ListingService";
import {MatTableDataSource} from "@angular/material/table";
import {MinimalListing} from "../model/MinimalListing";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from '@angular/router';
import {AppStateService} from "../service/util/AppStateService";
import {AdvanceFilteringRequest} from "../model/AdvanceFilteringRequest";

@Component({
  selector: 'app-listing-list',
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})
export class ListingListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['picture', 'title', 'sector', 'startDate', 'endDate', 'price', 'publishingDate'];
  hourlyPriceRange: string[] = ['1', '2', '3', '4', '5', '10', '20', 'nedefinit'];
  dailyPriceRange: string[] = ['5','10','20','30', '50', 'nedefinit'];
  advanceFilteringRequest!:AdvanceFilteringRequest
  dataSource = new MatTableDataSource<MinimalListing>();
  filterForm: FormGroup;
  paginatedListings: MinimalListing[] = [];
  minEndDate!: Date | null;
  foundListings:boolean = true
  loading = true;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private listingService: ListingService, private fb: FormBuilder, private router: Router,  private appStateService: AppStateService) {
    this.filterForm = this.fb.group({
      sector: [''],
      startDate: [''],
      endDate: [''],
      maxDailyPrice: [''],
      maxMonthlyPrice:[''],
      indefinitePeriod: [false]
    });
  }
  ngOnDestroy(): void {
    this.appStateService.setState("filters", this.advanceFilteringRequest)
  }
  convertDateToDDMMYYYY(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {
    this.advanceFilteringRequest = this.appStateService.getState("filters");
    if(this.advanceFilteringRequest){
      this.listingService.getFilteredListing(this.advanceFilteringRequest).subscribe(listings => {
        this.dataSource.data = listings;
        this.foundListings = this.dataSource.data.length > 0;
        this.paginateListings();
        this.loading = false;
        console.log( this.advanceFilteringRequest.startDate.toString());
        this.filterForm.patchValue({sector: this.advanceFilteringRequest.sector,
          startDate: this.convertDateString(this.advanceFilteringRequest.startDate.toString()),
          endDate:this.convertDateString(this.advanceFilteringRequest.endDate.toString()),
          maxDailyPrice:this.advanceFilteringRequest.maxDailyPrice,
          maxMonthlyPrice:this.advanceFilteringRequest.maxMonthlyPrice,
          indefinitePeriod:this.advanceFilteringRequest.indefinitePeriod})

      });
    }
    else{
      this.loadListings();
    }
    this.filterForm.get('indefinitePeriod')!.valueChanges.subscribe(value => {
      if (value) {
        this.filterForm.get('endDate')!.disable();
      } else {
        this.filterForm.get('endDate')!.enable();
      }
    });
  }
  convertDateString(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  loadListings(): void {
    this.listingService.getAllListings().subscribe(minimalListings => {
      this.dataSource.data = minimalListings;
      this.dataSource.paginator = this.paginator;
      if(this.dataSource.data.length == 0) {
        this.foundListings = false
      }
      this.dataSource.sort = this.sort;
      this.paginateListings();
      this.loading = false;
    });
  }
  updateEndDateMin(startDate: Date): void {
    if (startDate) {
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1); // Increment by one day
      this.minEndDate = minEndDate;
    } else {
      this.minEndDate = null; // Reset minEndDate if startDate is null
    }
  }
  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }

  applyFilter(): void {
     this.advanceFilteringRequest = this.filterForm.getRawValue()
    if (this.advanceFilteringRequest.startDate) {
      // @ts-ignore
      this.advanceFilteringRequest.startDate = this.convertDateToDDMMYYYY(new Date(this.advanceFilteringRequest.startDate));
    }

    if (this.advanceFilteringRequest.endDate) {
      // @ts-ignore
      this.advanceFilteringRequest.endDate = this.convertDateToDDMMYYYY(new Date(this.advanceFilteringRequest.endDate));
    }
    console.log(this.advanceFilteringRequest);
    this.listingService.getFilteredListing(this.advanceFilteringRequest).subscribe(listings => {
      this.dataSource.data = listings;
      this.foundListings = this.dataSource.data.length > 0;
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
