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
  NotFoundException,
  Query,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { EventService } from './event.service';
import { ListEvents } from './input/list.event';


// Rest api with events
@Controller('/events')
export class EventController {
  private readonly logger = new Logger(EventController.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventService: EventService,
  ) {}
  // @Get()
  // async findAll() {
  //   return await this.eventRepository.find();
  // }

  // @Get()
  // async findAll(@Query() filter: ListEvents) {
  //   this.logger.debug(filter);
  //   this.logger.log(`Hit the findAll route`);
  //   const events = await this.eventService
  //     .getEventsWithAttendeeCountFiltered(filter);
  //   this.logger.debug(`Found ${events.length} events`);
  //   return events;
  // }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllPaginatedList(@Query() filter: ListEvents) {
    const events = await this.eventService.getEventsWithAttendeeCountFilteredPaginated(filter, {
      total: true,
      currentPage: filter.page,
      limit : 2
    });
    return events;
  
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id : number) {
    // const event = await this.eventRepository.findOne({where: {id}});

    const event = await this.eventService.getEvent(id);
    if(!event){
      throw new NotFoundException();
    }
    return event;
  }
  @Post()
  async create(@Body() input: CreateEventDto) {
    const newEvent = {
      ...input,
      when: new Date(input.when),
    };
    await this.eventRepository.save(newEvent);
    return newEvent;
  }
  @Patch(':id')
  @HttpCode(200)
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.eventRepository.findOne(id);
    return await this.eventRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    // const event = await this.eventRepository.findOne(id);
    // await this.eventRepository.remove(event);
    const result = await this.eventService.deleteEvent(id);
    console.log(result);
    if(result.affected === 0){
      throw new NotFoundException();
    }
    return {
      message : "Event deleted successfully",
      data : result
    }
  }

  @Get('practice2')
  async practice2() {
    try {

      // load entity with relation
      // const event = await this.eventRepository.findOne({
      //   where: { id: 1 },
      //   // relations: ['attendees'],
      // })
      // console.log(event)

    /* Associating relation with querying event and attaching to attendee*/


    // let event = await this.eventRepository.findOne({ where: { id: 1 } });
    // const attendee = new Attendee();
    // attendee.name = 'NestJS';
    // attendee.event = event;

    // await this.attendeeRepository.save(attendee);

    /* Associating relation without querying event only with event instance if id is known and attaching to attendee*/

    // const event = new Event();
    // event.id = 1;
    // const attendee = new Attendee();
    // attendee.name = 'NestJS second';
    // attendee.event = event;

    // await this.attendeeRepository.save(attendee);

      /* Associating relation with cascading */

      const event = await this.eventRepository.findOne({ where: { id: 1 }, relations: ['attendees'] });
      const attendee = new Attendee();
      attendee.name = "Attendee cascading";
      event.attendees.push(attendee);
      await this.eventRepository.save(event);
      

      return event
    } catch (error) {
      console.log(error);
      throw error;
    }
   

  }
  

}
