import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        private readonly tasksRepository: TasksRepository,
        private readonly usersRepository: UsersRepository
        ) {}

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, userProp: User): Promise<Task> {
        const user = await this.usersRepository.findOne({ where: { username: userProp.username } });
        const found = await this.tasksRepository.findOne({ where: { id: id, user: user } });
        if (!found) {
            this.logger.error(`Task with "${id} not found."`);
            throw new NotFoundException(`Task with "${id} not found."`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task: Task = await this.getTaskById(id, user);
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        await this.getTaskById(id, user);
        await this.tasksRepository.delete(id);
    }


}
