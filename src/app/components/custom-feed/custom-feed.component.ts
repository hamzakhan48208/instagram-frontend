import { Component, ElementRef, OnInit, ViewChild, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-feed',
  templateUrl: './custom-feed.component.html',
  styleUrl: './custom-feed.component.css'
})
export class CustomFeedComponent implements OnInit{

  posts: {} = [];
  profileUser: string;
  profileUserPostId: string;
  @ViewChild('feedsElement') feedsElement: ElementRef;




  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
    ){};

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

    this.route.params.subscribe((newParams) => {
      console.log(newParams['username']);
      this.profileUser = newParams['username'];
      this.profileUserPostId = newParams['postId'];
    });

    //display posts
    if(this.userService.user){
      this.userService.getUserPosts(this.profileUser).subscribe((posts) => {
        this.posts = posts;

        setTimeout(() => {
          this.scrollToPost();
        });
      });
    }
  }

  ngAfterViewInit() {
    console.log("After Init View");
    //this.scrollToPost();
  }

  scrollToPost() {
    if (this.profileUserPostId) {
      const selectedPostElement = this.el.nativeElement.querySelector(`#A${this.profileUserPostId}`);


      console.log(selectedPostElement);
      if (selectedPostElement) {
        selectedPostElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

}
