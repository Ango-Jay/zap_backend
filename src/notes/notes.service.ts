import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create(createNoteDto);
    return await this.notesRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.find();
  }

  async findOne(id: string): Promise<Note> {
    return await this.notesRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    await this.notesRepository.update(id, updateNoteDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.notesRepository.delete(id);
  }
}
