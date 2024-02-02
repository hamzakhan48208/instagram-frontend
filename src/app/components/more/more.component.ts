import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrl: './more.component.css'
})
export class MoreComponent {
  @Input() type: string;
  @Input() itemId: number;

  constructor(private router: Router, private userService: UserService){};

  edit(){
    if(this.type === "post"){
      //for post
      this.router.navigate(['editPost', this.itemId.toString()]);
    }
    else{
      //for user
      console.log(`${this.type} ${this.itemId}`);
      this.router.navigate(['editUser', this.itemId.toString()]);


    }
  }

  del(){
    if(this.type === "post"){
      //for post
      this.userService.deletePost(`${this.itemId}`).subscribe(()=> {
        //delete from local
        this.userService.postDeleted.emit(this.itemId);
      })
    }
    else{
      //for user
      console.log(`${this.type} ${this.itemId}`);
      this.userService.deleteUserById(`${this.itemId}`).subscribe((res) => {
        //navigate to login screen
        this.router.navigate(['login']);
      })
    }
  }

}
