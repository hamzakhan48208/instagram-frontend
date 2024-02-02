import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit{
  faHouse = faHouse;

  constructor(private userService: UserService, private router: Router){};
  posts: any= [];
  showMenu: boolean = false;

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

    //only if user is available
    if(this.userService.user){
      this.userService.getTimelinePosts().subscribe((posts) => {
        this.posts = posts;
        console.log(this.posts);
        console.log("Hi");
      });
    }

    //listen to changes
    this.userService.postDeleted.subscribe((deleteId) => {
      //hide show menu
      this.showMenu = false;
      //delete from local
      console.log("Entry deleted!!! Now you can deleted from local!");

      this.posts = this.posts.filter(post => post._id != deleteId);
    });
  }

}
