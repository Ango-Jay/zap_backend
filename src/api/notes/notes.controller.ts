import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note-dto';
import { NotesService } from './notes.service';
import { UpdateNoteDto } from './dto/update-note-dto';
import { UserGuard } from '../../common/guards/user.guard';

@Controller('notes')
@UseGuards(UserGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    async create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(createNoteDto, req.user.id);
    }

    @Get()
    async findAll() {
        return this.notesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.notesService.findOne(id);
        } catch (error) {
            throw new NotFoundException(`Note with ID ${id} not found`);
        }
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNoteDto: UpdateNoteDto
    ) {
        try {
            return await this.notesService.update(id, updateNoteDto);
        } catch (error) {
            throw new NotFoundException(`Note with ID ${id} not found`);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.notesService.remove(id);
        } catch (error) {
            throw new NotFoundException(`Note with ID ${id} not found`);
        }
    }
}
