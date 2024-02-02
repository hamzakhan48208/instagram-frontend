import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit{
  public users: any = [];

  constructor(private userService: UserService,
    private router: Router){};

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    })
  }

  navigateToProfile(user: any){
    //navigate
    this.router.navigate(['profile', user.username]);
  }
}
