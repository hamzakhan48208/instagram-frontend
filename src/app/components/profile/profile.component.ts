import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  more = faGripLines;
  profileUser: string;
  profileUserInfo;
  userPosts: any = [];

  totalFollowers = 0;
  totalFollowing = 0;

  isFollowing: boolean = false;
  isOwnProfile: boolean = false;

  isLoading: boolean = false;
  showMenu: boolean = false;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
    ){};

  ngOnInit(): void {
    //listen to change in routing params
    this.route.params.subscribe((newParams) => {
       this.profileUser =  newParams['username'];

            //IMP line, to load the user
          if(!this.userService.user){
            this.userService.loadUser();
            this.profileUser = (this.route.snapshot.paramMap.get('username'));
          }

          this.getUserInfo();
          this.getUserPosts();

          //check if own profile
          if(this.profileUser === this.userService.user.username){
            //hide follow button
            this.isOwnProfile = true;
          }
    });

  }

  getUserInfo(){
    this.userService.getUser(this.profileUser).subscribe((userInfo) => {
      this.profileUserInfo = userInfo;
      console.log('User');
      console.log(this.profileUserInfo);

      //set follow button
      this.setFollowButton();
      //set followers and followings
      this.totalFollowers = this.profileUserInfo.followers.length;
      this.totalFollowing = this.profileUserInfo.following.length;
    });
  }

  getUserPosts(){
    this.userService.getUserPosts(this.profileUser).subscribe((userPosts) => {
      this.userPosts = userPosts;
      console.log('Posts');
      console.log(this.userPosts);
    });
  }

  setFollowButton(){
    //already following
    if(this.profileUserInfo.followers.includes(this.userService.user._id)){
      this.isFollowing = true;
    }
    else{
      this.isFollowing = false;
    }
  }


  followUser(){
    //disable button
    this.isLoading = true;

    const user = {
      "username": this.userService.user.username,
    };

    if(this.isFollowing === false){
      //follow user
      this.userService.followUser(user, this.profileUser).subscribe((res)=> {
        console.log(res);

        this.isFollowing = true;

        //enable button
        this.isLoading = false;

      //increase followers
      this.totalFollowers = this.totalFollowers + 1;
      });

    }
    else{
      //unfollow user
      this.userService.unfollowUser(user, this.profileUser).subscribe((res)=> {
        console.log(res);

        this.isFollowing = false;

        //enable button
        this.isLoading = false;

        //decrease followers
        this.totalFollowers = this.totalFollowers - 1;
      });

    }
  }

  navigateToPost(userPost){
    this.router.navigate(['posts', this.profileUserInfo.username, userPost._id]);
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
}
