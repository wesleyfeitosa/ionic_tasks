import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss'],
})
export class TasksListPage {

  tasks$: Observable<Task[]>;

  constructor(
    private tasksService: TasksService,
    private navController: NavController,
    private overlayService: OverlayService
  ) { }

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.tasks$ = this.tasksService.getAll();
    this.tasks$.pipe(take(1)).subscribe(tasks => loading.dismiss());
  }

  onUpdate(task: Task): void {
    this.navController.navigateForward(['tasks', 'edit', task.id]);
  }

  async onDelete(task: Task): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente quer deletar a tarefa "${task.title}"?`,
      buttons: [
        {
          text: 'SIM',
          handler: async () => {
            await this.tasksService.delete(task);
            await this.overlayService.toast({
              message: `Tarefa "${task.title}" deletada!`,
            })
          }
        },
        'NÃO'
      ]
    })
  }

  async onDone(task: Task): Promise<void> {
    const taskToUpdate = { ...task, done: !task.done };
    await this.tasksService.update(taskToUpdate);
    await this.overlayService.toast({
      message: `Tarefa "${task.title}" ${taskToUpdate.done ? 'completada' : 'atualizada'}!`
    })
  }

}
