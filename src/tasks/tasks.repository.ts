import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private usersRepository: UsersRepository
    ) {
        super(
            tasksRepository.target,
            tasksRepository.manager,
            tasksRepository.queryRunner,
        );
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const { username} = user;
        const userEntity = await this.usersRepository.findOne({ where: { username } });
        const task: Task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,

        });
        task.user = userEntity;
        try {
            await this.save(task);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto, userProp: User): Promise<Task[]> {
        const { search, status } = filterDto;
        const { username } = userProp;
        const user = await this.usersRepository.findOne({ where: { username } });
        const query = this.createQueryBuilder('task');

        query.andWhere({ user });
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
        return await query.getMany();

    }
}