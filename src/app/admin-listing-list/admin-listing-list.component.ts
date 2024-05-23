import {Component, OnInit, ViewChild} from '@angular/core';
import {MinimalListing} from "../model/MinimalListing";
import {Router} from "@angular/router";
import {ListingService} from "../service/ListingService";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-admin-listing-list',
  templateUrl: './admin-listing-list.component.html',
  styleUrl: './admin-listing-list.component.css'
})
export class AdminListingListComponent implements OnInit {
  listings: MinimalListing[] = []; // Lista listărilor minimale
  dataSource!: MatTableDataSource<MinimalListing> ; // Sursa de date pentru MatTable
  displayedColumns: string[] = ['mainPicture', 'title', 'publishingDate', "details"]; // Coloanele afișate în tabel

  @ViewChild(MatPaginator) paginator!: MatPaginator ; // Paginator

  constructor(private router: Router,
              private listingService: ListingService) { }

  ngOnInit(): void {
    this.listingService.getListingsAdmin().subscribe(
      (data: MinimalListing[]) => {
        this.dataSource = new MatTableDataSource<MinimalListing>(data);
      }
    )
  }

  navigateToListingDetails(listingUUID: String) {
    if (listingUUID) {
      this.router.navigate(['/admin/listing', listingUUID]);
    }
  }
  }

