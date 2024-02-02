import { Component, OnInit } from '@angular/core';
import { faHouse, faCompass } from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  faHouse = faHouse;
  faPlus = faPlus;
  faLogOut = faArrowRightFromBracket;
  faCompass = faCompass;
  username: string;
  userProfilePhoto: string;

  constructor(private userService: UserService,
    private router: Router){
  };

  ngOnInit(): void {
    this.username = this.userService.user.username;
    this.userProfilePhoto = this.userService.user.profilePicture;
    console.log("Sidebar Init");
    console.log(this.userService.user);

    //listen to changes
    this.userService.userChanged.subscribe((newUser) => {
      this.userProfilePhoto = newUser.profilePhoto;
    });
  }

  logOut(){
    //clear user
    this.userService.logOutUser();
    //navigate to login screen
    this.router.navigate(['login']);
  }

  navigateToCreate(){
    this.router.navigate(['create']);
  }

  navigateToHome(){
    this.router.navigate(['']);
  }

  navigateToProfile(){
    this.router.navigate(['profile', this.username]);
  }

  navigateToViewMore(){
    this.router.navigate(['users']);
  }
}
