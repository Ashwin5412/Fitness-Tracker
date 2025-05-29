import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashComponent } from './dash/dash.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  {
    path: 'signup',
    component:SignupComponent
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'dash',
    component:DashComponent
  },
  {
    path: 'about',
    component:AboutComponent
  },
  {
    path: 'contact',
    component:ContactComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
