import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FeedComponent } from './components/feed/feed.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ExploreComponent } from './components/explore/explore.component';
import { CreateComponent } from './components/create/create.component';
import { PostComponent } from './components/post/post.component';
import { CommentComponent } from './components/comment/comment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './services/user.service';
import { CustomFeedComponent } from './components/custom-feed/custom-feed.component';
import { MoreComponent } from './components/more/more.component';
import { UsersComponent } from './components/users/users.component';

const routes : Routes = [
  {path: '', component: FeedComponent},
  {path: 'create', component: CreateComponent},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'posts/:username/:postId', component: CustomFeedComponent},
  {path: 'editPost/:postId', component: CreateComponent},
  {path: 'editUser/:userId', component: SignUpComponent},
  {path: 'users', component: UsersComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    FeedComponent,
    SidebarComponent,
    ExploreComponent,
    CreateComponent,
    PostComponent,
    CommentComponent,
    ProfileComponent,
    CustomFeedComponent,
    MoreComponent,
    UsersComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    RouterModule.forRoot(routes),
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
