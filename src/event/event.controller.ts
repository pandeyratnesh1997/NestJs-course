import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Rest api with events
@Controller('/events')
export class EventController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  @Get()
  async findAll() {
    return await this.eventRepository.find();
  }
  @Get('/:id')
  async findOne(@Param('id') id) {
    console.log('id', id);
    const event = await this.eventRepository.findOne({ where: { id } });
    return event;
  }
  @Post()
  async create(@Body(ValidationPipe) input: CreateEventDto) {
    const newEvent = {
      ...input,
      when: new Date(input.when),
    };
    await this.eventRepository.save(newEvent);
    return newEvent;
  }
  @Patch(':id')
  @HttpCode(200)
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto) {
    console.log('input', typeof id);
    const event = await this.eventRepository.findOne({ where: { id } });
    console.log('event', event);
    if (!event) {
      return { statusCode: 404, message: 'Event not found' };
    }
    return await this.eventRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.eventRepository.findOne(id);
    await this.eventRepository.remove(event);
  }
}
