import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string;
  password: string;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router){}

  login(){
    //set loading
    this.isLoading = true;

    const user = {
      "username": this.username,
      "password": this.password
    };
    this.userService.loginUser(user).subscribe((loggedInUser) => {
      if('error' in loggedInUser){
        alert(loggedInUser.error);
        //hide loading
        this.isLoading = false;
      }
      else{
        this.userService.setUser(loggedInUser);
        console.log('User set successfully!');
        console.log(this.userService.user);


        //hide loading
        this.isLoading = false;

        //navigate to feed screen
        this.router.navigate(['']);
      }
    });
  }
}
