import {Component, OnInit} from '@angular/core';
import {UserDTO} from "../model/userDTO";
import {UserService} from "../service/UserService";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users!: UserDTO[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
      this.userService.findAll().subscribe((data: UserDTO[]) => {
        this.users = data;
        console.log(this.users);
      });
  }
}
