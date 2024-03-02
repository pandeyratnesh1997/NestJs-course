import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
} 

@Entity('attendee')
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  @JoinColumn(
    // Column name in the table we're relating to
    { name: 'eventId' },
  )
  event: Event;
  @Column(
    'enum',
    {
      enum: AttendeeAnswerEnum,
      default: AttendeeAnswerEnum.Accepted,
    },
  )
  answer : AttendeeAnswerEnum;
}
