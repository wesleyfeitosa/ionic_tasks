import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskSavePage } from './task-save.page';

const routes: Routes = [
  {
    path: '',
    component: TaskSavePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TaskSavePage]
})
export class TaskSavePageModule { }
