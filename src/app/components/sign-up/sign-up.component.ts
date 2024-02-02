import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  message: string;
  imagePath: string;
  url: any = 'https://piyushheightsrwa.com/wp-content/uploads/2021/06/default-image.png';
  file: File = null;
  fb;
  downloadURL: Observable<string>;
  isLoading: boolean = false;
  userInfo;
  isEdit: boolean = false;

  //info fiels
  username: string;
  password: string;
  bio: string;

  constructor(private storage: AngularFireStorage,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {

    if(this.route.snapshot.paramMap.get('userId')){
      //check if editUser
      this.isEdit = true;
      //get user info
      this.userService.getUserById(this.route.snapshot.paramMap.get('userId')).subscribe((userInfo)=> {
        this.userInfo = userInfo;

        this.username = this.userInfo.username;
        this.bio = this.userInfo.description;
        this.url = this.userInfo.profilePicture;
      })
    }
  }



  onFileChanged(event){
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    this.file = files[0];


    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
        this.url = reader.result;
    }
  }

  register(){
    //set loading
    this.isLoading = true;

    //upload image on firebase
    if(this.file != null){
      var n = Date.now();
      const filePath = `profilePictures/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`profilePictures/${n}`, this.file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.fb = url;
              }
              //write database code here
              console.log('Completed!!!');
              console.log(this.fb);

              //upload user
              this.addUser(this.fb);

            });
          })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
          }
        });
      }
      else{
        this.addUser(this.url);
      }
  }

  addUser(profilePicture: string){
    if(!this.isEdit){
      const user = {
        "username": this.username,
        "password": this.password,
        "profilePicture": profilePicture,
        "description": this.bio,
        "followers": [],
        "following": [],
      };

      this.userService.addUser(user).subscribe((newUser) => {
        console.log('New User: ');
        console.log(newUser);
        //hide loading
        this.isLoading = false;

        if('error' in newUser){
          alert(newUser.error);
        }
        else{
          console.log("User create successfully")
          alert('User created successfully! You can Login now!');

          //navigate to Login page
          this.router.navigate(['login']);
        }
      });
    }
    else{
      const user = {
        profilePicture: profilePicture,
        description: this.bio,
      };

      //update user
      this.userService.updateUserById(user, this.route.snapshot.paramMap.get('userId')).subscribe((newUser) => {
        //user updated
        //hide loading
        this.isLoading = false;
        console.log(newUser);

        console.log('User updated successfully!');
        alert('User updated successfully!');


        //update user in local
        this.userService.updateUser(newUser);
        //emit changes
        //this.userService.userChanged.emit(newUser);

        //navigate to home
        this.router.navigate(['']);
      });
    }
  }
}
