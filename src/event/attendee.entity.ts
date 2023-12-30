import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('attendee')
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  @JoinColumn(
    // Column name in the table we're relating to
    { name: 'event_id' },
  )
  event: Event;
}
