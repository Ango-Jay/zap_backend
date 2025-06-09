import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note-dto'
import { UpdateNoteDto } from "./dto/update-note-dto";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    try {
      const note = this.notesRepository.create({
        title: createNoteDto.title || null,
        content: createNoteDto.content || null,
        user_id: userId
      });
      return await this.notesRepository.save(note);
    } catch (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.find();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    Object.assign(note, updateNoteDto);
    return await this.notesRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
  }
}
