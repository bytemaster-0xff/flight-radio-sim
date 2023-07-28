import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UntoweredComponent } from './untowered/untowered.component';

const routes: Routes = [
  {path: '', component:UntoweredComponent},
  {path: 'untowered', component:UntoweredComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
