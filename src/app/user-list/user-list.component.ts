import {Component, OnInit} from '@angular/core';
import {UserDTO} from "../model/userDTO";
import {UserService} from "../service/UserService";
import {MinimalUser} from "../model/MinimalUser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users!: MinimalUser[];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.findMostAppreciatedUsers().subscribe(
      (data: MinimalUser[]) => {
        this.users = data;
      });
  }

  navigateToProfile(userUUID: string): void {
    this.router.navigate(['/profile', userUUID]);
  }
}
