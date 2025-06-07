import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Note } from './note.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  noteId: string;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @Column({ type: 'varchar', nullable: false })
  fileName: string;

  @Column({ type: 'int' })
  fileSize: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Note, note => note.attachments)
  @JoinColumn({ name: 'noteId' })
  note: Note;
} 