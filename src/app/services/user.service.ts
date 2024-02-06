import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient){}
  private url = "https://instagram-server-delta.vercel.app/api/auth/";
  private postsUrl = "https://instagram-server-delta.vercel.app/api/post/"
  private usersUrl = "https://instagram-server-delta.vercel.app/api/user/";
  public user : {_id: number, username: string, password: string, profilePicture: string, description: string, followers: number, followings: number};
  postDeleted = new EventEmitter();
  userChanged = new EventEmitter();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(error);
    };
  }

  //USERS
  //====================================================

  //add User
  addUser(user: any): Observable<any> {
    return this.http.post(this.url+'register', user, this.httpOptions)
      .pipe(
        catchError(this.handleError('addUser', user))
      );
  }

  //login user
  loginUser(user: any): Observable<any>{
    return this.http.post(this.url+'login', user, this.httpOptions)
    .pipe(
      catchError(this.handleError('loginUser', user))
    );
  }

  //set User
  setUser(user: any){
    this.user = user;
    //set user in session
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  updateUser(user: any){
    this.user.profilePicture = user.profilePicture;
    this.user.description = user.description;
  }

  //logOut user
  logOutUser(){
    this.user = null;
    //clear user from session
    localStorage.clear();
  }

  //initialize user
  loadUser(){
    if(!this.user){
      //load current user
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  //get all users
  getAllUsers(){
    return this.http.get(this.usersUrl+'allUsers/all').pipe(
      catchError(this.handleError('getAllUsers'))
    );
  }

  //get user profile
  getUser(username: string){
    return this.http.get(this.usersUrl+username).pipe(
      catchError(this.handleError('getUser'))
    );
  }

  //get user profile by id
  getUserById(userId: string){
    return this.http.get(this.usersUrl+'id/'+userId).pipe(
      catchError(this.handleError('getUserById'))
    );
  }

  //update user by Id
  updateUserById(user: any, userId: string){
    return this.http.put(this.usersUrl+'update/'+userId, user, this.httpOptions).pipe(
      catchError(this.handleError('updateUserById'))
    );
  }

  //delete user
  deleteUserById(userId: string){
    return this.http.delete(this.usersUrl+'delete/'+userId, this.httpOptions).pipe(
      catchError(this.handleError('deleteUserById'))
    );
  }

  //POSTS
  //====================================================

  //get timeline posts
  getTimelinePosts(){
    return this.http.get(this.postsUrl+'timeline/all/'+this.user.username).pipe(
      catchError(this.handleError('getTimelinePosts'))
    );
  }
  //get specific users posts
  getUserPosts(username: string){
    return this.http.get(this.postsUrl+'timeline/'+username).pipe(
      catchError(this.handleError('getUserPosts'))
    );
  }

  //add comment
  addComment(comment: any, postId: string): Observable<any>{
    return this.http.post(this.postsUrl+'addComment/'+postId, comment, this.httpOptions)
    .pipe(
      catchError(this.handleError('addComment', comment))
    );
  }

  //like post
  likePost(user: any, postId: string): Observable<any>{
    return this.http.post(this.postsUrl+'like/'+postId, user, this.httpOptions)
    .pipe(
      catchError(this.handleError('likePost', user))
    );
  }

  //create post
  createPost(post: any): Observable<any>{
    return this.http.post(this.postsUrl+'create', post, this.httpOptions)
    .pipe(
      catchError(this.handleError('createPost', post))
    );
  }

  //follow user
  followUser(user: any, userToFollow: string): Observable<any> {
    return this.http.post(this.usersUrl+'follow/'+userToFollow, user, this.httpOptions)
    .pipe(
      catchError(this.handleError('followUser', user))
    );
  }

  //unfollow user
  unfollowUser(user: any, userToFollow: string): Observable<any> {
    return this.http.post(this.usersUrl+'unfollow/'+userToFollow, user, this.httpOptions)
    .pipe(
      catchError(this.handleError('unfollowUser', user))
    );
  }

  //get post by id
  getPostById(postId: string){
    return this.http.get(this.postsUrl+'getPost/'+postId).pipe(
      catchError(this.handleError('getPostById'))
    );
  }

  //update post by id
  updatePost(post: any, postId: string): Observable<any> {
    return this.http.put(this.postsUrl+'update/'+postId, post, this.httpOptions)
    .pipe(
      catchError(this.handleError('updatePost', post))
    );
  }

  //delete post by id
  deletePost(postId: string): Observable<any> {
    return this.http.delete(this.postsUrl+'delete/'+postId, this.httpOptions)
    .pipe(
      catchError(this.handleError('deletePost'))
    );
  }

}
