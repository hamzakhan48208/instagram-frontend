import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map, finalize } from "rxjs/operators";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit{
  message: string;
  imagePath: string;
  url: any;
  username: string;
  userProfilePhoto: string;
  file;
  downloadURL;
  fb;
  isLoading: boolean = false;
  userPost: any;

  isEdit: boolean = false;


  constructor(private userService: UserService,
    private storage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute,
    ){}

  ngOnInit(): void {
    //IMP line, to load the user
    if(!this.userService.user){
      this.userService.loadUser();
    }

    this.username = this.userService.user.username;
    this.userProfilePhoto = this.userService.user.profilePicture;

    if(this.route.snapshot.paramMap.get('postId')){
      //set edit to true
      this.isEdit = true;

      console.log("Post ID");
      console.log(this.route.snapshot.paramMap.get('postId'));

      this.userService.getPostById(this.route.snapshot.paramMap.get('postId')).subscribe((post)=> {
        this.userPost = post;

        //set values
        this.message = this.userPost.description,
        this.url = this.userPost.image;
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

  post(){
    //set loading
    this.isLoading = true;


    //first upload image to firebase
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

              //upload post
              this.uploadPost(this.fb);
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
        if(this.isEdit === true){
          if(this.url != ""){
            this.uploadPost(this.url);
          }
          else{
            this.uploadPost("");
          }
        }
        else{
          this.uploadPost("");
        }

      }
  }

  uploadPost(imageUrl: string){
    if(!this.isEdit){
      //simple post
      const post = {
        userId: this.userService.user._id,
        image: imageUrl,
        description: this.message,
        likes: [],
        comments: []
      };

      this.userService.createPost(post).subscribe((newPost) => {
        //hide loading
        this.isLoading = false;

        alert("Post created successfully");
        //navigate to home
        this.router.navigate(['']);
      });
    }
    else{
      //edit post
      const post = {
        userId: this.userService.user._id,
        image: imageUrl,
        description: this.message,
        likes: this.userPost.likes,
        comments: this.userPost.comments
      }
      //update
      this.userService.updatePost(post, this.route.snapshot.paramMap.get('postId')).subscribe((res)=> {
        alert("Post updated successfully!");

        //navigate to home with the refreshed posts
        this.router.navigate(['']);
      });
    }

  }
}
