import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly tasksRepository: TasksRepository) {}

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne({ where: { id } });
        if (!found) {
            throw new NotFoundException(`Task with "${id} not found."`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    // getAllTasks(): Promise<Task[]> {
    //     return this.tasksRepository.find();
    // }
    //
    // getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    //     return this.tasksRepository.getAllTasksWithFilters(filterDto);
    // }


    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task: Task = await this.getTaskById(id);
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with "${id}" not found.`);
        }
    }


}
