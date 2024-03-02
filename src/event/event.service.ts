import { Logger, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { ListEvents, whenEventFilterEnum } from "./input/list.event";
import { PaginationOptions, paginate } from "src/pagination/paginator";

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name);
    constructor(
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    ){}

    private getEventsBaseQuery(){
        return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
    }
    public getEventsWithAttendeeCountQuery(){
        return this.getEventsBaseQuery()
        .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
        .loadRelationCountAndMap('e.attendeeAccepted', 'e.attendees', 'attendee', qb => qb.andWhere('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Accepted}))
        .loadRelationCountAndMap('e.attendeeMaybe', 'e.attendees', 'attendee', qb => qb.andWhere('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Maybe}))
        .loadRelationCountAndMap('e.attendeeRejected', 'e.attendees', 'attendee', qb => qb.andWhere('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Rejected}))
    }
    public getEventsWithAttendeeCountFiltered(filter: ListEvents){
        let query = this.getEventsWithAttendeeCountQuery();
        if(!filter){
            return query
        }
        if(filter.when){
            if(filter.when == whenEventFilterEnum.Today){
             query = query.andWhere('e.when >= CURDATE() AND e.when < CURDATE() + INTERVAL 1 DAY')
            }
            if(filter.when == whenEventFilterEnum.Tomorrow){
                query = query.andWhere('e.when >= CURDATE() + INTERVAL 1 DAY AND e.when < CURDATE() + INTERVAL 2 DAY')
            }


            if (filter.when == whenEventFilterEnum.ThisWeek) {
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
            }

            if (filter.when == whenEventFilterEnum.NextWeek) {
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1');
            }
          
        }
        return query;
    }
    public async getEventsWithAttendeeCountFilteredPaginated (filter: ListEvents, PaginationOptions: PaginationOptions){
        return await paginate(
            this.getEventsWithAttendeeCountFiltered(filter),
            PaginationOptions
        )
    }

    public async getEvent(id : number): Promise<Event | undefined>{
        const query = this.getEventsWithAttendeeCountQuery().andWhere('e.id = :id', {id});
        this.logger.debug(query.getSql());
        return await query.getOne();
    }

    public async deleteEvent(id: number): Promise<DeleteResult> {
        return await this.eventRepository?.createQueryBuilder('e').delete()
        .where('id = :id', {id})
        .execute();
    }

    
    
}