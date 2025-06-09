import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  cloudProvider: string;

  @Column({ nullable: true })
  cloudProviderId: string;

  @Column('uuid')
  noteId: string;

  @Column({ nullable: false })
  type: string;

  @ManyToOne(() => Note, note => note.attachments)
  @JoinColumn({ name: 'noteId' })
  note: Note;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 