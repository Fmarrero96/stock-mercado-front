import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { publicGuard } from './public-guard';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [publicGuard] }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
