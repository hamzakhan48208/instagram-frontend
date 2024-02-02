import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { faC, faGripLines } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  more = faGripLines;
  heart = faHeart
  comment = faComment;

  liked: boolean = false;
  user: {_id: number, username: string, password: string, profilePicture: string, description: string, followers: number, followings: number};
  postUser;
  isCommentsVisible: boolean = false;
  comments = [];
  newComment: string;
  totalLikes;
  isOwnProfile: boolean = false;
  showMenu: boolean = false;

  @Input() post;

  constructor(private userService: UserService, private router: Router){};

  ngOnInit(): void {
    this.user = this.userService.user;
    this.comments = this.post.comments;

    if(this.post.likes.includes(this.user._id)){
      this.liked = true;
    }
    //get post user
    this.getPostUser();
    this.totalLikes = this.post.likes.length;
    this.checkIfOwnProfile();
  }

  getPostUser(){
    this.userService.getUserById(this.post.userId.toString()).subscribe((postUser) => {
      this.postUser = postUser;
    });
  }

  likePost(){
    //like post
    const user = {
      userId: this.user._id,
    };
    this.userService.likePost(user, this.post._id).subscribe((res) => {
      //toggle ui
      if(res === "liked"){
        this.liked = true;
        this.totalLikes = this.totalLikes + 1;
        console.log('Post liked successfully!');
      }
      else{
        this.liked = false;
        this.totalLikes = this.totalLikes - 1;
        console.log('Post disliked successfully!');
      }
    });
  }

  formatDate(createdAt) {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    if (isNaN(createdAtDate.getTime())) {
      // Handle invalid date string
      return 'Invalid date';
    }

    const diffMilliseconds: number = currentDate.getTime() - createdAtDate.getTime();
    const diffSeconds: number = Math.floor(diffMilliseconds / 1000);
    const diffMinutes: number = Math.floor(diffSeconds / 60);
    const diffHours: number = Math.floor(diffMinutes / 60);
    const diffDays: number = Math.floor(diffHours / 24);
    const diffMonths: number = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
      return `${diffMonths}mo`;
    } else if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return `${diffSeconds}s`;
    }
  }

  viewComments(){
    this.isCommentsVisible = !this.isCommentsVisible;
  }

  //add new comment
  postComment(){
    console.log(this.newComment);

    const comment = {
      "profilePicture": this.userService.user.profilePicture,
      "username": this.userService.user.username,
      "comment": this.newComment,
    };

    //add on the server
    this.userService.addComment(comment, this.post._id).subscribe((newPost) => {
      //add on the local
      const newComment = (newPost.comments.slice(-1)[0]);
      console.log(newComment);
      // console.log(newComment);
      this.comments.push(newComment);

      //clear comment field
      this.newComment = "";

    });
  }

  navigateToProfile(){
    this.router.navigate(['profile', this.postUser.username]);
  }

  checkIfOwnProfile(){
    if(this.post){
      if(this.post.userId === this.userService.user._id){
        this.isOwnProfile = true;
      }
    }
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
}
