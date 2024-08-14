import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { UsersRepository } from '../auth/users.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});

const mockUsersRepository = () => ({
    findOne: jest.fn(),
});


const mockUser = {
    username: 'test',
    id: 'someId',
    password: 'testPass123',
    tasks: []
};

describe('TestService', () => {
    let tasksService: TasksService;
    let tasksRepository;
    let usersRepository;

    beforeEach(async () => {
        // initialize JS module with service and repo
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TasksRepository, useFactory: mockTasksRepository },
                { provide: UsersRepository, useFactory: mockUsersRepository },
            ],
        }).compile();
        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
        usersRepository = module.get(UsersRepository);
    });

    describe('getTasks', () => {
        it('calls TaskRepository.getTasks and returns results', async () => {
            tasksRepository.getTasks.mockResolvedValue("someValue");
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual("someValue");
        });
    });

    describe('getTaskById', () => {
        it('Calls TaskRepository.findOne and returns result', async () => {
            const mockTask= {
                title: "test task",
                description: "test desc",
                id: "someId",
                status: TaskStatus.OPEN
            };
            tasksRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('someId', mockUser)
            expect(result).toEqual(mockTask);

        });
        it('Calls TaskRepository.findOne and returns error', async () => {
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById("someId", mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});