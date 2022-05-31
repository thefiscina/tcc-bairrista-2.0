import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './screens/index/index.component';
import { LoginComponent } from './screens/login/login.component';
import { PrincipalComponent } from './screens/principal/principal.component';
import { RegisterComponent } from './screens/register/register.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent,  pathMatch: 'full' },
  { path: 'principal', component: PrincipalComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: '**', component: PrincipalComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
