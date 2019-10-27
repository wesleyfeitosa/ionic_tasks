import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-task-save',
  templateUrl: './task-save.page.html',
  styleUrls: ['./task-save.page.scss'],
})
export class TaskSavePage implements OnInit {

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private navController: NavController,
    private overlayService: OverlayService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      done: [false],
    })
  }

  // Método que grava a nova tarefa no banco
  async onSubmit(): Promise<void> {
    // inicia a animação de carregamento
    const loading = await this.overlayService.loading({
      message: 'Saving...' // com uma mensagem
    });
    try {
      // a partir do método create de tasksService é criada a tarefa no banco
      const task = await this.tasksService.create(this.taskForm.value);
      // depois da tarefa criada é feito o redirecionamento para página que lista as tarefas
      this.navController.navigateBack('/tasks');
    } catch (error) {
      // em caso de erro é mostrado um aviso na tela do usuário
      await this.overlayService.toast({
        message: error.message
      })
    } finally {
      // ao final de toda a execução a animaão de carregamento é finalizada
      loading.dismiss();
    }
  }

}
