import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';



@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ length: 100 })
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event , { cascade: true})
  attendees: Attendee[];

  attendeeCount?: number;
  attendeeAccepted?: number;
  attendeeMaybe?: number;
  attendeeRejected?: number;
  

}
