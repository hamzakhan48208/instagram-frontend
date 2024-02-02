import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  users: any= [];
  user;

  constructor(private router: Router, private userService: UserService){};

  ngOnInit(): void {
    //get feeds of current user
    //first check and initialize user
    if(!localStorage.getItem('user')){
      //navigate to login screen
      this.router.navigate(['login']);
    }
    else if(!this.userService.user){
      //initialize user
      this.userService.loadUser();
    }

    this.getUsers();
  }

  getUsers(){
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  navigateToProfilePage(user){
    this.router.navigate(['profile', user.username]);
  }


}
